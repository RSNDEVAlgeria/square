import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"
import AdminRoute from "./admin/AdminRoute"
import Login from "./admin/Login"
import Dashboard from "./admin/Dashboard"
import Products from "./admin/Products"
import Users from "./admin/Users"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<Login />} />

          {/* ADMIN PANEL */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="products" />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
