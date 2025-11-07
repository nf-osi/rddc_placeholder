import { useEffect, useRef } from 'react'
import './NetworkBackground.css'

function NetworkBackground() {
  const canvasRef = useRef(null)
  const animationIdRef = useRef(null)
  const nodesRef = useRef([])
  const particlesRef = useRef([])
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
      'rgba(168, 85, 247, 0.9)',  // lighter purple
      'rgba(139, 92, 246, 0.9)',  // violet
      'rgba(67, 56, 202, 0.9)',   // deeper indigo
    ]

    const numNodes = 120
    const connectionDistance = 250
    const maxConnections = 16

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
          flash: 0, // Flash intensity for particle collision effect
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

        // Decay flash effect
        if (node.flash > 0) {
          node.flash -= 0.03
          if (node.flash < 0) node.flash = 0
        }
      })

      // Collect active connections for particle creation
      const activeConnections = []

      // Draw connections with gradients
      nodes.forEach((node1, i) => {
        let connectionCount = 0

        nodes.slice(i + 1).forEach((node2, j) => {
          if (connectionCount >= maxConnections) return

          const dx = node1.x - node2.x
          const dy = node1.y - node2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            connectionCount++

            // Store connection for particle system
            activeConnections.push({ node1Index: i, node2Index: i + j + 1 })

            // Calculate opacity based on distance and pulse with minimum brightness
            const baseOpacity = (1 - distance / connectionDistance) * 0.25 *
                          (node1.pulse * 0.5 + 0.5) * (node2.pulse * 0.5 + 0.5)
            const opacity = Math.max(baseOpacity, 0.08)

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

      // Build adjacency map for pathfinding
      const adjacencyMap = new Map()
      nodes.forEach((_, i) => adjacencyMap.set(i, []))

      activeConnections.forEach(conn => {
        adjacencyMap.get(conn.node1Index).push(conn.node2Index)
        adjacencyMap.get(conn.node2Index).push(conn.node1Index)
      })

      // Generate a random path through the graph (at least 10 nodes)
      const generatePath = (startIndex, minLength = 10) => {
        const path = [startIndex]
        let current = startIndex
        const visited = new Set([startIndex])

        while (path.length < minLength) {
          const neighbors = adjacencyMap.get(current) || []
          // Filter out visited nodes, but allow revisiting if stuck
          let available = neighbors.filter(n => !visited.has(n))

          if (available.length === 0) {
            // If stuck, allow any neighbor
            available = neighbors
            if (available.length === 0) break
          }

          const next = available[Math.floor(Math.random() * available.length)]
          path.push(next)
          visited.add(next)
          current = next
        }

        return path.length >= minLength ? path : null
      }

      // Update and create particles (reduced spawn rate by 75% from original, max 10 particles)
      if (nodes.length > 0 && Math.random() < 0.0375 && particlesRef.current.length < 10) {
        const startNode = Math.floor(Math.random() * nodes.length)
        const path = generatePath(startNode, 10)

        if (path) {
          particlesRef.current.push({
            path: path,
            segmentIndex: 0,
            segmentProgress: 0,
            speed: (0.01 + Math.random() * 0.0075) * 0.75, // Max speed reduced by 50%
          })
          // Flash the starting node
          nodes[startNode].flash = 1
        }
      }

      // Update particle positions and remove completed ones
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.segmentProgress += particle.speed

        // Move to next segment when current one completes
        if (particle.segmentProgress >= 1) {
          particle.segmentIndex++
          particle.segmentProgress = 0

          // Remove particle if path is complete
          if (particle.segmentIndex >= particle.path.length - 1) {
            return false
          }

          // Flash the node we just reached
          const nodeIndex = particle.path[particle.segmentIndex]
          if (nodes[nodeIndex]) {
            nodes[nodeIndex].flash = 1
          }
        }

        return true
      })

      // Draw particles as white dots
      particlesRef.current.forEach(particle => {
        const node1Index = particle.path[particle.segmentIndex]
        const node2Index = particle.path[particle.segmentIndex + 1]

        const node1 = nodes[node1Index]
        const node2 = nodes[node2Index]

        if (!node1 || !node2) return

        const x = node1.x + (node2.x - node1.x) * particle.segmentProgress
        const y = node1.y + (node2.y - node1.y) * particle.segmentProgress

        // Outer glow
        const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, 8)
        outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
        outerGlow.addColorStop(0.4, 'rgba(200, 220, 255, 0.3)')
        outerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = outerGlow
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Middle ring
        const middleRing = ctx.createRadialGradient(x, y, 0, x, y, 4)
        middleRing.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        middleRing.addColorStop(0.6, 'rgba(220, 235, 255, 0.6)')
        middleRing.addColorStop(1, 'rgba(255, 255, 255, 0.2)')

        ctx.fillStyle = middleRing
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Core with slight gradient
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 2.5)
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        coreGradient.addColorStop(0.7, 'rgba(240, 248, 255, 1)')
        coreGradient.addColorStop(1, 'rgba(220, 235, 255, 0.9)')

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Inner bright highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.beginPath()
        ctx.arc(x - 0.5, y - 0.5, 1, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw nodes with glow effect
      nodes.forEach((node) => {
        const size = node.size * (0.85 + node.pulse * 0.3)
        const glowSize = size * 4

        // Flash effect - extra bright glow when particle hits
        if (node.flash > 0) {
          const flashSize = size * 8 * node.flash
          const flashGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, flashSize
          )
          flashGradient.addColorStop(0, `rgba(255, 255, 255, ${0.6 * node.flash})`)
          flashGradient.addColorStop(0.3, node.color.replace('0.9', String(0.4 * node.flash)))
          flashGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

          ctx.fillStyle = flashGradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, flashSize, 0, Math.PI * 2)
          ctx.fill()
        }

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

        // Bright center highlight (brighter when flashing)
        const highlightOpacity = 0.6 + (node.flash * 0.4)
        ctx.fillStyle = `rgba(255, 255, 255, ${highlightOpacity})`
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
