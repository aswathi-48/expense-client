// import React, { useEffect, useState } from 'react'
// import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/api'
// import { toast } from 'react-toastify'

// export default function SettingsCategories(){
//   const [categories, setCategories] = useState([])
//   const [name, setName] = useState('')
//   const [color, setColor] = useState('#ff4500')
//   const [editing, setEditing] = useState(null) // { id, name, color }

//   useEffect(()=> load(), [])

//   const load = async ()=> {
//     try {
//       const cats = await getCategories()
//       setCategories(cats || [])
//     } catch (err) {
//       console.error(err)
//       toast.error('Failed to load categories')
//     }
//   }

//   const add = async ()=> {
//     try {
//       if (!name) return toast.error('Name required')
//       await createCategory({ name, color })
//       setName(''); setColor('#ff4500')
//       toast.success('Category added')
//       load()
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Add failed')
//     }
//   }

//   const startEdit = (c) => {
//     setEditing({ id: c._id, name: c.name, color: c.color || '#ff4500' })
//   }

//   const saveEdit = async () => {
//     try {
//       if (!editing.name) return toast.error('Name required')
//       await updateCategory(editing.id, { name: editing.name, color: editing.color })
//       setEditing(null)
//       toast.success('Updated')
//       load()
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Update failed')
//     }
//   }

//   const remove = async (id) => {
//     if (!confirm('Delete this category? This will not delete existing expenses.')) return
//     try {
//       await deleteCategory(id)
//       toast.success('Deleted')
//       load()
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Delete failed')
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Categories</h2>

//       <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
//         <input value={name} onChange={e=>setName(e.target.value)} placeholder="Category name" className="border p-2 rounded col-span-2" />
//         <div className="flex items-center gap-2">
//           <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-12 h-10 p-0 border rounded" />
//           <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
//         </div>
//       </div>

//       <div className="space-y-2">
//         {categories.map(c => (
//           <div key={c._id} className="p-3 border rounded flex items-center justify-between bg-white">
//             <div className="flex items-center gap-3">
//               <div style={{background:c.color||'#ccc'}} className="w-8 h-8 rounded-full" />
//               <div>
//                 <div className="font-medium">{c.name}</div>
//                 <div className="text-xs text-gray-500">{/* optional meta */}</div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button className="text-sm text-blue-600" onClick={()=>startEdit(c)}>Edit</button>
//               <button className="text-sm text-red-600" onClick={()=>remove(c._id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Edit modal inline */}
//       {editing && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//             <h3 className="text-lg font-semibold mb-3">Edit Category</h3>
//             <input value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})} className="w-full border p-2 rounded mb-2" />
//             <div className="flex items-center gap-2 mb-4">
//               <input type="color" value={editing.color} onChange={e=>setEditing({...editing, color: e.target.value})} className="w-12 h-10 p-0" />
//               <div className="text-sm text-gray-600">Pick color</div>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button className="px-4 py-2 border rounded" onClick={()=>setEditing(null)}>Cancel</button>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={saveEdit}>Save</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/api'
import { toast } from 'react-toastify'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function SettingsCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // form state (used for both add & edit)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#60a5fa') // default blue
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const cats = await getCategories()
      setCategories(cats || [])
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Could not load categories')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setColor('#60a5fa')
    setEditingId(null)
  }

  const handleSave = async (e) => {
    e?.preventDefault()
    if (!name.trim()) return toast.error('Name required')
    setSaving(true)
    try {
      if (editingId) {
        // update
        const updated = await updateCategory(editingId, { name: name.trim(), color })
        setCategories((prev) => prev.map(c => c._id === updated._id ? updated : c))
        toast.success('Category updated')
      } else {
        // create
        const created = await createCategory({ name: name.trim(), color })
        // backend may return category object or message — handle both
        if (created && created._id) {
          setCategories(prev => [created, ...prev])
          toast.success('Category created')
        } else {
          toast.success('Category created')
          // reload to be safe
          await load()
        }
      }
      resetForm()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cat) => {
    setEditingId(cat._id)
    setName(cat.name || '')
    setColor(cat.color || '#60a5fa')
    // scroll to form (optional)
    const form = document.getElementById('category-form')
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This can't be undone.`)) return
    try {
      await deleteCategory(cat._id)
      setCategories(prev => prev.filter(c => c._id !== cat._id))
      toast.success('Category deleted')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Failed to delete')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="text-sm text-gray-600">Manage your spending categories</div>
      </div>

      {/* Form */}
      <form id="category-form" onSubmit={handleSave} className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full border rounded p-2"
            />
          </div>

          {/* <div className="w-40">
            <label className="block text-sm text-gray-600 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input value={color} onChange={e=>setColor(e.target.value)} type="color" className="w-12 h-10 p-0 border rounded" />
              <input value={color} onChange={e=>setColor(e.target.value)} className="border rounded p-2 w-full" />
            </div>
          </div> */}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded shadow text-white ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <FiPlus />
              {editingId ? (saving ? 'Updating...' : 'Update') : (saving ? 'Saving...' : 'Add')}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Your categories</h2>

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No categories yet. Add one above.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat._id} className="flex items-start gap-3 p-3 border rounded">
                <div style={{ background: cat.color || '#ccc' }} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{cat.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: <span className="text-gray-600">{String(cat._id).slice(-6)}</span></div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button title="Edit" onClick={()=>handleEdit(cat)} className="p-2 rounded hover:bg-gray-50">
                        <FiEdit2 />
                      </button>
                      <button title="Delete" onClick={()=>handleDelete(cat)} className="p-2 rounded hover:bg-gray-50 text-red-600">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
