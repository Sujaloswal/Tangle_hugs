import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'

export default function Shop() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSort()
  }, [products, category, sortBy])

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
    
    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  function filterAndSort() {
    let filtered = [...products]
    
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }
    
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    
    setFilteredProducts(filtered)
  }

  function handleSearch(query: string) {
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProducts(filtered)
  }

  const categories = ['all', ...new Set(products.map(p => p.category))]

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-cursive text-yarn mb-4">Shop Collection</h1>
          <p className="text-yarn-light text-lg">Explore our handcrafted crochet pieces</p>
        </div>
        
        <div className="flex justify-center mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center mb-12">
          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-3 rounded-full transition-all font-medium ${
                  category === cat
                    ? 'bg-blush text-white shadow-soft'
                    : 'glass-effect text-yarn hover:bg-blush-light'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 rounded-full glass-effect border-2 border-blush/30 text-yarn focus:outline-none focus:border-blush font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blush border-t-transparent rounded-full animate-spin"></div>
            <p className="text-yarn-light mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-effect rounded-4xl">
            <p className="text-yarn-light text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
