import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (!session) return
    fetch('/api/users/wishlist')
      .then((r) => r.json())
      .then((data) => setWishlist(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [session])

  async function addToWishlist(courseId) {
    const res = await fetch('/api/users/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    })
    if (res.ok) setWishlist((prev) => [...prev, courseId])
  }

  async function removeFromWishlist(courseId) {
    const res = await fetch('/api/users/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    })
    if (res.ok) setWishlist((prev) => prev.filter((id) => id !== courseId))
  }

  function isInWishlist(courseId) {
    return wishlist.some((id) => id.toString() === courseId.toString())
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
