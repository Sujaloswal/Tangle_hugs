export default function LogoImage({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24'
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <img 
        src="/logo.png" 
        alt="Tangled Hugs Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}
