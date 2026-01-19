import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ProductModal from "./ProductModal"
import toast from "react-hot-toast"
import Loader from "../components/Loader"

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [edit, setEdit] = useState<any>(null)

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })
    if (error) {
      toast.error(error.message)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  async function del(id: string) {
    if (!confirm("Delete product?")) return
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) return toast.error(error.message)
    toast.success("Deleted")
    loadProducts()
  }

  useEffect(() => {
    loadProducts()
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + Add Product
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <img src={p.image_url} className="h-40 w-full object-cover rounded" />
            <h2 className="font-bold mt-2">{p.title}</h2>
            <p className="text-sm text-gray-600">{p.price} DA</p>

            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEdit(p); setModalOpen(true) }} className="btn-secondary">
                Edit
              </button>
              <button onClick={() => del(p.id)} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ProductModal
          product={edit}
          close={() => { setModalOpen(false); setEdit(null) }}
          reload={loadProducts}
        />
      )}
    </div>
  )
}
