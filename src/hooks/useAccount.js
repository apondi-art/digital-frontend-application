import { useState, useEffect } from 'react'

const STORAGE_KEY = 'db-account'

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { accountNumber: null, accountId: null }
  } catch {
    return { accountNumber: null, accountId: null }
  }
}

function persist(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage quota exceeded or private mode — silent fail
  }
}

// Module-level state seeded from sessionStorage so refreshes survive
let _state = load()
const _listeners = new Set()

export function setAccount(next) {
  _state = { ..._state, ...next }
  persist(_state)
  _listeners.forEach((fn) => fn(_state))
}

export function clearAccount() {
  _state = { accountNumber: null, accountId: null }
  sessionStorage.removeItem(STORAGE_KEY)
  _listeners.forEach((fn) => fn(_state))
}

export function useAccount() {
  const [state, setState] = useState(_state)

  useEffect(() => {
    setState(_state)
    _listeners.add(setState)
    return () => _listeners.delete(setState)
  }, [])

  return state
}
