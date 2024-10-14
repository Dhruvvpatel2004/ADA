const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let nodes = [];
let edges = [];
let selectedNode = null;  // To store the selected node for adding edges

// Add node on canvas click
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if user clicked on an existing node
    const clickedNode = getNodeAt(x, y);
    
    if (!clickedNode) {
        // Add a new node if no existing node was clicked
        nodes.push({ x, y });
    } else {
        if (selectedNode && selectedNode !== clickedNode) {
            // If a node was already selected, add an edge between the two nodes
            edges.push({ start: selectedNode, end: clickedNode });
            selectedNode = null;  // Reset the selected node after adding edge
        } else {
            // Select the node for adding edges
            selectedNode = clickedNode;
        }
    }
    
    drawGraph();
});

// Helper function to check if the click was on an existing node
function getNodeAt(x, y) {
    return nodes.find(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        return Math.sqrt(dx * dy + dy * dy) < 10;  // Node radius is 10px
    });
}

// Draw the graph with nodes and edges
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    edges.forEach(edge => {
        const { start, end } = edge;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.stroke();
    });
}

// Check Hamiltonian cycle button
document.getElementById('checkCycle').addEventListener('click', () => {
    if (nodes.length === 0) {
        alert("Please add nodes to the graph.");
        return;
    }
    
    let graphMatrix = createAdjacencyMatrix();
    console.log(graphMatrix);  // Debug: Log the matrix
    
    fetch('/check-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graph: graphMatrix })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else if (data.hamiltonian_cycle) {
            alert('Hamiltonian cycle exists!');
        } else {
            alert('No Hamiltonian cycle found.');
        }
    });
});

// Convert graph to adjacency matrix
function createAdjacencyMatrix() {
    const matrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
    edges.forEach(edge => {
        const startIndex = nodes.indexOf(edge.start);
        const endIndex = nodes.indexOf(edge.end);
        matrix[startIndex][endIndex] = 1;
        matrix[endIndex][startIndex] = 1;
    });
    return matrix;
}

drawGraph();
