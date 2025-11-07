import { useEffect, useRef, useState } from 'react'
import './NetworkBackground.css'

function NetworkBackground() {
  const svgRef = useRef(null)
  const edgesGroupRef = useRef(null)
  const nodesGroupRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const nodesRef = useRef([])
  const edgeConnectionsRef = useRef([])
  const frameCountRef = useRef(0)
  const animationIdRef = useRef(null)
  const lastNodeToggleRef = useRef(0)

  // Check for reduced motion preference
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  // Generate nodes
  const generateNodes = (width, height) => {
    const numNodes = 30
    const nodes = []

    for (let i = 0; i < numNodes; i++) {
      const isVisible = Math.random() > 0.3
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        id: i,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        opacity: isVisible ? 1 : 0,
        targetOpacity: isVisible ? 1 : 0,
        isAppearing: false,
        isDisappearing: false
      })
    }

    return nodes
  }

  // Create network
  const createNetwork = (svg, edgesGroup, nodesGroup, nodes, width, height) => {
    if (!svg || !edgesGroup || !nodesGroup) return

    // Clear existing
    edgesGroup.innerHTML = ''
    nodesGroup.innerHTML = ''
    const edgeConnections = []

    const maxConnections = 6
    const connections = new Set()
    const maxDistance = Math.min(width, height) * 0.4

    nodes.forEach((node, i) => {
      const distances = nodes
        .map((other, j) => ({
          node: other,
          index: j,
          distance: Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          )
        }))
        .filter(d => d.index !== i && d.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxConnections)

      distances.forEach(({ node: other, index: j }) => {
        const edgeId = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!connections.has(edgeId)) {
          connections.add(edgeId)

          const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          edge.setAttribute('class', 'network-edge')
          edge.setAttribute('x1', node.x)
          edge.setAttribute('y1', node.y)
          edge.setAttribute('x2', other.x)
          edge.setAttribute('y2', other.y)
          edgesGroup.appendChild(edge)

          edgeConnections.push({ node1: i, node2: j })
        }
      })
    })

    nodes.forEach((node, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('class', 'network-node')
      circle.setAttribute('cx', node.x)
      circle.setAttribute('cy', node.y)
      circle.setAttribute('r', 8)
      circle.setAttribute('style', `--node-index: ${i}`)
      nodesGroup.appendChild(circle)
    })

    return edgeConnections
  }

  // Animation loop
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const svg = svgRef.current
    const edgesGroup = edgesGroupRef.current
    const nodesGroup = nodesGroupRef.current

    if (!svg || !edgesGroup || !nodesGroup) return

    // Initialize nodes and timing
    nodesRef.current = generateNodes(dimensions.width, dimensions.height)
    lastNodeToggleRef.current = Date.now()
    edgeConnectionsRef.current = createNetwork(
      svg,
      edgesGroup,
      nodesGroup,
      nodesRef.current,
      dimensions.width,
      dimensions.height
    )

    const updateNetwork = () => {
      frameCountRef.current++
      const nodes = nodesRef.current
      const { width, height } = dimensions
      const currentTime = Date.now()

      // Every 3 seconds, toggle a random node's visibility
      if (currentTime - lastNodeToggleRef.current >= 3000) {
        lastNodeToggleRef.current = currentTime

        // Pick a random node
        const randomIndex = Math.floor(Math.random() * nodes.length)
        const node = nodes[randomIndex]

        // Toggle between appearing and disappearing
        if (node.opacity > 0.5) {
          // Node is visible, make it disappear
          node.isDisappearing = true
          node.isAppearing = false
          node.targetOpacity = 0
        } else {
          // Node is invisible, make it appear
          node.isAppearing = true
          node.isDisappearing = false
          node.targetOpacity = 1
        }
      }

      // Update node positions and opacity
      nodes.forEach(node => {
        // Elastic bounce at edges with coefficient > 1 for bouncy effect
        if (node.x <= 0 || node.x >= width) node.vx *= -1.15
        if (node.y <= 0 || node.y >= height) node.vy *= -1.15

        node.x = Math.max(0, Math.min(width, node.x + node.vx))
        node.y = Math.max(0, Math.min(height, node.y + node.vy))

        // Increased random drift for more motion
        node.vx += (Math.random() - 0.5) * 0.05
        node.vy += (Math.random() - 0.5) * 0.05

        // Less damping for more sustained motion
        node.vx *= 0.99
        node.vy *= 0.99

        // Animate opacity - smooth transition to target
        if (node.isAppearing || node.isDisappearing) {
          const opacityDiff = node.targetOpacity - node.opacity
          if (Math.abs(opacityDiff) < 0.01) {
            // Reached target
            node.opacity = node.targetOpacity
            node.isAppearing = false
            node.isDisappearing = false
          } else {
            // Move toward target - faster animation (0.03 per frame for ~1 second transition at 60fps)
            node.opacity += opacityDiff * 0.03
          }
        }
      })

      // Update SVG elements
      const nodeElements = nodesGroup.querySelectorAll('circle')
      nodeElements.forEach((circle, i) => {
        if (nodes[i]) {
          circle.setAttribute('cx', nodes[i].x)
          circle.setAttribute('cy', nodes[i].y)
          circle.setAttribute('opacity', nodes[i].opacity)
        }
      })

      // Recreate network every 30 frames
      if (frameCountRef.current % 30 === 0) {
        edgeConnectionsRef.current = createNetwork(
          svg,
          edgesGroup,
          nodesGroup,
          nodes,
          width,
          height
        )
      } else {
        // Update edge positions and opacity
        const edgeElements = edgesGroup.querySelectorAll('line')
        edgeConnectionsRef.current.forEach((edge, index) => {
          if (index < edgeElements.length && edge.node1 !== undefined && edge.node2 !== undefined) {
            const line = edgeElements[index]
            const node1 = nodes[edge.node1]
            const node2 = nodes[edge.node2]
            line.setAttribute('x1', node1.x)
            line.setAttribute('y1', node1.y)
            line.setAttribute('x2', node2.x)
            line.setAttribute('y2', node2.y)
            // Edge opacity is average of connected nodes
            const edgeOpacity = (node1.opacity + node2.opacity) / 2
            line.setAttribute('stroke-opacity', edgeOpacity * 0.3)
          }
        })
      }

      animationIdRef.current = requestAnimationFrame(updateNetwork)
    }

    updateNetwork()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [dimensions])

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  return (
    <div className="background-animation">
      <svg
        ref={svgRef}
        className="network-svg"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        width={dimensions.width}
        height={dimensions.height}
      >
        <g ref={edgesGroupRef} className="network-edges"></g>
        <g ref={nodesGroupRef} className="network-nodes"></g>
      </svg>
    </div>
  )
}

export default NetworkBackground
