import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"
import type { JSX } from "react"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader /> // show loader while auth state is loading

  if (!user) return <Navigate to="/admin/login" replace /> // not logged in

  if (user.user_metadata?.role !== "admin") {
    // user is logged in but not an admin
    return <Navigate to="/admin/login" replace />
  }

  // user is logged in and is admin
  return children
}
