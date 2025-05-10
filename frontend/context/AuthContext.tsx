// app/context/AuthContext.tsx
'use client'

import { NEXT_PUBLIC_API_BASE_URL } from '@/lib/utils'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  fetchUser: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  fetchUser: () => { },
  logout: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/v1/users/current-user`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem("userId", data.user._id);
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout failed')
    } finally {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
