    import React from 'react'

    export default function CategoryCard({ category, spent=0, budget=0 }){
    const percent = budget ? Math.round((spent / budget) * 100) : 0
    const remaining = (budget || 0) - (spent || 0)
    const over = budget && spent > budget
    return (
        <div className="border rounded p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <div style={{ background: category.color || '#ccc' }} className="w-6 h-6 rounded-full mr-3" />
            <div>
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm text-gray-500">Spent: ₹{spent} / {budget ? `₹${budget}` : '—'}</div>
            </div>
            </div>
            {over && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">OVER BUDGET</span>}
        </div>
        <div className="mt-3">
            <div className="w-full bg-gray-100 rounded h-3 overflow-hidden">
            <div style={{ width: `${Math.min(100, percent)}%` }} className={`h-3 ${over ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            <div className="text-xs text-gray-600 mt-1">Remaining: ₹{remaining}</div>
        </div>
        </div>
    )
    }
