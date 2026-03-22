import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.is_urgent !== b.is_urgent) return a.is_urgent ? -1 : 1
    return new Date(b.created_at) - new Date(a.created_at)
  })
}

export function useTopics() {
  const [topics, setTopics] = useState([])

  const fetchTopics = useCallback(async () => {
    const { data } = await supabase.from('topics').select('*').order('created_at', { ascending: false })
    if (data) setTopics(sortItems(data))
  }, [])

  useEffect(() => {
    fetchTopics()

    const channel = supabase
      .channel('topics-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, () => {
        fetchTopics()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchTopics])

  const addTopic = async ({ title, notes, tag_id, is_urgent, proposed_date, created_by, assigned_to, parent_id }) => {
    const { data } = await supabase
      .from('topics')
      .insert({
        title,
        notes: notes || null,
        tag_id: tag_id || null,
        is_urgent: is_urgent || false,
        proposed_date: proposed_date || null,
        status: 'open',
        created_by: created_by || null,
        assigned_to: assigned_to || null,
        parent_id: parent_id || null,
      })
      .select()
      .single()
    return data
  }

  const updateTopic = async (id, updates) => {
    await supabase.from('topics').update(updates).eq('id', id)
  }

  const completeTopic = async (id) => {
    await supabase.from('topics').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', id)
  }

  const createFollowUp = async (topicId) => {
    const original = topics.find(t => t.id === topicId)
    if (!original) return null
    const hasFollowUp = topics.some(t => t.parent_id === topicId)
    if (hasFollowUp) return null

    // Mark original as follow_up
    await supabase.from('topics').update({ status: 'follow_up' }).eq('id', topicId)

    // Create the follow-up
    const { data } = await supabase
      .from('topics')
      .insert({
        title: original.title,
        notes: null,
        tag_id: original.tag_id,
        is_urgent: false,
        proposed_date: null,
        status: 'open',
        created_by: original.created_by,
        assigned_to: original.assigned_to,
        parent_id: topicId,
      })
      .select()
      .single()
    return data
  }

  return { topics, addTopic, updateTopic, completeTopic, createFollowUp }
}
