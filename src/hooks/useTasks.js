import { useState, useEffect } from 'react'
import { uuid } from '../lib/uuid'

const STORAGE_KEY = 'komo-tasks'

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.is_urgent !== b.is_urgent) return a.is_urgent ? -1 : 1
    return new Date(b.created_at) - new Date(a.created_at)
  })
}

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return sortItems(JSON.parse(stored))
    } catch {
      // fall through
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // localStorage unavailable
    }
  }, [tasks])

  const addTask = ({ title, notes = '', tag_id = null, is_urgent = false, created_by, assigned_to = null, parent_id = null }) => {
    const now = new Date().toISOString()
    const newTask = {
      id: uuid(),
      title,
      notes,
      tag_id,
      is_urgent,
      status: 'open',
      created_by,
      assigned_to,
      parent_id,
      created_at: now,
      completed_at: null,
    }
    setTasks((prev) => sortItems([...prev, newTask]))
    return newTask
  }

  const updateTask = (id, updates) => {
    setTasks((prev) => sortItems(prev.map((t) => (t.id === id ? { ...t, ...updates } : t))))
  }

  const completeTask = (id) => {
    setTasks((prev) =>
      sortItems(
        prev.map((t) =>
          t.id === id ? { ...t, status: 'done', completed_at: new Date().toISOString() } : t
        )
      )
    )
  }

  const createFollowUp = (taskId) => {
    let created = null
    setTasks((prev) => {
      const hasFollowUp = prev.some((t) => t.parent_id === taskId)
      if (hasFollowUp) return prev

      const original = prev.find((t) => t.id === taskId)
      if (!original) return prev

      const now = new Date().toISOString()
      created = {
        id: uuid(),
        title: original.title,
        notes: '',
        tag_id: original.tag_id,
        is_urgent: false,
        status: 'open',
        created_by: original.created_by,
        assigned_to: original.assigned_to,
        parent_id: taskId,
        created_at: now,
        completed_at: null,
      }

      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, status: 'follow_up' } : t
      )
      return sortItems([...updated, created])
    })
    return created
  }

  return { tasks, addTask, updateTask, completeTask, createFollowUp }
}
