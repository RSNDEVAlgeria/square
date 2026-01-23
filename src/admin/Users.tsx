import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import Loader from "../components/Loader"
import UserModal from "./UserModal"

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, balance")

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      toast.error(err.message || "Failed to load users.")
    } finally {
      setLoading(false)
    }
  }

  async function del(id: string) {
    if (!confirm("Are you sure? This will delete the Auth account AND the profile.")) return

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      const { error } = await supabase.functions.invoke("delete-user", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { user_id: id },
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
    <div className="max-w-6xl mx-auto">
      {selectedUser && (
        <UserModal
          user={selectedUser}
          close={() => setSelectedUser(null)}
          reload={load}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={load}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg w-full sm:w-auto transition"
        >
          Refresh List
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-125">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600">User Details</th>
                <th className="p-4 font-semibold text-gray-600">Balance</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{u.name || "N/A"}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="p-4 text-green-600 font-bold whitespace-nowrap">
                      {u.balance?.toLocaleString()} DA
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-md text-sm font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => del(u.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-md text-sm font-bold transition"
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
      </div>
    </div>
  )
}
