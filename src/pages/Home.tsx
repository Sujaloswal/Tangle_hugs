import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import TestimonialsScroll from '../components/TestimonialsScroll'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  async function fetchFeaturedProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .limit(4)
    
    if (data) setFeaturedProducts(data)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-2 bg-blush-light rounded-full text-blush-dark text-sm font-medium mb-6"
            >
              ✨ Handcrafted with Love
            </motion.div>
            <h1 className="text-7xl font-cursive text-yarn mb-6 leading-tight">
              Cozy Crochet
              <span className="block text-gradient">for Your Soul</span>
            </h1>
            <p className="text-xl text-yarn-light mb-10 leading-relaxed">
              Discover unique crochet pieces that bring warmth and joy to your life. Each item is lovingly handmade with premium yarn.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/shop"
                className="bg-blush text-white px-8 py-4 rounded-full hover:bg-blush-dark transition-all hover:scale-105 shadow-soft font-medium"
              >
                Shop Collection
              </Link>
              <Link 
                to="/about"
                className="glass-effect border-2 border-blush text-yarn px-8 py-4 rounded-full hover:bg-blush-light transition-all hover:scale-105 font-medium"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blush/30 to-blush-dark/30 rounded-4xl blur-3xl"></div>
            <div className="relative h-[500px] glass-effect rounded-4xl flex items-center justify-center shadow-soft-lg overflow-hidden p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-blush-light/50 to-transparent"></div>
              <div className="z-10 w-full max-w-md">
                <img 
                  src="/logo.png" 
                  alt="Tangled Hugs" 
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-cursive text-yarn mb-4">Featured Collection</h2>
            <p className="text-yarn-light text-lg">Handpicked favorites just for you</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/shop"
              className="inline-flex items-center gap-2 text-blush-dark hover:text-blush font-medium text-lg transition-all hover:gap-3"
            >
              View All Products 
              <span>→</span>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Testimonials Scroll */}
      <TestimonialsScroll />

      {/* Why Choose Us */}
      <section className="py-24 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-cursive text-yarn mb-4">Why Choose Us?</h2>
            <p className="text-yarn-light text-lg">What makes Tangled Hugs special</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { emoji: '✨', title: 'Handmade Quality', desc: 'Every piece is carefully crafted by hand with attention to detail' },
              { emoji: '🎨', title: 'Unique Designs', desc: 'Original patterns you won\'t find anywhere else' },
              { emoji: '💝', title: 'Made with Love', desc: 'Each item carries the warmth and care of the maker' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="glass-effect p-8 rounded-4xl text-center hover:shadow-soft-lg transition-all hover:scale-105"
              >
                <div className="text-6xl mb-6">{item.emoji}</div>
                <h3 className="text-2xl font-cursive text-yarn mb-3">{item.title}</h3>
                <p className="text-yarn-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
