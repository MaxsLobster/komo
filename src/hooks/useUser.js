import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const USER_META = {
  Max: { initial: 'M', color: '#5E8B62' },
  Anna: { initial: 'A', color: '#C4A24E' },
}

export function useUser() {
  const [selectedName, setSelectedName] = useState(() => localStorage.getItem('komo-user') || null)
  const [userList, setUserList] = useState([])
  const [user, setUser] = useState(null)

  // Load users from Supabase
  useEffect(() => {
    supabase.from('users').select('*').then(({ data }) => {
      if (data) {
        const list = data.map(u => ({
          id: u.id,
          name: u.name,
          initial: USER_META[u.name]?.initial || u.name[0],
          color: USER_META[u.name]?.color || '#5E8B62',
        }))
        setUserList(list)
      }
    })
  }, [])

  // Resolve current user when userList or selection changes
  useEffect(() => {
    if (selectedName && userList.length) {
      const found = userList.find(u => u.name.toLowerCase() === selectedName)
      if (found) setUser(found)
    }
  }, [selectedName, userList])

  const selectUser = (name) => {
    // name is 'max' or 'anna' (lowercase)
    setSelectedName(name)
    localStorage.setItem('komo-user', name)
  }

  return {
    user,        // { id: UUID, name: 'Max', initial: 'M', color: '#5E8B62' }
    userList,    // [{ id, name, initial, color }, ...]
    setUser: selectUser,
    isSelected: !!selectedName && !!user,
  }
}
