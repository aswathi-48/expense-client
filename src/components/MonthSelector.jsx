import React from 'react'

export default function MonthSelector({ month, year, onChange }) {
  const years = Array.from({length:5}).map((_,i)=> new Date().getFullYear()-2+i)
  return (
    <div className="flex gap-2 items-center">
      <select value={month} onChange={e=>onChange({ month: Number(e.target.value), year })} className="border p-2 rounded">
        {Array.from({length:12}).map((_,i)=> <option key={i+1} value={i+1}>{new Date(0,i).toLocaleString(undefined,{month:'long'})}</option>)}
      </select>
      <select value={year} onChange={e=>onChange({ month, year: Number(e.target.value)})} className="border p-2 rounded">
        {years.map(y=> <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  )
}
