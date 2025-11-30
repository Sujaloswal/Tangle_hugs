import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp, role } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      if (isSignUp) {
        await signUp(email, password, fullName)
      } else {
        await signIn(email, password)
      }
      
      if (role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-4xl shadow-soft-lg p-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-cursive text-yarn mb-2">
            {isSignUp ? 'Join Us' : 'Welcome Back'}
          </h1>
          <p className="text-yarn-light">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl mb-6"
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-yarn font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-yarn font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
              required
            />
          </div>
          
          <div>
            <label className="block text-yarn font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border-2 border-blush/30 rounded-2xl focus:outline-none focus:border-blush transition-all glass-effect"
              required
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blush text-white py-4 rounded-full hover:bg-blush-dark transition-all font-semibold text-lg shadow-soft mt-6"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </motion.button>
        </form>
        
        <p className="text-center text-yarn-light mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blush-dark ml-2 hover:text-blush font-medium transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
