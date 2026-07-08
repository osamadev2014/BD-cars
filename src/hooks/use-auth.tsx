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

      if (!session?.user) {
        setState({ user: null, session: null, isLoading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
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
          .eq('user_id', session.user.id)

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
            id: session.user.id,
            phone: session.user.phone || '',
            full_name: null,
            avatar_url: null,
            locale: 'ar',
            is_active: true,
            created_at: session.user.created_at || '',
            updated_at: session.user.created_at || '',
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
