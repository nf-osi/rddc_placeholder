import { useEffect, useRef } from 'react'
import './NetworkBackground.css'

function NetworkBackground() {
  const canvasRef = useRef(null)
  const animationIdRef = useRef(null)
  const nodesRef = useRef([])
  const timeRef = useRef(0)

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.offsetWidth || window.innerWidth
    let height = canvas.offsetHeight || window.innerHeight

    // Color palette - professional blue/purple gradient
    const colors = [
      'rgba(79, 70, 229, 0.9)',   // indigo
      'rgba(99, 102, 241, 0.9)',  // lighter indigo
      'rgba(124, 58, 237, 0.9)',  // purple
    ]

    const numNodes = 25
    const connectionDistance = 200
    const maxConnections = 5

    // Initialize nodes
    const initializeNodes = () => {
      nodesRef.current = []
      for (let i = 0; i < numNodes; i++) {
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 2.5,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    // Setup canvas with device pixel ratio for crisp rendering
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const newWidth = canvas.offsetWidth || window.innerWidth
      const newHeight = canvas.offsetHeight || window.innerHeight

      canvas.width = newWidth * dpr
      canvas.height = newHeight * dpr

      // Reset transform and apply new scale
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      // Update dimensions
      width = newWidth
      height = newHeight

      // Reinitialize nodes if significant size change
      if (nodesRef.current.length === 0) {
        initializeNodes()
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    const animate = () => {
      // Clear with slight trail effect for smooth motion blur
      ctx.fillStyle = 'rgba(10, 14, 26, 0.15)'
      ctx.fillRect(0, 0, width, height)

      timeRef.current += 0.008

      const nodes = nodesRef.current

      // Update node positions with flowing motion
      nodes.forEach((node, i) => {
        // Add perlin-like noise for organic movement
        const angle = Math.sin(node.x * 0.008 + timeRef.current) *
                     Math.cos(node.y * 0.008 + timeRef.current) * Math.PI
        node.vx += Math.cos(angle) * 0.015
        node.vy += Math.sin(angle) * 0.015

        // Damping for smooth deceleration
        node.vx *= 0.985
        node.vy *= 0.985

        // Update position
        node.x += node.vx
        node.y += node.vy

        // Smooth edge wrapping
        if (node.x < -20) node.x = width + 20
        if (node.x > width + 20) node.x = -20
        if (node.y < -20) node.y = height + 20
        if (node.y > height + 20) node.y = -20

        // Calculate pulse for subtle breathing effect
        node.pulse = (Math.sin(timeRef.current * 1.5 + node.pulseOffset) + 1) / 2
      })

      // Draw connections with gradients
      nodes.forEach((node1, i) => {
        let connectionCount = 0

        nodes.slice(i + 1).forEach((node2) => {
          if (connectionCount >= maxConnections) return

          const dx = node1.x - node2.x
          const dy = node1.y - node2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            connectionCount++

            // Calculate opacity based on distance and pulse
            const opacity = (1 - distance / connectionDistance) * 0.25 *
                          (node1.pulse * 0.5 + 0.5) * (node2.pulse * 0.5 + 0.5)

            // Create gradient along the connection
            const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y)
            gradient.addColorStop(0, node1.color.replace('0.9', String(opacity)))
            gradient.addColorStop(1, node2.color.replace('0.9', String(opacity)))

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(node1.x, node1.y)
            ctx.lineTo(node2.x, node2.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes with glow effect
      nodes.forEach((node) => {
        const size = node.size * (0.85 + node.pulse * 0.3)
        const glowSize = size * 4

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        )
        glowGradient.addColorStop(0, node.color.replace('0.9', String(0.3 * node.pulse)))
        glowGradient.addColorStop(0.5, node.color.replace('0.9', String(0.1 * node.pulse)))
        glowGradient.addColorStop(1, node.color.replace('0.9', '0'))

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Inner glow
        const innerGlow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, size * 1.5
        )
        innerGlow.addColorStop(0, node.color)
        innerGlow.addColorStop(1, node.color.replace('0.9', '0.3'))

        ctx.fillStyle = innerGlow
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Bright center highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  return (
    <div className="background-animation">
      <canvas
        ref={canvasRef}
        className="network-canvas"
      />
    </div>
  )
}

export default NetworkBackground
