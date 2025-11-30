import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_urls: ['']
  })

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProduct()
    }
  }, [id])

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (!error && data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        price: data.price.toString(),
        category: data.category,
        stock: data.stock.toString(),
        image_urls: data.image_urls || ['']
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.image_urls]
    newUrls[index] = value
    setFormData(prev => ({ ...prev, image_urls: newUrls }))
  }

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      image_urls: [...prev.image_urls, '']
    }))
  }

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const productData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image_urls: formData.image_urls.filter(url => url.trim() !== '')
      }

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData)
        
        if (error) throw error
      }

      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (role !== 'admin') {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-cursive text-yarn mb-8">
          {id === 'new' ? 'Add New Product' : 'Edit Product'}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-yarn mb-2">Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
              />
            </div>

            <div>
              <label className="block text-yarn mb-2">Slug (URL-friendly name)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated from title"
                className="w-full px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
              />
            </div>

            <div>
              <label className="block text-yarn mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-yarn mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
                />
              </div>

              <div>
                <label className="block text-yarn mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
                />
              </div>
            </div>

            <div>
              <label className="block text-yarn mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                placeholder="e.g., amigurumi, blankets, accessories"
                className="w-full px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
              />
            </div>

            <div>
              <label className="block text-yarn mb-2">Image URLs</label>
              {formData.image_urls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border border-yarn/30 rounded focus:outline-none focus:border-yarn"
                  />
                  {formData.image_urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-4 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageUrl}
                className="text-yarn hover:text-yarn/70 text-sm"
              >
                + Add Another Image
              </button>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yarn text-cream py-3 rounded-full hover:bg-yarn/80 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-8 py-3 border-2 border-yarn text-yarn rounded-full hover:bg-yarn/10 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
