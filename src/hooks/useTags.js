import { useState, useEffect } from 'react'
import { DEFAULT_TAGS } from '../lib/constants.js'
import { uuid } from '../lib/uuid'

const STORAGE_KEY = 'komo-tags'

export function useTags() {
  const [tags, setTags] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // fall through to default
    }
    return DEFAULT_TAGS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
    } catch {
      // localStorage unavailable
    }
  }, [tags])

  const addTag = (name, bg_color, text_color) => {
    const newTag = {
      id: uuid(),
      name,
      bg_color,
      text_color,
    }
    setTags((prev) => [...prev, newTag])
    return newTag
  }

  return { tags, addTag }
}
