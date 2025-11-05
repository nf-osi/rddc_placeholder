// Network graph animation with highly connected nodes
document.addEventListener('DOMContentLoaded', function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Skip animation for users who prefer reduced motion
    }

    const svg = document.querySelector('.network-svg');
    const edgesGroup = document.querySelector('.network-edges');
    const nodesGroup = document.querySelector('.network-nodes');
    
    if (!svg || !edgesGroup || !nodesGroup) return;

    // Get viewport dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Set SVG viewBox and dimensions to match viewport
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    // Number of nodes (more nodes = more connections)
    const numNodes = 30;
    const nodes = [];
    let edgeConnections = []; // Store edge connections for efficient updates
    
    // Generate nodes with random positions
    function generateNodes() {
        nodes.length = 0;
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                id: i,
                vx: (Math.random() - 0.5) * 0.3, // velocity x
                vy: (Math.random() - 0.5) * 0.3  // velocity y
            });
        }
    }
    
    // Create highly connected network (each node connects to multiple nearby nodes)
    function createNetwork() {
        // Clear existing
        edgesGroup.innerHTML = '';
        nodesGroup.innerHTML = '';
        edgeConnections = [];
        
        // Create edges - connect each node to its nearest neighbors
        const maxConnections = 6; // Each node connects to up to 6 nearest neighbors for high connectivity
        const connections = new Set();
        const maxDistance = Math.min(width, height) * 0.4; // Connect within 40% of viewport
        
        nodes.forEach((node, i) => {
            // Find distances to all other nodes
            const distances = nodes.map((other, j) => ({
                node: other,
                index: j,
                distance: Math.sqrt(
                    Math.pow(node.x - other.x, 2) + 
                    Math.pow(node.y - other.y, 2)
                )
            }))
            .filter(d => d.index !== i && d.distance <= maxDistance)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, maxConnections);
            
            // Create edges to nearest neighbors
            distances.forEach(({ node: other, index: j }) => {
                const edgeId = i < j ? `${i}-${j}` : `${j}-${i}`;
                if (!connections.has(edgeId)) {
                    connections.add(edgeId);
                    
                    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    edge.setAttribute('class', 'network-edge');
                    edge.setAttribute('x1', node.x);
                    edge.setAttribute('y1', node.y);
                    edge.setAttribute('x2', other.x);
                    edge.setAttribute('y2', other.y);
                    edgesGroup.appendChild(edge);
                    
                    // Store connection for efficient updates
                    edgeConnections.push({ node1: i, node2: j });
                }
            });
        });
        
        // Create nodes
        nodes.forEach((node, i) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'network-node');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', 8); // Larger radius for visibility
            circle.setAttribute('style', `--node-index: ${i}`);
            nodesGroup.appendChild(circle);
        });
    }
    
    // Update network positions with subtle movement
    let frameCount = 0;
    function updateNetwork() {
        frameCount++;
        
        // Update node positions with gentle drift
        nodes.forEach(node => {
            // Bounce off edges
            if (node.x <= 0 || node.x >= width) node.vx *= -1;
            if (node.y <= 0 || node.y >= height) node.vy *= -1;
            
            // Keep nodes in bounds
            node.x = Math.max(0, Math.min(width, node.x + node.vx));
            node.y = Math.max(0, Math.min(height, node.y + node.vy));
            
            // Add slight random drift
            node.vx += (Math.random() - 0.5) * 0.02;
            node.vy += (Math.random() - 0.5) * 0.02;
            
            // Dampen velocity
            node.vx *= 0.98;
            node.vy *= 0.98;
        });
        
        // Update node positions in SVG
        const nodeElements = nodesGroup.querySelectorAll('circle');
        nodeElements.forEach((circle, i) => {
            if (nodes[i]) {
                circle.setAttribute('cx', nodes[i].x);
                circle.setAttribute('cy', nodes[i].y);
            }
        });
        
        // Recreate network connections every 30 frames for smooth animation
        if (frameCount % 30 === 0) {
            createNetwork();
        } else {
            // Just update existing edge positions
            const edgeElements = edgesGroup.querySelectorAll('line');
            edgeConnections.forEach((edge, index) => {
                if (index < edgeElements.length && edge.node1 !== undefined && edge.node2 !== undefined) {
                    const line = edgeElements[index];
                    line.setAttribute('x1', nodes[edge.node1].x);
                    line.setAttribute('y1', nodes[edge.node1].y);
                    line.setAttribute('x2', nodes[edge.node2].x);
                    line.setAttribute('y2', nodes[edge.node2].y);
                }
            });
        }
        
        requestAnimationFrame(updateNetwork);
    }
    
    // Initialize
    generateNodes();
    createNetwork();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            
            // Scale existing positions
            const scaleX = newWidth / width;
            const scaleY = newHeight / height;
            nodes.forEach(node => {
                node.x *= scaleX;
                node.y *= scaleY;
                // Keep in bounds
                node.x = Math.max(0, Math.min(newWidth, node.x));
                node.y = Math.max(0, Math.min(newHeight, node.y));
            });
            
            width = newWidth;
            height = newHeight;
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            
            createNetwork();
        }, 250);
    });
    
    // Start animation loop
    updateNetwork();
});
