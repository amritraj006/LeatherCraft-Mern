import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/useAuth'
import DesignStudio from './pages/DesignStudio/DesignStudio'
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
import AIDesign from './pages/AIDesign'

/** Standard shell: sidebar + scrollable padded main area */
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

/**
 * Studio shell: sidebar + full-height canvas area with NO padding.
 * The design studio needs every pixel.
 */
function StudioShell() {
  return (
    <div className="flex h-screen overflow-hidden relative font-sans">
      <ToastContainer />
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden pt-16 md:pt-0">
        <Outlet />
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const { initializing, isAuthenticated } = useAuth()
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">
        Loading seller workspace…
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
        Loading seller workspace…
      </div>
    )
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Design Studio — full-screen, no padding */}
        <Route element={<StudioShell />}>
          <Route path="/studio" element={<DesignStudio />} />
        </Route>

        {/* All other seller pages — standard padded layout */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadProduct />} />
          <Route path="/products" element={<BaseProducts />} />
          <Route path="/ai-design" element={<AIDesign />} />
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
