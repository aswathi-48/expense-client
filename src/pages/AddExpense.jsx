// // src/pages/AddExpensePage.jsx
// import React, { useEffect, useState, useContext } from 'react'
// import axios from 'axios'
// import ExpenseModal from '../components/ExpenseModal'
// import { toast } from 'react-toastify'
// import { AuthContext } from '../context/AuthContext'

// export default function AddExpensePage() {
//   const { token: ctxToken } = useContext(AuthContext) || {}
//   const token = ctxToken || localStorage.getItem('token')

//   const [categories, setCategories] = useState([])
//   const [loadingCats, setLoadingCats] = useState(false)

//   // Inline add form state
//   const [categoryId, setCategoryId] = useState('')
//   const [amount, setAmount] = useState('')
//   const [dateTime, setDateTime] = useState('')
//   const [note, setNote] = useState('')
//   const [saving, setSaving] = useState(false)

//   // modal state
//   const [modalOpen, setModalOpen] = useState(false)
//   const [modalSaving, setModalSaving] = useState(false)

//   // expenses list (simple client-side list)
//   const [expenses, setExpenses] = useState([])
//   const [loadingExpenses, setLoadingExpenses] = useState(false)

//   useEffect(() => {
//     // init dateTime local iso (datetime-local)
//     const now = new Date()
//     const isoLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16)
//     setDateTime(isoLocal)
//     loadCategories()
//     loadExpenses()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   async function apiGet(url, params = {}) {
//     return axios.get(url, {
//       params,
//       headers: { Authorization: token ? `Bearer ${token}` : undefined },
//     }).then(r => r.data)
//   }
//   async function apiPost(url, body = {}) {
//     return axios.post(url, body, {
//       headers: { Authorization: token ? `Bearer ${token}` : undefined },
//     }).then(r => r.data)
//   }

//   async function loadCategories() {
//     setLoadingCats(true)
//     try {
//       const data = await apiGet('/api/categories')
//       // expect an array of categories; normalize if necessary
//       setCategories(Array.isArray(data) ? data : (data.categories || []))
//       // default select first category if available
//       const arr = Array.isArray(data) ? data : (data.categories || [])
//       if (arr.length) setCategoryId(String(arr[0]._id || arr[0].id))
//     } catch (err) {
//       console.error('loadCategories', err)
//       toast.error(err?.response?.data?.error || 'Failed to load categories')
//     } finally {
//       setLoadingCats(false)
//     }
//   }

//   async function loadExpenses() {
//     setLoadingExpenses(true)
//     try {
//       const data = await apiGet('/api/expenses')
//       setExpenses(Array.isArray(data) ? data : (data.expenses || []))
//     } catch (err) {
//       console.error('loadExpenses', err)
//       toast.error('Failed to load expenses')
//     } finally {
//       setLoadingExpenses(false)
//     }
//   }

//   // shared handler used by modal & inline form
//   async function handleAddExpense(payload) {
//     // payload: { categoryId, amount, note, date }
//     setSaving(true)
//     try {
//       const res = await apiPost('/api/expenses', payload)
//       // res expected like your controller: { expense, month, year, spent, budgetAmount, status }
//       const expense = res.expense || {}
//       // Prepend to local list
//       setExpenses(prev => [expense, ...prev])

//       // show budget warnings based on backend status
//       if (res.status === 'over') {
//         toast.warn(`Budget exceeded for this category — spent ₹${Number(res.spent).toFixed(2)} / ₹${Number(res.budgetAmount).toFixed(2)}`)
//       } else if (res.status === 'within') {
//         // optional positive toast
//         // toast.success('Expense added (within budget)')
//       } else if (res.status === 'no-budget') {
//         toast.info('Expense added (no budget set for this category)')
//       }

//       toast.success('Expense added')
//       return res
//     } catch (err) {
//       // bubble error to caller if needed
//       console.error('add expense', err)
//       const msg = err?.response?.data?.error || err?.message || 'Failed to add expense'
//       toast.error(msg)
//       throw err
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Inline form submit
//   const onSubmitInline = async (e) => {
//     if (e && e.preventDefault) e.preventDefault()

//     if (!categoryId) return toast.error('Select a category')
//     const amt = Number(amount)
//     if (!amt || amt <= 0) return toast.error('Enter a valid amount (> 0)')

//     // convert datetime-local to ISO (UTC)
//     let isoDate
//     try {
//       isoDate = dateTime ? new Date(dateTime).toISOString() : new Date().toISOString()
//     } catch {
//       isoDate = new Date().toISOString()
//     }

//     const payload = {
//       categoryId: String(categoryId),
//       amount: amt,
//       note: note || '',
//       date: isoDate,
//     }

//     try {
//       await handleAddExpense(payload)
//       // reset inline form
//       setAmount('')
//       setNote('')
//       const now = new Date()
//       setDateTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
//     } catch (err) {
//       // already handled in handleAddExpense
//     }
//   }

//   // wrapper for modal onSave (so modal can show saving state)
//   const modalOnSave = async (payload) => {
//     setModalSaving(true)
//     try {
//       const res = await handleAddExpense(payload)
//       return res
//     } finally {
//       setModalSaving(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Add Expense</h1>
//         {/* <div>
//           <button
//             className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={() => setModalOpen(true)}
//           >
//             Open Add Expense Modal
//           </button>
//         </div> */}
//       </div>

//       {/* Inline add form */}
//       <form onSubmit={onSubmitInline} className="bg-white p-4 rounded shadow mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Category</label>
//             <select
//               className="w-full border rounded p-2"
//               value={categoryId}
//               onChange={e => setCategoryId(e.target.value)}
//               disabled={loadingCats}
//             >
//               {loadingCats && <option>Loading...</option>}
//               {!loadingCats && categories.length === 0 && <option value="">No categories</option>}
//               {!loadingCats && categories.map(cat => (
//                 <option key={cat._id || cat.id} value={cat._id || cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Amount</label>
//             <input
//               type="number"
//               step="0.01"
//               className="w-full border rounded p-2"
//               value={amount}
//               onChange={e => setAmount(e.target.value)}
//               placeholder="0.00"
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Date & time</label>
//             <input
//               type="datetime-local"
//               className="w-full border rounded p-2"
//               value={dateTime}
//               onChange={e => setDateTime(e.target.value)}
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Note</label>
//             <input
//               className="w-full border rounded p-2"
//               value={note}
//               onChange={e => setNote(e.target.value)}
//               placeholder="Optional note"
//             />
//           </div>

//           <div className="md:col-span-4 flex justify-end gap-2 mt-2">
//             <button type="button" onClick={() => {
//               // reset
//               setAmount('')
//               setNote('')
//               if (categories.length) setCategoryId(String(categories[0]._id || categories[0].id))
//               const now = new Date()
//               setDateTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
//             }} className="px-4 py-2 border rounded">Reset</button>

//             <button
//               type="submit"
//               disabled={saving}
//               className={`px-4 py-2 bg-blue-600 text-white rounded ${saving ? 'opacity-60 pointer-events-none' : 'hover:bg-blue-700'}`}
//             >
//               {saving ? 'Saving...' : 'Add Expense'}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Expenses list */}
//       <div className="bg-white p-4 rounded shadow">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="font-semibold">Recent expenses</h2>
//           <div className="text-sm text-gray-500">{loadingExpenses ? 'Loading...' : `${expenses.length} items`}</div>
//         </div>

//         {expenses.length === 0 ? (
//           <div className="py-8 text-center text-gray-500">No expenses yet</div>
//         ) : (
//           <div className="space-y-2">
//             {expenses.map(exp => (
//               <div key={exp._id || exp.id} className="flex items-center justify-between p-3 border rounded">
//                 <div className="flex items-center gap-3">
//                   <div style={{ background: exp.category?.color || '#ddd' }} className="w-10 h-10 rounded-full flex items-center justify-center text-sm">
//                     { (exp.category?.name || '?')[0] }
//                   </div>
//                   <div>
//                     <div className="font-medium">{exp.category?.name || 'Unknown'}</div>
//                     <div className="text-xs text-gray-500">{new Date(exp.date).toLocaleString()}</div>
//                     {exp.note && <div className="text-sm text-gray-600 mt-1">{exp.note}</div>}
//                   </div>
//                 </div>
//                 <div className="text-sm font-semibold">₹{Number(exp.amount).toFixed(2)}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Expense modal (re-uses your ExpenseModal) */}
//       {/* <ExpenseModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         categories={categories}
//         onSave={modalOnSave}
//         saving={modalSaving}
//       /> */}
//     </div>
//   )
// }


// // src/pages/AddExpensePage.jsx
// import React, { useEffect, useState, useContext } from 'react'
// import axios from 'axios'
// import ExpenseModal from '../components/ExpenseModal'
// import { toast } from 'react-toastify'
// import { AuthContext } from '../context/AuthContext'

// export default function AddExpensePage() {
//   const { token: ctxToken } = useContext(AuthContext) || {}
//   const token = ctxToken || localStorage.getItem('token')

//   // NOTE: categories is normalized to { id, name, color, raw }
//   const [categories, setCategories] = useState([])
//   console.log(categories);
  
//   const [loadingCats, setLoadingCats] = useState(false)

//   // Inline add form state
//   const [categoryId, setCategoryId] = useState('')
//   console.log(categoryId,"data");
  
//   const [amount, setAmount] = useState('')
//   const [dateTime, setDateTime] = useState('')
//   const [note, setNote] = useState('')
//   const [saving, setSaving] = useState(false)

//   // modal state
//   const [modalOpen, setModalOpen] = useState(false)
//   const [modalSaving, setModalSaving] = useState(false)

//   // expenses list (simple client-side list)
//   const [expenses, setExpenses] = useState([])
//   const [loadingExpenses, setLoadingExpenses] = useState(false)

//   useEffect(() => {
//     // init dateTime local iso (datetime-local)
//     const now = new Date()
//     const isoLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16)
//     setDateTime(isoLocal)

//     // only load if token available (prevents 401 attempts)
//     if (token) {
//       loadCategories()
//       loadExpenses()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token])

//   // tiny helpers that attach auth header when token exists
//   async function apiGet(url, params = {}) {
//     return axios.get(url, {
//       params,
//       headers: { Authorization: token ? `Bearer ${token}` : undefined },
//     }).then(r => r.data)
//   }
//   async function apiPost(url, body = {}) {
//     return axios.post(url, body, {
//       headers: { Authorization: token ? `Bearer ${token}` : undefined },
//     }).then(r => r.data)
//   }

//   // Robust loader: accepts many response shapes and normalizes categories
//   async function loadCategories() {
//     setLoadingCats(true)
//     try {
//       const raw = await apiGet('/api/categories')
//       // handle various response shapes: array, { categories: [...] }, { data: [...] }, etc.
//       let arr = []
//       if (Array.isArray(raw)) arr = raw
//       else if (Array.isArray(raw.categories)) arr = raw.categories
//       else if (Array.isArray(raw.data)) arr = raw.data
//       else if (Array.isArray(raw.result)) arr = raw.result
//       else {
//         // fallback: try to find first array property
//         const vals = Object.values(raw || {})
//         const firstArray = vals.find(v => Array.isArray(v))
//         arr = firstArray || []
//       }

//       // normalize to consistent shape
//       const normalized = arr.map(c => {
//         const id = c && (c._id ? String(c._id) : (c.id ? String(c.id) : ''))
//         const name = c && (c.name || c.title || c.label || 'Unnamed')
//         const color = c && (c.color || '#cbd5e1') // default gray-blue
//         return { id, name, color, raw: c }
//       }).filter(c => c.id) // drop any without id

//       // debug: remove when stable
//       // eslint-disable-next-line no-console
//       console.debug('loadCategories -> raw:', raw, 'normalized:', normalized)

//       setCategories(normalized)

//       // default select first if nothing selected
//       if (normalized.length && !categoryId) setCategoryId(normalized[0].id)
//     } catch (err) {
//       console.error('loadCategories', err)
//       toast.error(err?.response?.data?.error || 'Failed to load categories')
//     } finally {
//       setLoadingCats(false)
//     }
//   }

//   async function loadExpenses() {
//     setLoadingExpenses(true)
//     try {
//       const data = await apiGet('/api/expenses')
//       // attempt to handle both array and wrapper shapes
//       const arr = Array.isArray(data) ? data : (data.expenses || data.data || [])
//       setExpenses(arr)
//     } catch (err) {
//       console.error('loadExpenses', err)
//       toast.error('Failed to load expenses')
//     } finally {
//       setLoadingExpenses(false)
//     }
//   }

//   // shared handler used by modal & inline form
//   async function handleAddExpense(payload) {
//     // payload: { categoryId, amount, note, date }
//     setSaving(true)
//     try {
//       const res = await apiPost('/api/expenses', payload)
//       // res expected like your controller: { expense, month, year, spent, budgetAmount, status }
//       const expense = res.expense || {}
//       // Prepend to local list
//       setExpenses(prev => [expense, ...prev])

//       // show budget warnings based on backend status
//       if (res.status === 'over') {
//         toast.warn(`Budget exceeded for this category — spent ₹${Number(res.spent).toFixed(2)} / ₹${Number(res.budgetAmount).toFixed(2)}`)
//       } else if (res.status === 'within') {
//         // optionally notify success differently
//         toast.success('Expense added (within budget)')
//       } else if (res.status === 'no-budget') {
//         toast.info('Expense added (no budget set for this category)')
//       } else {
//         toast.success('Expense added')
//       }

//       return res
//     } catch (err) {
//       console.error('add expense', err)
//       const msg = err?.response?.data?.error || err?.message || 'Failed to add expense'
//       toast.error(msg)
//       throw err
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Inline form submit
//   const onSubmitInline = async (e) => {
//     if (e && e.preventDefault) e.preventDefault()

//     if (!categoryId) return toast.error('Select a category')
//     const amt = Number(amount)
//     if (!amt || amt <= 0) return toast.error('Enter a valid amount (> 0)')

//     // convert datetime-local to ISO (UTC)
//     let isoDate
//     try {
//       isoDate = dateTime ? new Date(dateTime).toISOString() : new Date().toISOString()
//     } catch {
//       isoDate = new Date().toISOString()
//     }

//     const payload = {
//       categoryId: String(categoryId),
//       amount: amt,
//       note: note || '',
//       date: isoDate,
//     }

//     try {
//       await handleAddExpense(payload)
//       // reset inline form
//       setAmount('')
//       setNote('')
//       const now = new Date()
//       setDateTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
//     } catch (err) {
//       // already handled in handleAddExpense
//     }
//   }

//   // wrapper for modal onSave (so modal can show saving state)
//   const modalOnSave = async (payload) => {
//     setModalSaving(true)
//     try {
//       const res = await handleAddExpense(payload)
//       return res
//     } finally {
//       setModalSaving(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Add Expense</h1>
//       </div>

//       {/* Inline add form */}
//       <form onSubmit={onSubmitInline} className="bg-white p-4 rounded shadow mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Category</label>

//             {/* Use normalized categories array */}
//             <select
//               className="w-full border rounded p-2"
//               value={categoryId}
//               onChange={e => setCategoryId(e.target.value)}
//               disabled={loadingCats}
//             >
//               {loadingCats && <option>Loading...</option>}

//               {!loadingCats && categories.length === 0 && <option value="">No categories</option>}

//               {!loadingCats && categories.map(cat => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Amount</label>
//             <input
//               type="number"
//               step="0.01"
//               className="w-full border rounded p-2"
//               value={amount}
//               onChange={e => setAmount(e.target.value)}
//               placeholder="0.00"
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Date & time</label>
//             <input
//               type="datetime-local"
//               className="w-full border rounded p-2"
//               value={dateTime}
//               onChange={e => setDateTime(e.target.value)}
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-sm text-gray-600 mb-1">Note</label>
//             <input
//               className="w-full border rounded p-2"
//               value={note}
//               onChange={e => setNote(e.target.value)}
//               placeholder="Optional note"
//             />
//           </div>

//           <div className="md:col-span-4 flex justify-end gap-2 mt-2">
//             <button type="button" onClick={() => {
//               // reset
//               setAmount('')
//               setNote('')
//               if (categories.length) setCategoryId(categories[0].id)
//               const now = new Date()
//               setDateTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
//             }} className="px-4 py-2 border rounded">Reset</button>

//             <button
//               type="submit"
//               disabled={saving}
//               className={`px-4 py-2 bg-blue-600 text-white rounded ${saving ? 'opacity-60 pointer-events-none' : 'hover:bg-blue-700'}`}
//             >
//               {saving ? 'Saving...' : 'Add Expense'}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Expenses list */}
//       <div className="bg-white p-4 rounded shadow">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="font-semibold">Recent expenses</h2>
//           <div className="text-sm text-gray-500">{loadingExpenses ? 'Loading...' : `${expenses.length} items`}</div>
//         </div>

//         {expenses.length === 0 ? (
//           <div className="py-8 text-center text-gray-500">No expenses yet</div>
//         ) : (
//           <div className="space-y-2">
//             {expenses.map(exp => (
//               <div key={exp._id || exp.id} className="flex items-center justify-between p-3 border rounded">
//                 <div className="flex items-center gap-3">
//                   <div style={{ background: exp.category?.color || '#ddd' }} className="w-10 h-10 rounded-full flex items-center justify-center text-sm">
//                     { (exp.category?.name || '?')[0] }
//                   </div>
//                   <div>
//                     <div className="font-medium">{exp.category?.name || 'Unknown'}</div>
//                     <div className="text-xs text-gray-500">{new Date(exp.date).toLocaleString()}</div>
//                     {exp.note && <div className="text-sm text-gray-600 mt-1">{exp.note}</div>}
//                   </div>
//                 </div>
//                 <div className="text-sm font-semibold">₹{Number(exp.amount).toFixed(2)}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Expense modal (re-uses your ExpenseModal) */}
//       <ExpenseModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         categories={categories.map(c => ({ _id: c.id, name: c.name, color: c.color }))}
//         onSave={modalOnSave}
//         saving={modalSaving}
//       />
//     </div>
//   )
// }



// src/pages/AddExpensePage.jsx
import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import ExpenseModal from '../components/ExpenseModal'

// use your api helpers (these use the axios instance with baseURL)
import { setToken, getCategories, getExpenses, addExpense } from '../api/api'

export default function AddExpensePage() {
  const { token: ctxToken } = useContext(AuthContext) || {}
  const token = ctxToken || localStorage.getItem('token')

  // normalized categories: { id, name, color, raw }
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(false)
  const [loadCatsError, setLoadCatsError] = useState(null)

  // Inline add form state
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSaving, setModalSaving] = useState(false)

  // expenses list
  const [expenses, setExpenses] = useState([])
  const [loadingExpenses, setLoadingExpenses] = useState(false)

  // set axios instance token whenever available
  useEffect(() => {
    setToken(token)
  }, [token])

  useEffect(() => {
    // init dateTime (datetime-local expects local-ish ISO)
    const now = new Date()
    const isoLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16)
    setDateTime(isoLocal)

    if (token) {
      loadCategories()
      loadExpenses()
    } else {
      // still try to load if your backend doesn't require auth for categories
      loadCategories()
      loadExpenses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // normalize helper: accepts many shapes
  function normalizeCategories(arr) {
    if (!Array.isArray(arr)) return []
    return arr.map(c => {
      // c may be string or object
      if (!c) return null
      if (typeof c === 'string') return { id: c, name: c, color: '#cbd5e1', raw: c }
      const id = c._id ? String(c._id) : (c.id ? String(c.id) : (c._id || c.id ? String(c._id || c.id) : ''))
      const name = c.name || c.title || c.label || (typeof c === 'string' ? c : 'Unnamed')
      const color = c.color || '#cbd5e1'
      return { id: id || name, name, color, raw: c }
    }).filter(Boolean)
  }

  async function loadCategories() {
    setLoadCatsError(null)
    setLoadingCats(true)
    try {
      const raw = await getCategories() // uses instance -> correct baseURL
      // raw can be array or { categories: [...] } or { data: [...] } etc.
      let arr = []
      if (Array.isArray(raw)) arr = raw
      else if (Array.isArray(raw.categories)) arr = raw.categories
      else if (Array.isArray(raw.data)) arr = raw.data
      else if (Array.isArray(raw.result)) arr = raw.result
      else {
        // try to find first array property
        const vals = Object.values(raw || {})
        const firstArray = vals.find(v => Array.isArray(v))
        arr = firstArray || []
      }

      // fallback: if raw looks like a single category object, wrap it
      if (!arr.length && raw && typeof raw === 'object' && (raw._id || raw.id || raw.name)) {
        arr = [raw]
      }

      const normalized = normalizeCategories(arr)

      // If still empty, try to interpret raw as array-like (map keys)
      if (!normalized.length && raw && typeof raw === 'object') {
        const objectVals = Object.values(raw)
        const maybeObjects = objectVals.filter(v => v && (v._id || v.id || v.name))
        const fallback = normalizeCategories(maybeObjects.length ? maybeObjects : objectVals)
        if (fallback.length) {
          setCategories(fallback)
          if (!categoryId) setCategoryId(fallback[0].id)
          return
        }
      }

      setCategories(normalized)
      if (normalized.length && !categoryId) setCategoryId(normalized[0].id)
      if (!normalized.length) setLoadCatsError('No categories found.')
    } catch (err) {
      console.error('loadCategories', err)
      setLoadCatsError(err?.response?.data?.error || err?.message || 'Failed to load categories')
      toast.error('Failed to load categories')
    } finally {
      setLoadingCats(false)
    }
  }

  async function loadExpenses() {
    setLoadingExpenses(true)
    try {
      const data = await getExpenses() // expect array or wrapped object
      const arr = Array.isArray(data) ? data : (data.expenses || data.data || [])
      setExpenses(arr)
    } catch (err) {
      console.error('loadExpenses', err)
      toast.error('Failed to load expenses')
    } finally {
      setLoadingExpenses(false)
    }
  }

  async function handleAddExpense(payload) {
    setSaving(true)
    try {
      const res = await addExpense(payload)
      // your API returns r.data via helper; handle both shapes
      const expense = res.expense || res || {}
      // if helper returned wrapper, dig arrays
      // try to extract the newly created expense object
      const newExp = expense && expense._id ? expense : (res && res.expense ? res.expense : (res && res.data ? res.data : expense))

      setExpenses(prev => newExp && (newExp._id || newExp.id) ? [newExp, ...prev] : prev)

      if (res.status === 'over') toast.warn(`Budget exceeded — ${res.spent}/${res.budgetAmount}`)
      else if (res.status === 'within') toast.success('Within budget')
      else toast.info('Expense added')

      return res
    } catch (err) {
      console.error('addExpense', err)
      const msg = err?.response?.data?.error || err?.message || 'Failed to add expense'
      toast.error(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const onSubmitInline = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!categoryId) return toast.error('Select a category')
    const amt = Number(amount)
    if (!amt || amt <= 0) return toast.error('Enter a valid amount (> 0)')

    let isoDate
    try {
      isoDate = dateTime ? new Date(dateTime).toISOString() : new Date().toISOString()
    } catch {
      isoDate = new Date().toISOString()
    }

    const payload = { categoryId: String(categoryId), amount: amt, note: note || '', date: isoDate }

    try {
      await handleAddExpense(payload)
      setAmount(''); setNote('')
      const now = new Date()
      setDateTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
    } catch (err) {
      // handled above
    }
  }

  const modalOnSave = async (payload) => {
    setModalSaving(true)
    try { return await handleAddExpense(payload) } finally { setModalSaving(false) }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Expense</h1>
      </div>

      {/* Inline add form */}
      <form onSubmit={onSubmitInline} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Category</label>

            <select
              className="w-full border rounded p-2"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              disabled={loadingCats}
            >
              {loadingCats && <option>Loading...</option>}
              {!loadingCats && categories.length === 0 && <option value="">No categories</option>}
              {!loadingCats && categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {loadCatsError && <div className="text-sm text-red-600 mt-2">{loadCatsError}</div>}
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input type="number" step="0.01" className="w-full border rounded p-2" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Date & time</label>
            <input type="datetime-local" className="w-full border rounded p-2" value={dateTime} onChange={e => setDateTime(e.target.value)} />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Note</label>
            <input className="w-full border rounded p-2" value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note" />
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => {
              setAmount(''); setNote('')
              if (categories.length) setCategoryId(categories[0].id)
              const now = new Date()
              setDateTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16))
            }} className="px-4 py-2 border rounded">Reset</button>

            <button type="submit" disabled={saving} className={`px-4 py-2 bg-blue-600 text-white rounded ${saving ? 'opacity-60 pointer-events-none' : 'hover:bg-blue-700'}`}>
              {saving ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </div>
      </form>

      {/* Expenses list */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent expenses</h2>
          <div className="text-sm text-gray-500">{loadingExpenses ? 'Loading...' : `${expenses.length} items`}</div>
        </div>

        {expenses.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No expenses yet</div>
        ) : (
          <div className="space-y-2">
            {expenses.map(exp => (
              <div key={exp._id || exp.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div style={{ background: exp.category?.color || '#ddd' }} className="w-10 h-10 rounded-full flex items-center justify-center text-sm">
                    {(exp.category?.name || '?')[0]}
                  </div>
                  <div>
                    <div className="font-medium">{exp.category?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{new Date(exp.date).toLocaleString()}</div>
                    {exp.note && <div className="text-sm text-gray-600 mt-1">{exp.note}</div>}
                  </div>
                </div>
                <div className="text-sm font-semibold">₹{Number(exp.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories.map(c => ({ _id: c.id, name: c.name, color: c.color }))}
        onSave={modalOnSave}
        saving={modalSaving}
      />
    </div>
  )
}
