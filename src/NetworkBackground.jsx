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

    const numNodes = 30
    const connectionDistance = 250
    const maxConnections = 4

    // Initialize nodes
    const initializeNodes = () => {
      nodesRef.current = []
      for (let i = 0; i < numNodes; i++) {
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: 0, // Will be set to initial x
          baseY: 0, // Will be set to initial y
          vx: 0,
          vy: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 2.5,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
      // Store base positions
      nodesRef.current.forEach(node => {
        node.baseX = node.x
        node.baseY = node.y
      })
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
      // Clear canvas - less trail for more structured look
      ctx.fillStyle = 'rgba(10, 14, 26, 0.4)'
      ctx.fillRect(0, 0, width, height)

      timeRef.current += 0.008

      const nodes = nodesRef.current

      // Update node positions with gentle floating motion
      nodes.forEach((node, i) => {
        // Gentle floating around base position
        const floatX = Math.sin(timeRef.current * 0.5 + i) * 15
        const floatY = Math.cos(timeRef.current * 0.3 + i) * 15

        // Target position is base + gentle float
        const targetX = node.baseX + floatX
        const targetY = node.baseY + floatY

        // Smooth interpolation to target
        node.x += (targetX - node.x) * 0.05
        node.y += (targetY - node.y) * 0.05

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
