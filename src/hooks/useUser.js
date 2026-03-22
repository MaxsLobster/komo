import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const USER_META = {
  Max: { initial: 'M', color: '#5E8B62' },
  Anna: { initial: 'A', color: '#C4A24E' },
}

const FALLBACK_USERS = [
  { id: 'max', name: 'Max', initial: 'M', color: '#5E8B62' },
  { id: 'anna', name: 'Anna', initial: 'A', color: '#C4A24E' },
]

export function useUser() {
  const [selectedName, setSelectedName] = useState(() => localStorage.getItem('komo-user') || null)
  const [userList, setUserList] = useState([])
  const [user, setUser] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  // Load users from Supabase, fallback to local
  useEffect(() => {
    supabase.from('users').select('*').then(({ data, error }) => {
      if (data && data.length > 0) {
        const list = data.map(u => ({
          id: u.id,
          name: u.name,
          initial: USER_META[u.name]?.initial || u.name[0],
          color: USER_META[u.name]?.color || '#5E8B62',
        }))
        setUserList(list)
      } else {
        // Supabase not set up yet — use fallback
        setUserList(FALLBACK_USERS)
        setUsingFallback(true)
      }
    })
  }, [])

  // Resolve current user when userList or selection changes
  useEffect(() => {
    if (selectedName && userList.length) {
      const found = userList.find(u => u.name.toLowerCase() === selectedName) ||
                    userList.find(u => u.id === selectedName)
      if (found) setUser(found)
    }
  }, [selectedName, userList])

  const selectUser = (name) => {
    setSelectedName(name)
    localStorage.setItem('komo-user', name)
  }

  return {
    user,
    userList,
    setUser: selectUser,
    isSelected: !!selectedName && !!user,
    usingFallback,
  }
}
