import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (role === 'admin') {
      fetchOrders()
      fetchProducts()
      
      // Auto-refresh every 30 minutes (1800000 milliseconds)
      const refreshInterval = setInterval(() => {
        fetchOrders()
        fetchProducts()
      }, 1800000) // 30 minutes
      
      // Cleanup interval on unmount
      return () => clearInterval(refreshInterval)
    }
  }, [role])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*)), users(email)')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
    setRefreshing(false)
    setLastUpdated(new Date())
  }
  
  async function handleManualRefresh() {
    setRefreshing(true)
    await fetchOrders()
    await fetchProducts()
  }

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setProducts(data)
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    
    if (!error) {
      fetchOrders()
    }
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (!error) {
      fetchProducts()
    }
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-cursive text-yarn">Admin Dashboard</h1>
          <div className="text-right">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="bg-blush text-white px-6 py-3 rounded-full hover:bg-blush-dark transition-all shadow-soft disabled:opacity-50 flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Refresh Now
                </>
              )}
            </button>
            <p className="text-yarn-light text-sm mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <p className="text-yarn-light text-xs">Auto-refreshes every 30 min</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-full transition ${
              activeTab === 'orders'
                ? 'bg-yarn text-cream'
                : 'bg-white text-yarn hover:bg-yarn/10'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-full transition ${
              activeTab === 'products'
                ? 'bg-yarn text-cream'
                : 'bg-white text-yarn hover:bg-yarn/10'
            }`}
          >
            Products
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-cursive text-yarn mb-6">Orders Management</h2>
            
            {loading ? (
              <p className="text-yarn/70">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-yarn/70">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-yarn/20">
                      <th className="text-left py-3 px-4 text-yarn">Order ID</th>
                      <th className="text-left py-3 px-4 text-yarn">Customer</th>
                      <th className="text-left py-3 px-4 text-yarn">Items</th>
                      <th className="text-left py-3 px-4 text-yarn">Total</th>
                      <th className="text-left py-3 px-4 text-yarn">Status</th>
                      <th className="text-left py-3 px-4 text-yarn">Date</th>
                      <th className="text-left py-3 px-4 text-yarn">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-yarn/10">
                        <td className="py-3 px-4 text-yarn text-sm">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4 text-yarn text-sm">
                          {order.users?.email || order.shipping_address?.email || 'Guest'}
                        </td>
                        <td className="py-3 px-4 text-yarn text-sm">
                          {order.order_items?.length || 0} items
                        </td>
                        <td className="py-3 px-4 text-yarn font-medium">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 rounded border border-yarn/30 text-yarn text-sm focus:outline-none focus:border-yarn"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-yarn text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-yarn hover:text-yarn/70 text-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cursive text-yarn">Products Management</h2>
              <Link
                to="/admin/product/new"
                className="bg-yarn text-cream px-6 py-2 rounded-full hover:bg-yarn/80 transition"
              >
                Add New Product
              </Link>
            </div>
            
            {loading ? (
              <p className="text-yarn/70">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-yarn/70">No products yet</p>
            ) : (
              <div className="grid gap-4">
                {products.map(product => (
                  <div key={product.id} className="flex gap-4 border border-yarn/20 rounded-lg p-4">
                    <img
                      src={product.image_urls?.[0] || '/placeholder.jpg'}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-yarn font-medium text-lg">{product.title}</h3>
                      <p className="text-yarn/60 text-sm">{product.category}</p>
                      <p className="text-yarn font-bold mt-1">${product.price.toFixed(2)}</p>
                      <p className="text-yarn/60 text-sm">Stock: {product.stock}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/admin/product/${product.id}`}
                        className="text-yarn hover:text-yarn/70 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
