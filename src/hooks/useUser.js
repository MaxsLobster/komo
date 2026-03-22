import { useState, useCallback } from 'react'
import { USERS } from '../lib/constants.js'

const STORAGE_KEY = 'komo-user'

export function useUser() {
  const [userId, setUserId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  const setUser = useCallback((id) => {
    setUserId(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const user = userId ? USERS[userId] : null
  const isSelected = userId !== null && USERS[userId] !== undefined

  return { user, setUser, isSelected }
}
