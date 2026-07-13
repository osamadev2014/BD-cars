'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile, AuthSession } from '@/types'

interface AuthContextType extends AuthSession {
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  refresh: async () => {},
  signOut: async () => {},
})

function getDevSessionUserId(): string | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)roin_dev_session=([^;]*)/)
    if (!match) return null
    const [encoded] = match[1].split('.')
    const payload = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')))
    return payload?.sub || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthSession>({
    user: null,
    session: null,
    isLoading: true,
  })

  const loadSession = useCallback(async () => {
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      let userId = session?.user?.id

      if (!userId) {
        userId = getDevSessionUserId() || undefined
      }

      if (!userId) {
        setState({ user: null, session: null, isLoading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        const profileData = profile as unknown as {
          id: string; phone: string; full_name: string | null
          avatar_url: string | null; locale: string; is_active: boolean
          created_at: string; updated_at: string; last_sign_in_at: string | null
        }

        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role:roles!inner(slug)')
          .eq('user_id', userId)

        const roles = (userRoles as unknown as { role: { slug: string } }[] || []).map(
          (r: { role: { slug: string } }) => r.role.slug
        )

        setState({
          user: { ...profileData, roles } as UserProfile,
          session,
          isLoading: false,
        })
      } else {
        setState({
          user: {
            id: userId,
            phone: '',
            full_name: null,
            avatar_url: null,
            locale: 'ar',
            is_active: true,
            created_at: '',
            updated_at: '',
            last_sign_in_at: null,
          },
          session,
          isLoading: false,
        })
      }
    } catch {
      setState({ user: null, session: null, isLoading: false })
    }
  }, [])

  useEffect(() => {
    loadSession()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadSession()
      } else {
        setState({ user: null, session: null, isLoading: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [loadSession])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    document.cookie = 'roin_dev_session=; path=/; max-age=0'
    setState({ user: null, session: null, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider
      value={{ ...state, refresh: loadSession, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
