export default function CursiveLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon - Tangled yarn symbol matching Instagram brand */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Pink watercolor background */}
          <ellipse cx="50" cy="45" rx="45" ry="20" fill="#FFD6D6" opacity="0.6" />
          
          {/* Tangled yarn lines */}
          <path
            d="M 20,40 Q 35,25 50,40 T 80,40"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 25,50 Q 40,35 55,50 T 75,50"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Small decorative dots */}
          <circle cx="30" cy="25" r="2" fill="#FFB6C1" />
          <circle cx="45" cy="20" r="2.5" fill="#FFB6C1" />
          <circle cx="70" cy="25" r="2" fill="#FFB6C1" />
          <circle cx="80" cy="30" r="1.5" fill="#FFB6C1" />
        </svg>
      </div>
      
      <h1 className="font-cursive text-4xl text-yarn">
        Tangled Hugss
      </h1>
    </div>
  )
}
