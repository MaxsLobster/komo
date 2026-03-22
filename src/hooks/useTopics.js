import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { uuid } from '../lib/uuid'

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.is_urgent !== b.is_urgent) return a.is_urgent ? -1 : 1
    return new Date(b.created_at) - new Date(a.created_at)
  })
}

export function useTopics() {
  const [topics, setTopics] = useState([])
  const [useLocal, setUseLocal] = useState(false)

  const fetchTopics = useCallback(async () => {
    const { data, error } = await supabase.from('topics').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      setTopics(sortItems(data))
    } else {
      setUseLocal(true)
      try {
        const stored = localStorage.getItem('komo-topics')
        if (stored) setTopics(sortItems(JSON.parse(stored)))
      } catch {}
    }
  }, [])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  // Realtime subscription (only if Supabase works)
  useEffect(() => {
    if (useLocal) return
    const channel = supabase.channel('topics-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, () => { fetchTopics() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [useLocal, fetchTopics])

  // Persist to localStorage when in fallback mode
  useEffect(() => {
    if (useLocal) {
      try { localStorage.setItem('komo-topics', JSON.stringify(topics)) } catch {}
    }
  }, [topics, useLocal])

  const addTopic = async ({ title, notes, tag_id, is_urgent, proposed_date, created_by, assigned_to, parent_id }) => {
    if (useLocal) {
      const newTopic = {
        id: uuid(), title, notes: notes || '', tag_id: tag_id || null,
        is_urgent: is_urgent || false, proposed_date: proposed_date || null,
        status: 'open', created_by: created_by || null, assigned_to: assigned_to || null,
        parent_id: parent_id || null, created_at: new Date().toISOString(), completed_at: null,
      }
      setTopics(prev => sortItems([...prev, newTopic]))
      return newTopic
    }
    const { data } = await supabase.from('topics').insert({
      title, notes: notes || null, tag_id: tag_id || null, is_urgent: is_urgent || false,
      proposed_date: proposed_date || null, status: 'open', created_by: created_by || null,
      assigned_to: assigned_to || null, parent_id: parent_id || null,
    }).select().single()
    return data
  }

  const updateTopic = async (id, updates) => {
    if (useLocal) {
      setTopics(prev => sortItems(prev.map(t => t.id === id ? { ...t, ...updates } : t)))
      return
    }
    await supabase.from('topics').update(updates).eq('id', id)
  }

  const completeTopic = async (id) => {
    if (useLocal) {
      setTopics(prev => sortItems(prev.map(t => t.id === id ? { ...t, status: 'done', completed_at: new Date().toISOString() } : t)))
      return
    }
    await supabase.from('topics').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', id)
  }

  const createFollowUp = async (topicId) => {
    const original = topics.find(t => t.id === topicId)
    if (!original) return null
    if (topics.some(t => t.parent_id === topicId)) return null

    if (useLocal) {
      const fu = {
        id: uuid(), title: original.title, notes: '', tag_id: original.tag_id,
        is_urgent: false, proposed_date: null, status: 'open', created_by: original.created_by,
        assigned_to: original.assigned_to, parent_id: topicId, created_at: new Date().toISOString(), completed_at: null,
      }
      setTopics(prev => sortItems([...prev.map(t => t.id === topicId ? { ...t, status: 'follow_up' } : t), fu]))
      return fu
    }
    await supabase.from('topics').update({ status: 'follow_up' }).eq('id', topicId)
    const { data } = await supabase.from('topics').insert({
      title: original.title, notes: null, tag_id: original.tag_id, is_urgent: false,
      proposed_date: null, status: 'open', created_by: original.created_by,
      assigned_to: original.assigned_to, parent_id: topicId,
    }).select().single()
    return data
  }

  return { topics, addTopic, updateTopic, completeTopic, createFollowUp }
}
