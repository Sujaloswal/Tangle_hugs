export default function About() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-64 h-64">
              <img 
                src="/logo.png" 
                alt="Tangled Hugs" 
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
          
          <h1 className="text-6xl font-cursive text-yarn mb-4">About Tangled Hugs</h1>
          <p className="text-yarn-light text-xl">Handcrafted with love, one stitch at a time</p>
        </div>

        <div className="glass-effect rounded-4xl p-10 mb-10 shadow-soft">
          <h2 className="text-4xl font-cursive text-yarn mb-8">Our Story</h2>
          <p className="text-xl text-yarn mb-6 leading-relaxed">
            Every piece is handcrafted with love and care, bringing warmth to your home. 
            At Tangled Hugs, we believe in the magic of handmade creations that carry 
            the heart and soul of the maker.
          </p>
          <p className="text-lg text-yarn-light mb-6 leading-relaxed">
            Each crochet item is carefully crafted using premium yarn, ensuring quality 
            and durability. From cozy blankets to adorable amigurumi, every stitch tells 
            a story of patience, creativity, and love.
          </p>
          <p className="text-lg text-yarn-light leading-relaxed">
            We're passionate about bringing handmade warmth into your life, one stitch at a time.
          </p>
        </div>

        <div className="glass-effect rounded-4xl p-10 mb-10 shadow-soft">
          <h2 className="text-4xl font-cursive text-yarn mb-10">Why Choose Handmade?</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <span className="text-5xl">✨</span>
              <div>
                <h3 className="text-2xl font-semibold text-yarn mb-3">Unique & Special</h3>
                <p className="text-yarn-light text-lg leading-relaxed">No two pieces are exactly alike. Each item has its own character and charm.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-5xl">💝</span>
              <div>
                <h3 className="text-2xl font-semibold text-yarn mb-3">Made with Love</h3>
                <p className="text-yarn-light text-lg leading-relaxed">Every stitch is made with care, attention, and genuine love for the craft.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-5xl">🌿</span>
              <div>
                <h3 className="text-2xl font-semibold text-yarn mb-3">Sustainable Choice</h3>
                <p className="text-yarn-light text-lg leading-relaxed">Supporting handmade means supporting sustainable, slow fashion and small businesses.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-blush/40 to-blush-dark/40 rounded-4xl p-12 shadow-soft-lg">
          <h2 className="text-4xl font-cursive text-yarn mb-4">Connect With Us</h2>
          <p className="text-yarn-light text-lg mb-8">
            Follow our journey and see behind-the-scenes of our creations!
          </p>
          <a 
            href="https://www.instagram.com/tangledhugss?igsh=OHg0amdnNGY4a2Ew" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-yarn px-10 py-5 rounded-full hover:bg-blush-light transition-all text-lg font-semibold shadow-soft-lg hover:scale-105"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @tangledhugss
          </a>
        </div>
      </div>
    </div>
  )
}
