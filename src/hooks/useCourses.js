import { useState, useEffect, useCallback } from 'react'

export function useCourses(initialFilters = {}) {
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [filters,  setFilters]  = useState({ category: 'all', level: 'all', search: '', ...initialFilters })

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.category && filters.category !== 'all') params.set('category', filters.category)
      if (filters.level    && filters.level    !== 'all') params.set('level',    filters.level)
      if (filters.search)                                  params.set('search',   filters.search)

      const res  = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch courses')
      setCourses(data.courses || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  return { courses, loading, error, filters, setFilters, refetch: fetchCourses }
}
