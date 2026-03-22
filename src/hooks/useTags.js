import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_TAGS } from '../lib/constants'
import { uuid } from '../lib/uuid'

export function useTags() {
  const [tags, setTags] = useState([])
  const [useLocal, setUseLocal] = useState(false)

  useEffect(() => {
    supabase.from('tags').select('*').order('created_at').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setTags(data)
        // Subscribe to realtime
        const channel = supabase.channel('tags-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, () => {
            supabase.from('tags').select('*').order('created_at').then(({ data }) => { if (data) setTags(data) })
          }).subscribe()
        return () => supabase.removeChannel(channel)
      } else {
        // Fallback to localStorage
        setUseLocal(true)
        try {
          const stored = localStorage.getItem('komo-tags')
          setTags(stored ? JSON.parse(stored) : DEFAULT_TAGS)
        } catch { setTags(DEFAULT_TAGS) }
      }
    })
  }, [])

  useEffect(() => {
    if (useLocal && tags.length) {
      try { localStorage.setItem('komo-tags', JSON.stringify(tags)) } catch {}
    }
  }, [tags, useLocal])

  const addTag = async (name, bg_color, text_color) => {
    if (useLocal) {
      const newTag = { id: uuid(), name, bg_color, text_color, created_at: new Date().toISOString() }
      setTags(prev => [...prev, newTag])
      return newTag
    }
    const { data } = await supabase.from('tags').insert({ name, bg_color, text_color }).select().single()
    return data
  }

  return { tags, addTag }
}
