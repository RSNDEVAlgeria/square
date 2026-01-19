import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"
import type { JSX } from "react"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader />

  if (!user) return <Navigate to="/admin/login" />

  if (user.user_metadata?.role !== "admin") {
    return <Navigate to="/admin/login" />
  }

  return children
}
