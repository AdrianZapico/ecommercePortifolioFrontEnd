import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
// REMOVA A LINHA DO BOOTSTRAP.CSS SE ELA AINDA ESTIVER AQUI
import App from './App.tsx'
import './index.css' // O Tailwind carrega aqui

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" index={true} element={<h1 className="text-3xl font-bold text-slate-700">Tela Principal (Home)</h1>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)