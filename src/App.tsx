import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import AddStock from './pages/AddStock'
import RemoveStock from './pages/RemoveStock'
import { AuthProvider } from './context/AuthProvider'
import { TeaDetail } from './pages/TeaDetail'
import AddTea from './pages/AddTea'
import { Customers } from './pages/Customers'
import { CustomerDetail } from './pages/CustomerDetail'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-stock" element={<AddStock />} />
          <Route path="/remove-stock" element={<RemoveStock />} />
          <Route path="/add-tea" element={<AddTea />} />
          <Route path="/teas/:teaId" element={<TeaDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:customerId" element={<CustomerDetail />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
