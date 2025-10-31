import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

import {
  Home,
  Dashboard,
  Orders,
  Menu,
  Tableqrcodes,
  Staff,
  Reports,
  CustomerMenu,
  KitchenStaff,
  Waiter,
  Loginpage,
} from './pages'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/customermenu" element={<CustomerMenu />} />
          <Route path="/customermenu/:table" element={<CustomerMenu />} />
          <Route path="/loginpage" element={<Loginpage />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager']}>
                <Dashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager', 'Waiter']}>
                <Orders />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/menu" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager']}>
                <Menu />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/Tableqrcodes" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager']}>
                <Tableqrcodes />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/Staff" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager']}>
                <Staff />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/Reports" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager']}>
                <Reports />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/kitchenstaff" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Owner', 'Manager', 'Chef']}>
                <KitchenStaff />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/waiter" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['Waiter']}>
                <Waiter />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App