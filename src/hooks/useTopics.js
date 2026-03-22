import { useState, useEffect } from 'react'
import { uuid } from '../lib/uuid'

const STORAGE_KEY = 'komo-topics'

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.is_urgent !== b.is_urgent) return a.is_urgent ? -1 : 1
    return new Date(b.created_at) - new Date(a.created_at)
  })
}

export function useTopics() {
  const [topics, setTopics] = useState(() => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
    } catch {
      // localStorage unavailable
    }
  }, [topics])

  const addTopic = ({ title, notes = '', tag_id = null, is_urgent = false, proposed_date = null, created_by, assigned_to = null, parent_id = null }) => {
    const now = new Date().toISOString()
    const newTopic = {
      id: uuid(),
      title,
      notes,
      tag_id,
      is_urgent,
      proposed_date,
      status: 'open',
      created_by,
      assigned_to,
      parent_id,
      created_at: now,
      completed_at: null,
    }
    setTopics((prev) => sortItems([...prev, newTopic]))
    return newTopic
  }

  const updateTopic = (id, updates) => {
    setTopics((prev) => sortItems(prev.map((t) => (t.id === id ? { ...t, ...updates } : t))))
  }

  const completeTopic = (id) => {
    setTopics((prev) =>
      sortItems(
        prev.map((t) =>
          t.id === id ? { ...t, status: 'done', completed_at: new Date().toISOString() } : t
        )
      )
    )
  }

  const createFollowUp = (topicId) => {
    let created = null
    setTopics((prev) => {
      const hasFollowUp = prev.some((t) => t.parent_id === topicId)
      if (hasFollowUp) return prev

      const original = prev.find((t) => t.id === topicId)
      if (!original) return prev

      const now = new Date().toISOString()
      created = {
        id: uuid(),
        title: original.title,
        notes: '',
        tag_id: original.tag_id,
        is_urgent: false,
        proposed_date: null,
        status: 'open',
        created_by: original.created_by,
        assigned_to: original.assigned_to,
        parent_id: topicId,
        created_at: now,
        completed_at: null,
      }

      const updated = prev.map((t) =>
        t.id === topicId ? { ...t, status: 'follow_up' } : t
      )
      return sortItems([...updated, created])
    })
    return created
  }

  return { topics, addTopic, updateTopic, completeTopic, createFollowUp }
}
