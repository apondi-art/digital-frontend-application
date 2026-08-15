import { useState, useEffect } from 'react'

const STORAGE_KEY = 'db-account'

const INITIAL = {
  accountNumber: null,
  accountId: null,
  token: null,
  role: null,
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  gender: null,
  dateOfBirth: null,
  address: null,
  nin: null,
  bvn: null,
}

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : { ...INITIAL }
  } catch {
    return { ...INITIAL }
  }
}

function persist(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage quota exceeded or private mode — silent fail
  }
}

let _state = load()
const _listeners = new Set()

export function setAccount(next) {
  _state = { ..._state, ...next }
  persist(_state)
  _listeners.forEach((fn) => fn(_state))
}

export function clearAccount() {
  _state = { ...INITIAL }
  sessionStorage.removeItem(STORAGE_KEY)
  _listeners.forEach((fn) => fn(_state))
}

// Used by the axios client interceptor (no React hook needed there)
export function getToken() {
  return _state.token
}

// Used by transfer/deposit hooks to inject accountId without needing React context
export function getAccountId() {
  return _state.accountId
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
