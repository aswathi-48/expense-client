import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getCategories, getBudgets, getExpenses, addExpense } from '../api/api'
import CategoryCard from '../components/CategoryCard'
import ExpenseModal from '../components/ExpenseModal'
import MonthSelector from '../components/MonthSelector'
import { toast } from 'react-toastify'

export default function Dashboard(){
  const { token } = useContext(AuthContext)
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [monthYear, setMonthYear] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear() })

  useEffect(()=>{ if (token) loadAll() }, [token, monthYear])

  const loadAll = async () => {
    setLoading(true)
    try {
      const cats = await getCategories()
      setCategories(cats || [])
      const buds = await getBudgets(monthYear.month, monthYear.year)
      setBudgets(buds || [])
      const exp = await getExpenses(`?from=${new Date(monthYear.year, monthYear.month-1,1).toISOString()}&to=${new Date(monthYear.year, monthYear.month,0).toISOString()}`)
      setExpenses(exp || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const spentFor = (catId) => {
    return expenses.reduce((s, e) => {
      const eid = e.category && e.category._id ? e.category._id : e.category
      return s + (eid === catId ? (e.amount||0) : 0)
    }, 0)
  }
  const budgetFor = (catId) => {
    const b = budgets.find(bb => (bb.category && bb.category._id === catId) || bb.category === catId)
    return b ? b.amount : 0
  }

  const handleSaveExpense = async (payload) => {
    try {
      const res = await addExpense(payload)
      if (res.status === 'over') toast.error('Over budget')
      else if (res.status === 'within') toast.success('Within budget')
      else toast.info('No budget set')
      await loadAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add expense')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <MonthSelector month={monthYear.month} year={monthYear.year} onChange={setMonthYear} />
          <button onClick={()=>setOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Add Expense</button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(c => (
            <CategoryCard key={c._id} category={c} spent={spentFor(c._id)} budget={budgetFor(c._id)} />
          ))}
        </div>
      )}

      <ExpenseModal open={open} onClose={()=>setOpen(false)} categories={categories} onSave={handleSaveExpense} />
    </div>
  )
}
