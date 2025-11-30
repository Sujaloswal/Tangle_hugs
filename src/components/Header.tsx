import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import LogoImage from './LogoImage'
import CartDrawer from './CartDrawer'

export default function Header() {
  const { user, role, signOut } = useAuth()
  const { itemCount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <header className="glass-effect border-b border-blush/20 py-4 px-6 sticky top-0 z-30 shadow-soft">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <LogoImage size="md" />
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link to="/shop" className="text-yarn font-medium hover:text-blush-dark transition-all hover:scale-105">
              Shop
            </Link>
            <Link to="/about" className="text-yarn font-medium hover:text-blush-dark transition-all hover:scale-105">
              About
            </Link>
            
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-yarn font-medium hover:text-blush-dark transition-all hover:scale-105"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
            
            {user ? (
              <>
                {role === 'admin' && (
                  <Link to="/admin" className="text-yarn font-medium hover:text-blush-dark transition-all hover:scale-105">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-yarn font-medium hover:text-blush-dark transition-all hover:scale-105">
                  Profile
                </Link>
                <button 
                  onClick={signOut} 
                  className="px-5 py-2 rounded-full bg-blush-light text-yarn hover:bg-blush transition-all hover:scale-105"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-5 py-2 rounded-full bg-blush text-white hover:bg-blush-dark transition-all hover:scale-105 shadow-soft"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
