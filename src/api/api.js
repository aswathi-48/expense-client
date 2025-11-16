// import axios from 'axios'

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5555/api'

// const instance = axios.create({
//   baseURL: API,
//   headers: { 'Content-Type': 'application/json' },
// })

// export function setToken(token) {
//   if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
//   else delete instance.defaults.headers.common['Authorization']
// }

// // auth
// export const register = (payload) => instance.post('/auth/register', payload).then(r=>r.data)
// export const login = (payload) => instance.post('/auth/login', payload).then(r=>r.data)

// // categories
// export const getCategories = () => instance.get('/categories').then(r=>r.data)
// export const createCategory = (payload) => instance.post('/categories', payload).then(r=>r.data)
// export const updateCategory = (id, payload) => instance.put(`/categories/${id}`, payload).then(r=>r.data)
// export const deleteCategory = (id) => instance.delete(`/categories/${id}`).then(r=>r.data)

// // budgets
// export const getBudgets = (month, year) => instance.get(`/budgets?month=${month}&year=${year}`).then(r=>r.data)
// export const upsertBudget = (payload) => instance.post('/budgets', payload).then(r=>r.data)

// // expenses
// export const addExpense = (payload) => instance.post('/expenses', payload).then(r=>r.data)
// export const getExpenses = (query='') => instance.get(`/expenses${query}`).then(r=>r.data)
// export const summary = (month, year) => instance.get(`/expenses/summary?month=${month}&year=${year}`).then(r=>r.data)


// import axios from 'axios'

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5555/api'

// const instance = axios.create({
//   baseURL: API,
//   headers: { 'Content-Type': 'application/json' },
// })

// export function setToken(token) {
//   if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
//   else delete instance.defaults.headers.common['Authorization']
// }

// // auth
// export const register = (payload) => instance.post('/auth/register', payload).then(r=>r.data)
// export const login = (payload) => instance.post('/auth/login', payload).then(r=>r.data)

// // categories
// export const getCategories = () => instance.get('/categories').then(r=>r.data)
// export const createCategory = (payload) => instance.post('/categories', payload).then(r=>r.data)
// // after fetch
// console.log('categories from API:', cats)

// export const updateCategory = (id, payload) => instance.put(`/categories/${id}`, payload).then(r=>r.data)
// export const deleteCategory = (id) => instance.delete(`/categories/${id}`).then(r=>r.data)

// // budgets
// export const getBudgets = (month, year) => instance.get(`/budgets?month=${month}&year=${year}`).then(r=>r.data)
// export const upsertBudget = (payload) => instance.post('/budgets', payload).then(r=>r.data)

// // expenses
// export const addExpense = (payload) => instance.post('/expenses', payload).then(r=>r.data)
// export const getExpenses = (query='') => instance.get(`/expenses${query}`).then(r=>r.data)
// export const summary = (month, year) => instance.get(`/expenses/summary?month=${month}&year=${year}`).then(r=>r.data)




// import axios from 'axios'

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5555/api'

// const instance = axios.create({
//   baseURL: API,
//   headers: { 'Content-Type': 'application/json' },
// })

// export function setToken(token) {
//   if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
//   else delete instance.defaults.headers.common['Authorization']
// }

// // auth
// export const register = (payload) => instance.post('/auth/register', payload).then(r=>r.data)
// export const login = (payload) => instance.post('/auth/login', payload).then(r=>r.data)

// // categories
// export const getCategories = () => instance.get('/categories').then(r=>r.data)
// export const createCategory = (payload) => instance.post('/categories', payload).then(r=>r.data)
// export const updateCategory = (id, payload) => instance.put(`/categories/${id}`, payload).then(r=>r.data)
// export const deleteCategory = (id) => instance.delete(`/categories/${id}`).then(r=>r.data)

// // budgets
// export const getBudgets = (month, year) => instance.get(`/budgets?month=${month}&year=${year}`).then(r=>r.data)
// export const upsertBudget = (payload) => instance.post('/budgets', payload).then(r=>r.data)

// // expenses
// export const addExpense = (payload) => instance.post('/expenses', payload).then(r=>r.data)
// export const getExpenses = (query='') => instance.get(`/expenses${query}`).then(r=>r.data)
// export const summary = (month, year) => instance.get(`/expenses/summary?month=${month}&year=${year}`).then(r=>r.data)


// src/api/api.js
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5555/api'

const instance = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
})

// If a token exists in localStorage at module load time, set it immediately
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('token')
  if (storedToken) instance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}

export function setToken(token) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete instance.defaults.headers.common['Authorization']
}

// ... rest of exports
export const register = (payload) => instance.post('/auth/register', payload).then(r=>r.data)
export const login = (payload) => instance.post('/auth/login', payload).then(r=>r.data)

export const getCategories = () => instance.get('/categories').then(r=>r.data)
export const createCategory = (payload) => instance.post('/categories', payload).then(r=>r.data)
export const updateCategory = (id, payload) => instance.put(`/categories/${id}`, payload).then(r=>r.data)
export const deleteCategory = (id) => instance.delete(`/categories/${id}`).then(r=>r.data)

// export const getBudgets = (month, year) => instance.get(`/budgets?month=${month}&year=${year}`).then(r=>r.data)
// export const upsertBudget = (payload) => instance.post('/budgets', payload).then(r=>r.data)

export const getBudgets = (month, year) => instance.get(`/budgets?month=${month}&year=${year}`).then(r=>r.data)
export const upsertBudget = (payload) => instance.post('/budgets', payload).then(r=>r.data)
export const deleteBudget = (id) => instance.delete(`/budgets/${id}`).then(r=>r.data)


export const addExpense = (payload) => instance.post('/expenses', payload).then(r=>r.data)
export const getExpenses = (query='') => instance.get(`/expenses${query}`).then(r=>r.data)
export const summary = (month, year) => instance.get(`/expenses/summary?month=${month}&year=${year}`).then(r=>r.data)
