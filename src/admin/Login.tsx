import { useState } from "react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const nav = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return toast.error(error.message)

    if (data.user?.app_metadata?.role !== "admin") {
      await supabase.auth.signOut()
      return toast.error("Not authorized as admin")
    }

    toast.success("Welcome Admin")
    nav("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-500 to-brown-700">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-xl w-87.5"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <input
          type="email"
          className="input"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="input mt-3"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="btn-primary w-full mt-6">
          Login
        </button>
      </form>
    </div>
  )
}
