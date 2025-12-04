'use client'

import { useState, useEffect, useCallback } from 'react'
import { UseLocalStorageReturn } from '@/app/lib/types'

/**
 * Custom hook for managing localStorage with type safety
 * Uses btoa/atob encoding for basic security
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { encode?: boolean }
): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string>()

  const shouldEncode = options?.encode !== false

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const decoded = shouldEncode ? atob(item) : item
        const parsed = JSON.parse(decoded)
        setValueState(parsed)
      }
    } catch (err) {
      console.error(`Error loading from localStorage (key: ${key}):`, err)
      setError(err instanceof Error ? err.message : 'Failed to load from localStorage')
      // Fail gracefully - use initial value
    } finally {
      setIsLoaded(true)
    }
  }, [key, shouldEncode])

  // Persist to localStorage
  const setValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      try {
        const newValue = val instanceof Function ? val(value) : val
        setValueState(newValue)

        // Try to persist
        const serialized = JSON.stringify(newValue)
        const toStore = shouldEncode ? btoa(serialized) : serialized
        window.localStorage.setItem(key, toStore)
        setError(undefined)
      } catch (err) {
        console.error(`Error saving to localStorage (key: ${key}):`, err)
        if (err instanceof Error) {
          if (err.message.includes('QuotaExceededError')) {
            setError('Storage quota exceeded. Please delete some expenses.')
          } else {
            setError(err.message)
          }
        } else {
          setError('Failed to save to localStorage')
        }
      }
    },
    [value, key, shouldEncode]
  )

  return { value, setValue, isLoaded, error }
}
