import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import Loader from "../components/Loader"

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      // 1. Debugging: Check if the current session actually has the admin role
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.app_metadata?.role;
      
      if (role !== 'admin') {
        console.warn("Current user role in metadata:", role);
        // Note: We don't throw here so the RLS error can be caught below if it fails
      }

      // 2. Fetch profiles (RLS will now use JWT metadata, no recursion)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, balance, created_at")
        .order('created_at', { ascending: true });

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      console.error("Load Error:", err);
      toast.error(err.message || "Failed to load users. Check Admin permissions.")
    } finally {
      setLoading(false)
    }
  }

  async function del(id: string) {
    if (!confirm("Are you sure? This will delete the Auth account AND the profile via Cascade.")) return
    
    setLoading(true)
    try {
      // Call the Edge Function to handle Auth deletion
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: id }
      })

      if (error) throw error
      
      toast.success("User deleted successfully")
      await load() // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button 
          onClick={load} 
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          Refresh List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Balance</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No users found or access denied.
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-700">{u.email}</td>
                  <td className="p-4 text-gray-900 font-medium">{u.name || 'N/A'}</td>
                  <td className="p-4 text-green-600 font-bold">${u.balance?.toLocaleString() || '0'}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => del(u.id)} 
                      className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <p className="mt-4 text-xs text-gray-400">
        Note: Deletion is permanent and affects both Auth and Profiles via Cascade.
      </p>
    </div>
  )
}