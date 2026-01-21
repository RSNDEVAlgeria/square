import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function DashboardStats() {
  const [stats, setStats] = useState({ users: 0, products: 0 })

  useEffect(() => {
    async function fetchStats() {
      // High-performance count queries
      const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: p } = await supabase.from('products').select('*', { count: 'exact', head: true })
      setStats({ users: u || 0, products: p || 0 })
    }
    fetchStats()
  }, [])

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
                <p className="text-5xl font-black text-gray-900 mt-2">{stats.users}</p>
              </div>
              <div className="text-4xl bg-blue-50 p-4 rounded-xl text-blue-500">👥</div>
            </div>
          </div>
          <Link to="users" className="block bg-blue-600 py-4 text-center text-white font-bold hover:bg-blue-700 transition">
            Manage Users
          </Link>
        </div>

        {/* Products Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Products</p>
                <p className="text-5xl font-black text-gray-900 mt-2">{stats.products}</p>
              </div>
              <div className="text-4xl bg-orange-50 p-4 rounded-xl text-orange-500">📦</div>
            </div>
          </div>
          <Link to="products" className="block bg-orange-600 py-4 text-center text-white font-bold hover:bg-orange-700 transition">
            Manage Inventory
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const location = useLocation()

  async function logout() {
    await supabase.auth.signOut()
    toast.success("Logged out")
    nav("/admin/login")
  }

  // The critical check: are we at exactly "/admin/dashboard"?
  const isIndex = location.pathname === "/admin/dashboard" || location.pathname === "/admin/dashboard/";

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white p-8 flex flex-col shadow-xl">
        <Link 
          to="/admin/dashboard" 
          className="text-2xl font-black text-orange-500 mb-12 hover:text-orange-400 transition"
        >
          ADMIN PANEL
        </Link>

        <nav className="flex-1 space-y-3">
          <Link to="products" className={`block py-3 px-4 rounded-lg font-medium transition ${location.pathname.includes('products') ? 'bg-orange-600 text-white' : 'hover:bg-gray-800'}`}>
            Products
          </Link>
          <Link to="users" className={`block py-3 px-4 rounded-lg font-medium transition ${location.pathname.includes('users') ? 'bg-orange-600 text-white' : 'hover:bg-gray-800'}`}>
            Users
          </Link>
        </nav>

        <button 
          onClick={logout} 
          className="mt-auto py-3 px-4 border border-red-500/50 text-red-500 rounded-lg font-bold hover:bg-red-500 hover:text-white transition"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12">
        {isIndex ? <DashboardStats /> : <Outlet />}
      </main>
    </div>
  )
}