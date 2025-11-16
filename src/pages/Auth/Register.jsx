import React, { useState, useContext } from 'react'
import { register as apiRegister } from '../../api/api'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async () => {
    try {
      const res = await apiRegister({ name, email, password })
      if (res.token) {
        login(res.token, res.user)
        toast.success('Registered')
        nav('/')
      } else {
        toast.error(res.error || 'Register failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded mb-3" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded mb-3" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded mb-3" />
      <div className="flex justify-between items-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submit}>Register</button>
        <a href="/auth" className="text-sm text-blue-600">Already have account?</a>
      </div>
    </div>
  )
}
