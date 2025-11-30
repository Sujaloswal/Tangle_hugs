import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

interface ProductCardProps {
  product: {
    id: string
    title: string
    price: number
    image_urls: string[]
    category: string
    stock: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    addToCart(product)
  }

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-effect rounded-3xl shadow-soft overflow-hidden group"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={product.image_urls[0] || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>
      
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-yarn group-hover:text-blush-dark transition-colors mb-2">
            {product.title}
          </h3>
        </Link>
        <p className="text-yarn-light text-sm mb-4 capitalize">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yarn">${product.price.toFixed(2)}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blush text-white px-5 py-2.5 rounded-full hover:bg-blush-dark transition-all shadow-soft disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
