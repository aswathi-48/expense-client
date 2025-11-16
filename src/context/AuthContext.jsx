// import React, { createContext, useState, useEffect } from 'react'
// import { setToken } from '../api/api'

// export const AuthContext = createContext(null)

// export function AuthProvider({ children }){
//   const [token, setTok] = useState(localStorage.getItem('token') || '')
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))

//   useEffect(()=> {
//     if (token) {
//       localStorage.setItem('token', token)
//       setToken(token)
//     } else {
//       localStorage.removeItem('token')
//       setToken(null)
//     }
//   }, [token])

//   useEffect(()=> {
//     if (user) localStorage.setItem('user', JSON.stringify(user))
//     else localStorage.removeItem('user')
//   }, [user])

//   const login = (t, u) => { setTok(t); setUser(u) }
//   const logout = () => { setTok(''); setUser(null) }

//   return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
// }


// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import { setToken } from '../api/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const initialToken = typeof window !== 'undefined' ? (localStorage.getItem('token') || '') : ''
  const [token, setTok] = useState(initialToken)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch { return null }
  })

  // Ensure axios has token immediately (synchronous)
  if (token) setToken(token)

  useEffect(()=> {
    if (token) {
      localStorage.setItem('token', token)
      setToken(token)
    } else {
      localStorage.removeItem('token')
      setToken(null)
    }
  }, [token])

  useEffect(()=> {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = (t, u) => { setTok(t); setUser(u) }
  const logout = () => { setTok(''); setUser(null) }

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
}
