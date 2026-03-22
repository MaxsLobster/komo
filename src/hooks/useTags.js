import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTags() {
  const [tags, setTags] = useState([])

  useEffect(() => {
    // Initial fetch
    supabase.from('tags').select('*').order('created_at').then(({ data }) => {
      if (data) setTags(data)
    })

    // Realtime subscription
    const channel = supabase
      .channel('tags-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, () => {
        supabase.from('tags').select('*').order('created_at').then(({ data }) => {
          if (data) setTags(data)
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const addTag = async (name, bg_color, text_color) => {
    const { data } = await supabase
      .from('tags')
      .insert({ name, bg_color, text_color })
      .select()
      .single()
    return data
  }

  return { tags, addTag }
}
