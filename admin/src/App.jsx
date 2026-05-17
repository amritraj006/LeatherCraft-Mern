import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sellers from './pages/Sellers'
import SellerDesigns from './pages/SellerDesigns'
import Notifications from './pages/Notifications'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/sellers/:id/designs" element={<SellerDesigns />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notification" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
