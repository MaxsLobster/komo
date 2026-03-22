import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { uuid } from '../lib/uuid'

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.is_urgent !== b.is_urgent) return a.is_urgent ? -1 : 1
    return new Date(b.created_at) - new Date(a.created_at)
  })
}

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [useLocal, setUseLocal] = useState(false)

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      setTasks(sortItems(data))
    } else {
      setUseLocal(true)
      try {
        const stored = localStorage.getItem('komo-tasks')
        if (stored) setTasks(sortItems(JSON.parse(stored)))
      } catch {}
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  useEffect(() => {
    if (useLocal) return
    const channel = supabase.channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => { fetchTasks() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [useLocal, fetchTasks])

  useEffect(() => {
    if (useLocal) { try { localStorage.setItem('komo-tasks', JSON.stringify(tasks)) } catch {} }
  }, [tasks, useLocal])

  const addTask = async ({ title, notes, tag_id, is_urgent, created_by, assigned_to, parent_id }) => {
    if (useLocal) {
      const t = {
        id: uuid(), title, notes: notes || '', tag_id: tag_id || null, is_urgent: is_urgent || false,
        status: 'open', created_by: created_by || null, assigned_to: assigned_to || null,
        parent_id: parent_id || null, created_at: new Date().toISOString(), completed_at: null,
      }
      setTasks(prev => sortItems([...prev, t]))
      return t
    }
    const { data } = await supabase.from('tasks').insert({
      title, notes: notes || null, tag_id: tag_id || null, is_urgent: is_urgent || false,
      status: 'open', created_by: created_by || null, assigned_to: assigned_to || null, parent_id: parent_id || null,
    }).select().single()
    return data
  }

  const updateTask = async (id, updates) => {
    if (useLocal) { setTasks(prev => sortItems(prev.map(t => t.id === id ? { ...t, ...updates } : t))); return }
    await supabase.from('tasks').update(updates).eq('id', id)
  }

  const completeTask = async (id) => {
    if (useLocal) {
      setTasks(prev => sortItems(prev.map(t => t.id === id ? { ...t, status: 'done', completed_at: new Date().toISOString() } : t)))
      return
    }
    await supabase.from('tasks').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', id)
  }

  const createFollowUp = async (taskId) => {
    const original = tasks.find(t => t.id === taskId)
    if (!original) return null
    if (tasks.some(t => t.parent_id === taskId)) return null

    if (useLocal) {
      const fu = {
        id: uuid(), title: original.title, notes: '', tag_id: original.tag_id, is_urgent: false,
        status: 'open', created_by: original.created_by, assigned_to: original.assigned_to,
        parent_id: taskId, created_at: new Date().toISOString(), completed_at: null,
      }
      setTasks(prev => sortItems([...prev.map(t => t.id === taskId ? { ...t, status: 'follow_up' } : t), fu]))
      return fu
    }
    await supabase.from('tasks').update({ status: 'follow_up' }).eq('id', taskId)
    const { data } = await supabase.from('tasks').insert({
      title: original.title, notes: null, tag_id: original.tag_id, is_urgent: false,
      status: 'open', created_by: original.created_by, assigned_to: original.assigned_to, parent_id: taskId,
    }).select().single()
    return data
  }

  return { tasks, addTask, updateTask, completeTask, createFollowUp }
}
