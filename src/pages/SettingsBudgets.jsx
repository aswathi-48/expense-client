// import React, { useState, useEffect } from 'react'
// import { getCategories, getBudgets, upsertBudget } from '../api/api'
// import MonthSelector from '../components/MonthSelector'

// export default function SettingsBudgets(){
//   const [categories, setCategories] = useState([])
//   const [budgets, setBudgets] = useState([])
//   const [monthYear, setMonthYear] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear() })

//   useEffect(()=> load(), [monthYear])
//   const load = async () => {
//     setCategories(await getCategories() || [])
//     setBudgets(await getBudgets(monthYear.month, monthYear.year) || [])
//   }

//   const changeBudget = async (categoryId, amount) => {
//     await upsertBudget({ categoryId, amount: Number(amount), month: monthYear.month, year: monthYear.year })
//     load()
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold">Budgets</h2>
//         <MonthSelector month={monthYear.month} year={monthYear.year} onChange={setMonthYear}/>
//       </div>
//       <div className="space-y-3">
//         {categories.map(cat => {
//           const b = budgets.find(bb => (bb.category && bb.category._id === cat._id) || bb.category === cat._id)
//           return (
//             <div key={cat._id} className="p-3 border rounded flex items-center justify-between">
//               <div className="flex items-center"><div style={{background:cat.color||'#ccc'}} className="w-6 h-6 rounded-full mr-3" />{cat.name}</div>
//               <div className="flex items-center gap-2">
//                 <input type="number" defaultValue={b ? b.amount : ''} placeholder="0" className="w-28 border p-2 rounded" id={`b-${cat._id}`} />
//                 <button onClick={()=>{ const val = document.getElementById(`b-${cat._id}`).value; changeBudget(cat._id, val) }} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }



// src/pages/SettingsBudgets.jsx
import React, { useEffect, useState } from 'react'
import MonthSelector from '../components/MonthSelector'
import { getBudgets, upsertBudget, deleteBudget } from '../api/api'
import { getCategories } from '../api/api'
import { toast } from 'react-toastify'
import { FiTrash2, FiSave, FiEdit } from 'react-icons/fi'

export default function SettingsBudgets(){
  const today = new Date()
  const [monthYear, setMonthYear] = useState({ month: today.getMonth() + 1, year: today.getFullYear() })
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [formState, setFormState] = useState({ categoryId: '', amount: '' }) // used for add/edit
  const [editingId, setEditingId] = useState(null)

  useEffect(()=> { loadCategories(); loadBudgets(); }, [monthYear])

  async function loadCategories(){
    try {
      const cats = await getCategories()
      setCategories(cats || [])
      // default category select to first if not set
      if (!formState.categoryId && cats && cats.length) setFormState(s => ({ ...s, categoryId: cats[0]._id }))
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to load categories')
    }
  }

  async function loadBudgets(){
    setLoading(true)
    try {
      const res = await getBudgets(monthYear.month, monthYear.year)
      // API returns an array of budgets
      setBudgets(Array.isArray(res) ? res : (res?.data || []))
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  function startAdd(){
    setEditingId(null)
    setFormState({ categoryId: categories[0]?._id || '', amount: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startEdit(b){
    setEditingId(b._id)
    setFormState({ categoryId: b.category?._id || b.category, amount: String(b.amount || '') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave(e){
    e?.preventDefault()
    if (!formState.categoryId) return toast.error('Select category')
    const amount = Number(formState.amount || 0)
    if (Number.isNaN(amount) || amount < 0) return toast.error('Enter a valid amount')

    setSavingId(editingId || 'new')
    try {
      const payload = {
        categoryId: formState.categoryId,
        amount,
        month: monthYear.month,
        year: monthYear.year
      }
      const saved = await upsertBudget(payload)
      toast.success('Budget saved')
      // optimistic update — replace if exists else add
      setBudgets(prev => {
        // if response is a budget object (with _id)
        if (saved && saved._id) {
          const exists = prev.find(p => p._id === saved._id || (p.category && p.category._id === saved.category));
          if (exists) return prev.map(p => (p._id === saved._id ? saved : p))
          return [saved, ...prev]
        }
        // otherwise reload
        return prev
      })
      setEditingId(null)
      setFormState({ categoryId: categories[0]?._id || '', amount: '' })
      // reload to make sure populated category present
      await loadBudgets()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to save budget')
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(b){
    if (!window.confirm(`Delete budget for "${b.category?.name || 'category'}"?`)) return
    try {
      await deleteBudget(b._id)
      toast.success('Budget deleted')
      setBudgets(prev => prev.filter(x => x._id !== b._id))
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to delete budget')
    }
  }

  // convenience: build map of category id -> name for reads
  const catMap = {}
  categories.forEach(c => (catMap[c._id] = c))

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        {/* <div className="flex items-center gap-4">
          <MonthSelector month={monthYear.month} year={monthYear.year} onChange={setMonthYear} />
          <button onClick={startAdd} className="px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">New Budget</button>
        </div> */}
      </div>

      {/* Add/Edit form */}
      <form onSubmit={handleSave} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={formState.categoryId}
              onChange={e => setFormState(s => ({ ...s, categoryId: e.target.value }))}
              className="w-full border rounded p-2"
            >
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount (₹)</label>
            <input
              value={formState.amount}
              onChange={e => setFormState(s => ({ ...s, amount: e.target.value }))}
              placeholder="e.g. 5000"
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={!!savingId} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              <FiSave />
              {savingId ? 'Saving...' : (editingId ? 'Update Budget' : 'Save Budget')}
            </button>

            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormState({ categoryId: categories[0]?._id || '', amount: '' }) }} className="px-4 py-2 border rounded">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Budgets list */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Budgets for {monthYear.month}/{monthYear.year}</h2>

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : budgets.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No budgets for this month. Add one above.</div>
        ) : (
          <div className="space-y-3">
            {budgets.map(b => {
              const cat = b.category || catMap[b.category] || { name: 'Unknown' }
              return (
                <div key={b._id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-semibold">{cat.name}</div>
                    <div className="text-xs text-gray-500">Amount: ₹{b.amount ?? 0}</div>
                    <div className="text-xs text-gray-400 mt-1">Category ID: {String(cat._id || b.category).slice(-6)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(b)} title="Edit" className="p-2 rounded hover:bg-gray-50">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(b)} title="Delete" className="p-2 rounded hover:bg-gray-50 text-red-600">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
