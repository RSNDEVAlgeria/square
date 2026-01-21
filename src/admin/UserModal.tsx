import { useState } from "react"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabase"

interface UserModalProps {
  user: any // Now expected to have id, name, email, balance
  close: () => void
  reload: () => void
}

export default function UserModal({ user, close, reload }: UserModalProps) {
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(user?.balance || 0)

  async function save() {
    try {
      setLoading(true)

      // Update only the balance in the users table
      const { error } = await supabase
        .from("profiles")
        .update({ balance: Number(balance) })
        .eq("id", user.id)

      if (error) throw error

      toast.success("Balance updated successfully")
      reload()
      close()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[95%] max-w-md space-y-3">
        <h2 className="text-xl font-bold">Edit User Balance</h2>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">User Name</label>
          <input
            type="text"
            className="input bg-gray-100 cursor-not-allowed opacity-70"
            value={user?.name}
            disabled
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
          <input
            type="text"
            className="input bg-gray-100 cursor-not-allowed opacity-70"
            value={user?.email}
            disabled
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Current Balance</label>
          <input
            type="number"
            className="input border-blue-500 focus:ring-2"
            placeholder="0.00"
            value={balance}
            onChange={e => setBalance(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={close} className="btn-secondary">
            Cancel
          </button>
          <button onClick={save} disabled={loading} className="btn-primary">
            {loading ? "Updating..." : "Update Balance"}
          </button>
        </div>
      </div>
    </div>
  )
}