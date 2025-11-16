// src/components/ExpenseModal.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

/*
  Robust Expense Modal:
  - normalizes category objects (accepts both {_id, name} and {id, name})
  - filters on search input and auto-selects first filtered item
  - supports click-selection
  - validates amount and category before submit
  - converts datetime-local to ISO string for backend
*/
export default function ExpenseModal({ open, onClose, categories = [], onSave, saving = false }) {
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [q, setQ] = useState('')

  // normalize incoming categories (works with { _id } or { id })
  const normalized = useMemo(() => {
    return (categories || []).map(c => ({
      id: c._id ? String(c._id) : (c.id ? String(c.id) : String(c._id || c.id || '')),
      name: c.name || c.title || 'Unnamed',
      color: c.color || '#ccc',
      raw: c
    })).filter(c => c.id && c.name)
  }, [categories])

  // when modal opens or categories change -> default values
  useEffect(() => {
    if (!open) return
    // default datetime-local to local now
    const now = new Date()
    const isoLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,16)
    setDateTime(isoLocal)
    setAmount('')
    setNote('')
    setQ('')

    // if we have normalized categories, set default selection to first item
    if (normalized.length) {
      setCategoryId(prev => {
        // keep existing if still valid
        const still = normalized.find(n => n.id === prev)
        return still ? prev : normalized[0].id
      })
    } else {
      setCategoryId('')
      // debug hint in console so you can inspect API result
      // eslint-disable-next-line no-console
      console.debug('ExpenseModal: no categories received from parent. categories prop:', categories)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, categories])

  // filtered list by search q
  const filtered = useMemo(() => {
    if (!q) return normalized
    const s = q.toLowerCase()
    return normalized.filter(c => (c.name || '').toLowerCase().includes(s))
  }, [q, normalized])

  // auto-select the first filtered when filter changes (helps keyboard users)
  useEffect(() => {
    if (!open) return
    if (filtered.length === 0) {
      // if no results, clear selection
      setCategoryId('')
      return
    }
    // if current categoryId not in filtered, select first one
    const inFiltered = filtered.some(f => f.id === categoryId)
    if (!inFiltered) setCategoryId(filtered[0].id)
  }, [filtered, open, categoryId])

  if (!open) return null

  const submit = async () => {
    // ensure categoryId is set
    if (!categoryId) {
      toast.error('Please select a category.')
      return
    }

    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid amount (> 0).')
      return
    }

    // convert datetime-local (or fallback) to ISO
    let isoDate
    try {
      isoDate = dateTime ? new Date(dateTime).toISOString() : new Date().toISOString()
    } catch (err) {
      isoDate = new Date().toISOString()
    }

    const payload = {
      categoryId: categoryId,
      amount: amt,
      note: note || '',
      date: isoDate
    }

    try {
      await onSave(payload) // parent should handle toasts & reloading
      // close modal on success
      onClose()
    } catch (err) {
      // show helpful message if backend responds with error
      const msg = err?.response?.data?.error || err?.message || 'Failed to save expense'
      toast.error(msg)
      throw err
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Expense</h3>

        <div className="space-y-3">
          <label className="block text-sm text-gray-600">Category</label>

          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search categories..."
            className="w-full border rounded p-2 mb-2"
          />

          <div className="max-h-36 overflow-auto border rounded">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No categories</div>
            ) : (
              <ul>
                {filtered.map(c => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between ${categoryId === c.id ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ background: c.color || '#ccc' }} className="w-5 h-5 rounded-full" />
                        <span>{c.name}</span>
                      </div>
                      {categoryId === c.id && <span className="text-xs text-blue-600">Selected</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Date & time</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Note</label>
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional note"
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={onClose}>Cancel</button>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className={`px-4 py-2 bg-blue-600 text-white rounded ${saving ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
