'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/actions/auth-actions'
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
      const user = await getCurrentUser()
      setState({ user, session: null, isLoading: false })
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
