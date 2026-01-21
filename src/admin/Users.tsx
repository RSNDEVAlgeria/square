import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import Loader from "../components/Loader"
import UserModal from "./UserModal" // Import your modal

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // State to manage modal visibility and the user being edited
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("profiles") // Using "profiles" as per your fetch logic
        .select("id, email, name, balance, created_at")
        .order('created_at', { ascending: true });

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      console.error("Load Error:", err);
      toast.error(err.message || "Failed to load users.")
    } finally {
      setLoading(false)
    }
  }

  async function del(id: string) {
    if (!confirm("Are you sure? This will delete the Auth account AND the profile.")) return
    
    setLoading(true)
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: id }
      })
      if (error) throw error
      
      toast.success("User deleted successfully")
      await load()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading && users.length === 0) return <Loader />

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Modal Logic */}
      {selectedUser && (
        <UserModal 
          user={selectedUser} 
          close={() => setSelectedUser(null)} 
          reload={load} 
        />
      )}

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
                  <td className="p-4 text-right space-x-2">
                    {/* New Edit Button */}
                    <button 
                      onClick={() => setSelectedUser(u)} 
                      className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      Edit
                    </button>
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