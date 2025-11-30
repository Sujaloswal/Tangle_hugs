import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import * as THREE from 'three'

function Wedge({ targetPos, hovered }: { targetPos: Vector3; hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!meshRef.current) return
    
    meshRef.current.position.lerp(targetPos, 0.12)
    meshRef.current.rotation.z += 0.02
    
    const targetScale = hovered ? 1.8 : 1
    meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.12)
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <coneGeometry args={[0.12, 0.25, 3, 1, true]} />
        <meshStandardMaterial color="#8B7355" transparent opacity={0.85} />
      </mesh>
      <group ref={particlesRef} />
    </group>
  )
}

export default function Cursor3D() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const targetPos = useRef(new Vector3(0, 0, 0))
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
      targetPos.current.set(x * 5, y * 3, 0)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
        setHovered(true)
      } else {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Wedge targetPos={targetPos.current} hovered={hovered} />
      </Canvas>
    </div>
  )
}
