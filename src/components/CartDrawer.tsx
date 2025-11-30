import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass-effect shadow-soft-lg z-50 flex flex-col"
          >
            <div className="p-8 border-b border-blush/20">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-cursive text-yarn">Your Cart</h2>
                  <p className="text-yarn-light text-sm mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose} 
                  className="w-10 h-10 rounded-full glass-effect border-2 border-blush/30 flex items-center justify-center text-yarn hover:border-blush transition-all text-2xl"
                >
                  ×
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center mt-20">
                  <div className="text-6xl mb-4">🧺</div>
                  <p className="text-yarn-light text-lg">Your cart is empty</p>
                  <p className="text-yarn-light text-sm mt-2">Add some cozy items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 glass-effect p-4 rounded-3xl border border-blush/20"
                    >
                      <img
                        src={item.image_url || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-2xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-yarn font-semibold mb-1">{item.title}</h3>
                        <p className="text-blush-dark font-bold">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 border-2 border-blush/30 rounded-full flex items-center justify-center hover:bg-blush-light transition-all font-bold text-yarn"
                          >
                            -
                          </motion.button>
                          <span className="text-yarn font-semibold w-8 text-center">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border-2 border-blush/30 rounded-full flex items-center justify-center hover:bg-blush-light transition-all font-bold text-yarn"
                          >
                            +
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-400 hover:text-red-600 text-sm font-medium"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-blush/20 glass-effect">
                <div className="flex justify-between mb-6 items-baseline">
                  <span className="text-yarn-light font-medium text-lg">Total:</span>
                  <span className="text-yarn font-bold text-3xl">${total.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blush text-white text-center py-4 rounded-full hover:bg-blush-dark transition-all font-semibold text-lg shadow-soft"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
