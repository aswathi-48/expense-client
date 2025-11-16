// import React, { useState, useEffect } from 'react'
// import { summary } from '../api/api'
// import MonthSelector from '../components/MonthSelector'
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// export default function Reports(){
//   const [monthYear, setMonthYear] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear() })
//   const [results, setResults] = useState([])

//   useEffect(()=> load(), [monthYear])
//   const load = async ()=> {
//     const res = await summary(monthYear.month, monthYear.year)
//     setResults(res.results || [])
//   }

//   const chartData = results.map(r => ({ name: r.category.name, Spent: r.spent, Budget: r.budget }))

//   return (
//     <div className="max-w-5xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold">Reports</h2>
//         <MonthSelector month={monthYear.month} year={monthYear.year} onChange={setMonthYear} />
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-6">
//         <h3 className="font-semibold mb-3">Per-category (table)</h3>
//         <table className="w-full text-left border">
//           <thead className="bg-gray-100"><tr><th className="p-2">Category</th><th className="p-2">Budget</th><th className="p-2">Spent</th><th className="p-2">Remaining</th></tr></thead>
//           <tbody>
//             {results.map(r=> (
//               <tr key={r.category.id} className="border-t">
//                 <td className="p-2">{r.category.name}</td>
//                 <td className="p-2">₹{r.budget}</td>
//                 <td className="p-2">₹{r.spent}</td>
//                 <td className={`p-2 ${r.spent > r.budget ? 'text-red-600' : ''}`}>₹{r.budget - r.spent}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="font-semibold mb-3">Chart</h3>
//         <div style={{ width: '100%', height: 300 }}>
//           <ResponsiveContainer>
//             <BarChart data={chartData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="Budget" />
//               <Bar dataKey="Spent" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )
// }


// src/pages/Reports.jsx
import React, { useEffect, useState } from 'react'
import { summary } from '../api/api'
import MonthSelector from '../components/MonthSelector'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'react-toastify'

export default function Reports(){
  const [monthYear, setMonthYear] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear() })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=> {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthYear])

  const load = async ()=> {
    setLoading(true)
    setError(null)
    try {
      const res = await summary(monthYear.month, monthYear.year)
      // debug log so you can see exact response shape
      // eslint-disable-next-line no-console
      console.debug('summary response:', res)
      // try common shapes — backend returns { results: [...] } in your earlier code
      const items = res?.results || res?.data || res?.results?.data || res || []
      // if it's an object with month/year and results, use results
      setResults(Array.isArray(items) ? items : (res.results || []))
    } catch (err) {
      console.error('Failed to fetch summary', err)
      setError(err?.response?.data?.error || err?.message || 'Failed to load reports')
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const chartData = results.map(r => ({ name: r.category?.name || 'Unknown', Spent: r.spent || 0, Budget: r.budget || 0 }))

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Reports</h2>
        <MonthSelector month={monthYear.month} year={monthYear.year} onChange={setMonthYear} />
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded shadow text-center">Loading...</div>
      ) : error ? (
        <div className="bg-white p-6 rounded shadow text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-3">Per-category (table)</h3>
            <table className="w-full text-left border">
              <thead className="bg-gray-100"><tr><th className="p-2">Category</th><th className="p-2">Budget</th><th className="p-2">Spent</th><th className="p-2">Remaining</th></tr></thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td className="p-4" colSpan="4">No data for selected month</td></tr>
                ) : results.map(r=> (
                  <tr key={r.category?.id || r.category?._id || r.category?.name} className="border-t">
                    <td className="p-2">{r.category?.name || 'Unknown'}</td>
                    <td className="p-2">₹{r.budget ?? 0}</td>
                    <td className="p-2">₹{r.spent ?? 0}</td>
                    <td className={`p-2 ${Number(r.spent) > Number(r.budget) ? 'text-red-600' : ''}`}>₹{(Number(r.budget||0) - Number(r.spent||0)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Chart</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Budget" />
                  <Bar dataKey="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
