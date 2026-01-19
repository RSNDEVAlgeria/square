import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

export default function Users() {
  const [users, setUsers] = useState<any[]>([])

  async function load() {
    const { data } = await supabase.from("profiles").select("*")
    setUsers(data || [])
  }

  async function del(id: string) {
    if (!confirm("Delete user?")) return
    await supabase.from("profiles").delete().eq("id", id)
    toast.success("User deleted")
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th>Email</th>
            <th>Name</th>
            <th>Balance</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="text-center border-t">
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.balance}</td>
              <td>
                <button
                  onClick={() => del(u.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
