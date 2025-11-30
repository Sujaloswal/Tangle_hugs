import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useSearchParams } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const orderSuccess = searchParams.get('order') === 'success'

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-cursive text-yarn mb-8">My Profile</h1>

        {orderSuccess && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            Order placed successfully! Thank you for your purchase.
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-cursive text-yarn mb-4">Account Details</h2>
          <p className="text-yarn"><strong>Email:</strong> {user?.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-cursive text-yarn mb-6">Order History</h2>
          
          {loading ? (
            <p className="text-yarn/70">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-yarn/70">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-yarn/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-yarn font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-yarn/60 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-yarn">
                          {item.products?.title} × {item.quantity}
                        </span>
                        <span className="text-yarn">${(item.unit_price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-yarn/10 pt-3 flex justify-between">
                    <span className="text-yarn font-medium">Total:</span>
                    <span className="text-yarn font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
