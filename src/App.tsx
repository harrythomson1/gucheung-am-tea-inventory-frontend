import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import AddStock from './pages/AddStock'
import RemoveStock from './pages/RemoveStock'
import { AuthProvider } from './context/AuthProvider'
import { TeaDetail } from './pages/TeaDetail'
import Teas from './pages/Teas'
import { Customers } from './pages/Customers'
import { CustomerDetail } from './pages/CustomerDetail'
import NotFound from './pages/NotFound'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-stock" element={<AddStock />} />
          <Route path="/remove-stock" element={<RemoveStock />} />
          <Route path="/teas/:teaId" element={<TeaDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:customerId" element={<CustomerDetail />} />
          <Route element={<AdminRoute />}>
            <Route path="/teas" element={<Teas />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
