// import React, { useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext'

// export default function Nav(){
//   const { token, logout } = useContext(AuthContext)
//   const nav = useNavigate()
//   return (
//     <nav className="bg-white border-b">
//       <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="font-bold">Expense Tracker</Link>
//         <div className="space-x-4">
//           <Link to="/" className="text-sm">Dashboard</Link>
//           <Link to="/expense" className="text-sm">Add Expense</Link>

//           <Link to="/reports" className="text-sm">Reports</Link>
//           <Link to="/settings/categories" className="text-sm">Settings</Link>
//           {token ? (
//             <button onClick={() => { logout(); nav('/auth') }} className="text-sm">Logout</button>
//           ) : (
//             <Link to="/auth" className="text-sm">Login</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }


// // src/components/Nav.jsx — show Reports only when logged in
// import React, { useContext } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext'

// export default function Nav(){
//   const { token, logout } = useContext(AuthContext)
//   const nav = useNavigate()
//   return (
//     <nav className="bg-white border-b">
//       <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="font-bold">Expense Tracker</Link>
//         <div className="space-x-4">
//           <Link to="/" className="text-sm">Dashboard</Link>
//           <Link to="/expense" className="text-sm">Expense</Link>
//           <Link to="/budget" className="text-sm"> Budget </Link>


//           <Link to="/settings/categories" className="text-sm">Category</Link>
//           {/* only show Reports if logged in */}
//             {token ? (
//             <Link to="/reports" className="text-sm">Reports</Link>
//           ) : (
//             <button onClick={() => nav('/auth')} className="text-sm">Reports</button>
//           )}
//           {token ? (
//             <button onClick={() => { logout(); nav('/auth') }} className="text-sm">Logout</button>
//           ) : (
//             <Link to="/auth" className="text-sm">Login</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }



// src/components/Nav.jsx
import React, { useContext, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    {children}
  </NavLink>
)

export default function Nav(){
  const { token, logout, user } = useContext(AuthContext)
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    nav('/auth')
  }

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold shadow">
                ET
              </div>
              <span className="font-semibold text-lg text-gray-800">Expense Tracker</span>
            </Link>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-1 ml-6">
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/expense">Expense</NavItem>
              <NavItem to="/budget">Budget</NavItem>
              <NavItem to="/settings/categories">Category</NavItem>
              {token ? (
                <NavItem to="/reports">Reports</NavItem>
              ) : (
                <button
                  onClick={() => nav('/auth')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Reports
                </button>
              )}
            </nav>
          </div>

          {/* Right: user actions */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right mr-2">
                    <div className="text-sm font-medium text-gray-800">{user?.name || user?.email || 'You'}</div>
                    <div className="text-xs text-gray-500">Member</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                  >
                    <FiLogOut />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>

                {/* Avatar */}
                <div
                  className="ml-2 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700"
                  title={user?.name || user?.email || 'User'}
                >
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <Link to="/auth" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (small screens) */}
      <div className={`md:hidden border-t bg-white ${open ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Dashboard
          </NavLink>

          <NavLink to="/expense" onClick={() => setOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>Expense</NavLink>

          <NavLink to="/budget" onClick={() => setOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>Budget</NavLink>

          <NavLink to="/settings/categories" onClick={() => setOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>Category</NavLink>

          {token ? (
            <NavLink to="/reports" onClick={() => setOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>Reports</NavLink>
          ) : (
            <button onClick={() => { setOpen(false); nav('/auth') }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Reports</button>
          )}

          <div className="pt-2 border-t mt-2">
            {token ? (
              <button onClick={() => { setOpen(false); handleLogout() }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                <FiLogOut /> Logout
              </button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white text-center">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
