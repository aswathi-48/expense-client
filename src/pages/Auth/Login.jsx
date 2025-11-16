import React, { useState, useContext } from 'react'
import { login as apiLogin } from '../../api/api'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async () => {
    try {
      const res = await apiLogin({ email, password })
      if (res.token) {
        login(res.token, res.user)
        toast.success('Logged in')
        nav('/')
      } else {
        toast.error(res.error || 'Login failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log In</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded mb-3" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded mb-3" />
      <div className="flex justify-between items-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submit}>Login</button>
<Link to="/auth/register" className="text-sm text-blue-600">Register</Link>
      </div>
    </div>
  )
}
