import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

interface Review {
  id: string
  rating: number
  comment: string
  user_name: string
  created_at: string
}

export default function TestimonialsScroll() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setReviews(data)
    }
  }

  if (reviews.length === 0) return null

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews]

  return (
    <div className="overflow-hidden py-12 bg-gradient-to-r from-blush-light/30 to-transparent">
      <h2 className="text-4xl font-cursive text-yarn text-center mb-8">
        What Our Customers Say 💝
      </h2>
      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -100 * reviews.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="flex-shrink-0 w-80 glass-effect p-6 rounded-3xl shadow-soft"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < review.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <p className="text-yarn-light mb-4 line-clamp-3">"{review.comment}"</p>
              <p className="text-yarn font-semibold">- {review.user_name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
