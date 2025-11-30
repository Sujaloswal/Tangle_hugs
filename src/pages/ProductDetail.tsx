import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (!error && data) {
      setProduct(data)
    }
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blush border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-yarn-light">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-effect p-12 rounded-4xl">
          <p className="text-yarn text-xl mb-6">Product not found</p>
          <Link to="/shop" className="inline-block bg-blush text-white px-6 py-3 rounded-full hover:bg-blush-dark transition-all">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-blush-dark hover:text-blush font-medium mb-8 transition-all hover:gap-3">
          <span>←</span> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-16 mt-6">
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-4xl overflow-hidden shadow-soft-lg"
            >
              <img
                src={product.image_urls[selectedImage] || '/placeholder.jpg'}
                alt={product.title}
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
            
            {product.image_urls.length > 1 && (
              <div className="flex gap-3 mt-6">
                {product.image_urls.map((url: string, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all ${
                      selectedImage === idx ? 'border-blush shadow-soft' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="inline-block px-4 py-2 bg-blush-light rounded-full text-blush-dark text-sm font-medium mb-4 w-fit capitalize">
              {product.category}
            </div>
            <h1 className="text-5xl font-cursive text-yarn mb-6 leading-tight">{product.title}</h1>
            <p className="text-4xl font-bold text-yarn mb-8">${product.price.toFixed(2)}</p>
            
            <p className="text-yarn-light text-lg mb-8 leading-relaxed">{product.description}</p>
            
            <div className="glass-effect p-6 rounded-3xl mb-8">
              <p className="text-yarn mb-4 font-medium">
                {product.stock > 0 ? (
                  <span className="text-green-600">✓ {product.stock} in stock</span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </p>
              
              <div className="flex items-center gap-6">
                <label className="text-yarn font-medium">Quantity:</label>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 glass-effect border-2 border-blush/30 rounded-full flex items-center justify-center hover:bg-blush-light transition-all font-bold text-yarn"
                  >
                    -
                  </motion.button>
                  <span className="text-yarn text-xl w-16 text-center font-semibold">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 glass-effect border-2 border-blush/30 rounded-full flex items-center justify-center hover:bg-blush-light transition-all font-bold text-yarn"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-blush text-white py-5 rounded-full hover:bg-blush-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-soft-lg"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
