import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./admin/Login"
import Dashboard from "./admin/Dashboard"
import Users from "./admin/Users"
import Products from "./admin/Products"
import AddProduct from "./admin/AddProduct"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect /admin */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}
