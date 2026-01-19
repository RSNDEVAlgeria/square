import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabase"
import { uploadToCloudinary } from "../lib/cloudinary"

export default function ProductModal({ product, close, reload }: any) {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(product?.image_url || "")
  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    type: product?.type || "",
    image_url: product?.image_url || "",
  })

  useEffect(() => {
    if (file) setPreview(URL.createObjectURL(file))
  }, [file])

  async function save() {
    try {
      setLoading(true)

      let imageUrl = form.image_url
      if (file) imageUrl = await uploadToCloudinary(file)

      if (!imageUrl || !form.title) {
        toast.error("Title and image required")
        return
      }

      const payload = { ...form, image_url: imageUrl }

      const query = product
        ? supabase.from("products").update(payload).eq("id", product.id)
        : supabase.from("products").insert(payload)

      const { error } = await query
      if (error) throw error

      toast.success(product ? "Product updated" : "Product added")
      reload() // reload products in parent
      close()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[95%] max-w-md space-y-3">
        <h2 className="text-xl font-bold">{product ? "Edit" : "Add"} Product</h2>

        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="input"
          placeholder="Type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        />

        <label className="block">
          <span className="text-sm text-gray-600">Product Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </label>

        {preview && (
          <img src={preview} className="h-40 w-full object-cover rounded" />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={close} className="btn-secondary">Cancel</button>
          <button onClick={save} disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
