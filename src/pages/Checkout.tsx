import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [showQRCode, setShowQRCode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Your UPI QR Code URL
  const UPI_QR_CODE_URL = '/upi-qr-code.jpeg'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setShowQRCode(true)
  }

  const handleConfirmPayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          status: 'pending', // Will be updated after payment verification
          total: total,
          shipping_address: formData
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and redirect
      clearCart()
      navigate('/profile?order=success')
    } catch (err: any) {
      setError(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center glass-effect p-12 rounded-4xl">
          <div className="text-6xl mb-6">🧺</div>
          <h2 className="text-4xl font-cursive text-yarn mb-4">Your cart is empty</h2>
          <p className="text-yarn-light mb-8">Add some cozy items to get started!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="bg-blush text-white px-8 py-4 rounded-full hover:bg-blush-dark transition-all shadow-soft font-semibold"
          >
            Continue Shopping
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-cursive text-yarn mb-12 text-center"
        >
          Checkout
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-4xl shadow-soft p-8"
          >
            <h2 className="text-3xl font-cursive text-yarn mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-blush/20 pb-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image_url || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-2xl"
                    />
                    <div>
                      <p className="text-yarn font-semibold">{item.title}</p>
                      <p className="text-yarn-light text-sm">Qty: {item.quantity}</p>
                      <p className="text-blush-dark font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-yarn font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-blush/20 pt-6 space-y-3">
              <div className="flex justify-between text-yarn-light">
                <span>Subtotal:</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-yarn-light">
                <span>Shipping:</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-yarn font-bold text-2xl pt-3 border-t border-blush/20">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form / Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-4xl shadow-soft p-8"
          >
            {!showQRCode ? (
              <>
                <h2 className="text-3xl font-cursive text-yarn mb-6">Shipping Information</h2>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <label className="block text-yarn font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                    />
                  </div>

                  <div>
                    <label className="block text-yarn font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                    />
                  </div>

                  <div>
                    <label className="block text-yarn font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                    />
                  </div>

                  <div>
                    <label className="block text-yarn font-medium mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-yarn font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                      />
                    </div>

                    <div>
                      <label className="block text-yarn font-medium mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-yarn font-medium mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                      />
                    </div>

                    <div>
                      <label className="block text-yarn font-medium mb-2">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blush text-white py-4 rounded-full hover:bg-blush-dark transition-all text-lg font-semibold mt-6 shadow-soft"
                  >
                    Proceed to Payment
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-blush/20 to-blush-dark/20 rounded-full p-4 mb-4">
                    <span className="text-5xl">💝</span>
                  </div>
                  <h2 className="text-4xl font-cursive text-yarn mb-2">Almost There!</h2>
                  <p className="text-yarn-light text-lg">Complete your payment to get your cozy items</p>
                </div>

                {/* Beautiful QR Code Card */}
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-8 rounded-4xl shadow-soft-lg mb-6 inline-block relative overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-blush/10 rounded-full -translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-blush-dark/10 rounded-full translate-x-16 translate-y-16"></div>
                  
                  <div className="relative">
                    <div className="mb-4">
                      <p className="text-yarn font-semibold text-lg mb-1">Scan to Pay</p>
                      <p className="text-blush-dark font-bold text-3xl">₹{total.toFixed(2)}</p>
                    </div>
                    
                    {/* QR Code with cute border */}
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-blush to-blush-dark rounded-3xl blur-xl opacity-20"></div>
                      <div className="relative bg-white p-4 rounded-3xl border-4 border-blush/20">
                        <img 
                          src={UPI_QR_CODE_URL} 
                          alt="UPI QR Code" 
                          className="w-72 h-72 object-contain rounded-2xl"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-72 h-72 flex items-center justify-center bg-gradient-to-br from-blush-light to-blush/30 rounded-2xl">
                                <div class="text-center p-8">
                                  <div class="text-6xl mb-4">📱</div>
                                  <p class="text-yarn font-medium">Add QR Code</p>
                                  <p class="text-yarn-light text-sm mt-2">Save as:<br/>upi-qr-code.png</p>
                                </div>
                              </div>
                            `
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-yarn-light text-sm">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>UPI ID: oswalarchie@okaxis</span>
                    </div>
                  </div>
                </motion.div>

                {/* Cute Instructions */}
                <div className="glass-effect p-6 rounded-3xl mb-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">✨</span>
                    <h3 className="text-yarn font-semibold text-lg">How to Pay</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blush text-white text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <p className="text-yarn-light">Open Google Pay, PhonePe, or any UPI app</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blush text-white text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <p className="text-yarn-light">Tap "Scan QR" and scan the code above</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blush text-white text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <p className="text-yarn-light">Verify amount is ₹{total.toFixed(2)} and complete payment</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blush text-white text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <p className="text-yarn-light">Click the button below after payment is done</p>
                    </div>
                  </div>
                </div>

                {/* Cute notice */}
                <div className="bg-gradient-to-r from-blush-light to-blush/30 border-2 border-blush/40 p-5 rounded-3xl mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">💳</span>
                    <p className="text-yarn font-semibold">UPI Only</p>
                  </div>
                  <p className="text-yarn-light text-sm">
                    We currently accept UPI payments only. Other payment methods coming soon! 🎉
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQRCode(false)}
                    className="flex-1 glass-effect border-2 border-blush/30 text-yarn py-4 rounded-full hover:bg-blush-light transition-all font-semibold"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="flex-1 bg-blush text-white py-4 rounded-full hover:bg-blush-dark transition-all font-semibold shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : "I've Completed Payment"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
