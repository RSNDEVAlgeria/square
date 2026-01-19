import { Link, Outlet, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

export default function Dashboard() {
  const nav = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    toast.success("Logged out")
    nav("/admin/login")
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>

        <Link to="products" className="block hover:text-orange-400">
          Products
        </Link>

        <Link to="users" className="block hover:text-orange-400">
          Users
        </Link>

        <button onClick={logout} className="text-red-400 mt-6">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}
