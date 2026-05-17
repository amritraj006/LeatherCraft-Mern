import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/useAuth'
import AIDesignStudio from './pages/AIDesignStudio'
import Dashboard from './pages/Dashboard'
import DesignsGallery from './pages/DesignsGallery'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadProduct from './pages/UploadProduct'
import BaseProducts from './pages/BaseProducts'
import Sales from './pages/Sales'
import Account from './pages/Account'
import ToastContainer from './components/ToastContainer'
import Notifications from './pages/Notifications'

function AppShell() {
  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden relative font-sans">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 overflow-auto pt-16 md:pt-0 relative">
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const { initializing, isAuthenticated } = useAuth()

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">
        Loading seller workspace...
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function GuestRoute() {
  const { initializing, isAuthenticated } = useAuth()

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">
        Loading seller workspace...
      </div>
    )
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadProduct />} />
          <Route path="/products" element={<BaseProducts />} />
          <Route path="/studio" element={<AIDesignStudio />} />
          <Route path="/designs" element={<DesignsGallery />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/account" element={<Account />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notification" element={<Notifications />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
