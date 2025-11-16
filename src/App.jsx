import React from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import SettingsCategories from './pages/SettingsCategories'
import SettingsBudgets from './pages/SettingsBudgets'
import Reports from './pages/Reports'
import { ToastContainer } from 'react-toastify'
import AddExpensePage from './pages/AddExpense'

function Protected({ children }){
  const { token } = React.useContext(AuthContext)
  if (!token) return <Navigate to="/auth" />
  return children
}

export default function App(){
  return (
    <BrowserRouter>
    <AuthProvider>
      <ToastContainer position="top-right" />
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/reports" element={<Protected><Reports /></Protected>} />
          <Route path="/settings/categories" element={<Protected><SettingsCategories /></Protected>} />
          <Route path="/settings/budgets" element={<Protected><SettingsBudgets /></Protected>} />
          <Route path="/expense" element={<Protected><AddExpensePage /></Protected>} />
          <Route path="/budget" element={<Protected><SettingsBudgets /></Protected>} />


          <Route path="/auth" element={<div className="min-h-[70vh] flex items-center justify-center"><Login /></div>} />
          <Route path="/auth/register" element={<div className="min-h-[70vh] flex items-center justify-center"><Register /></div>} />

          <Route path="*" element={<div className="p-8">Not found</div>} />
        </Routes>
      </div>
    </AuthProvider>
    </BrowserRouter>
  )
}

 