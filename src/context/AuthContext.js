import { createContext, useContext } from 'react'
import { useSession } from 'next-auth/react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()

  const user    = session?.user ?? null
  const isAdmin = user?.role === 'admin'
  const loading = status === 'loading'

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, session }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
