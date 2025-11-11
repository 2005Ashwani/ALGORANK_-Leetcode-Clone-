import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Graph_Visualization() {
  const [searchParams] = useSearchParams();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [graphData, setGraphData] = useState({});
  const [nodePositions, setNodePositions] = useState({});
  const [message, setMessage] = useState("Welcome to Graph Visualization!");
  const [traversalPath, setTraversalPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [graphType, setGraphType] = useState("BFS");
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Graph algorithm definitions
  const graphAlgorithms = [
    {
      name: "BFS",
      para: "Breadth-First Search explores all neighbor nodes at the present depth before moving deeper. Ideal for finding shortest paths in unweighted graphs.",
      complexity: { time: "O(V + E)", space: "O(V)" },
      type: "Traversal",
      color: "#3B82F6", // Blue
    },
    {
      name: "DFS",
      para: "Depth-First Search explores as far as possible along each branch before backtracking. Useful for topological sorting and cycle detection.",
      complexity: { time: "O(V + E)", space: "O(V)" },
      type: "Traversal",
      color: "#10B981", // Emerald
    },
    {
      name: "DIJKSTRA",
      para: "Dijkstra's algorithm finds shortest paths between nodes in weighted graphs with non-negative edges. Widely used in network routing.",
      complexity: { time: "O((V + E) log V)", space: "O(V)" },
      type: "Shortest Path",
      color: "#F59E0B", // Amber
    },
    {
      name: "PRIM",
      para: "Prim's algorithm finds a minimum spanning tree for weighted undirected graphs, minimizing total edge weight while connecting all nodes.",
      complexity: { time: "O((V + E) log V)", space: "O(V + E)" },
      type: "Minimum Spanning Tree",
      color: "#8B5CF6", // Violet
    },
  ];

  // Initialize graph based on selected algorithm

  useEffect(() => {
    const algorithmName = searchParams.get("algorithm");
    if (algorithmName) {
      const algorithm = graphAlgorithms.find(algo => algo.name === algorithmName);
      setSelectedAlgorithm(algorithm || null);
      setGraphType(algorithmName);

      // Initialize graph based on algorithm type
      if (algorithmName === "DIJKSTRA" || algorithmName === "PRIM") {
        // Weighted graph example
        setGraphData({
          0: [{ node: 1, weight: 4 }, { node: 2, weight: 2 }],
          1: [{ node: 0, weight: 4 }, { node: 2, weight: 5 }, { node: 3, weight: 10 }],
          2: [{ node: 0, weight: 2 }, { node: 1, weight: 5 }, { node: 3, weight: 3 }],
          3: [{ node: 1, weight: 10 }, { node: 2, weight: 3 }],
        });
        setNodePositions({
          0: { x: 250, y: 50 },
          1: { x: 100, y: 200 },
          2: { x: 400, y: 200 },
          3: { x: 250, y: 350 },
        });
      } else {
        // Unweighted graph example
        setGraphData({
          0: [1, 4],
          1: [0, 2, 3],
          2: [1, 3],
          3: [1, 2, 4],
          4: [0, 3],
        });
        setNodePositions({
          0: { x: 200, y: 100 },
          1: { x: 100, y: 300 },
          2: { x: 300, y: 300 },
          3: { x: 200, y: 500 },
          4: { x: 400, y: 200 },
        });
      }
    }
  }, [searchParams]);

  // Handle node dragging
  const handleMouseDown = (nodeId, e) => {
    setIsDragging(true);
    setDragNode(nodeId);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragNode) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    setNodePositions(prev => ({
      ...prev,
      [dragNode]: {
        x: prev[dragNode].x + dx,
        y: prev[dragNode].y + dy,
      },
    }));

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
  };

  // Graph operations
  const resetGraph = () => {
    setGraphData({});
    setNodePositions({});
    setMessage("Graph reset successfully!");
    setTraversalPath([]);
    setIsAnimating(false);
  };

  const randomizeGraph = () => {
    const newGraphData = {};
    const newNodePositions = {};
    const numNodes = Math.max(4, Math.floor(Math.random() * 4) + 4); // 4-7 nodes

    // Circular layout for better visibility
    const centerX = 250;
    const centerY = 250;
    const radius = 150;

    for (let i = 0; i < numNodes; i++) {
      newGraphData[i] = [];
      const angle = (i / numNodes) * 2 * Math.PI;
      newNodePositions[i] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    }

    // Create connections
    for (let i = 0; i < numNodes; i++) {
      const connections = Math.max(1, Math.floor(Math.random() * 3)); // 1-3 connections per node
      const connected = new Set();

      for (let j = 0; j < connections; j++) {
        let target = Math.floor(Math.random() * numNodes);
        while (target === i || connected.has(target)) {
          target = Math.floor(Math.random() * numNodes);
        }
        connected.add(target);

        if (graphType === "DIJKSTRA" || graphType === "PRIM") {
          const weight = Math.floor(Math.random() * 10) + 1;
          newGraphData[i].push({ node: target, weight });
          newGraphData[target].push({ node: i, weight }); // Undirected
        } else {
          newGraphData[i].push(target);
          newGraphData[target].push(i); // Undirected
        }
      }
    }

    setGraphData(newGraphData);
    setNodePositions(newNodePositions);
    setMessage(`Randomized ${numNodes}-node ${graphType} graph created!`);
  };

  // Graph traversal algorithms
  const searchNode = async () => {
    if (!selectedAlgorithm) {
      setMessage("Please select an algorithm first");
      return;
    }

    setIsAnimating(true);
    setTraversalPath([]);

    const startNode = parseInt(Object.keys(graphData)[0]);
    if (isNaN(startNode)) {
      setMessage("Graph is empty. Add nodes first.");
      setIsAnimating(false);
      return;
    }

    try {
      if (selectedAlgorithm.name === "BFS") {
        await bfsSearch(startNode);
      } else if (selectedAlgorithm.name === "DFS") {
        await dfsSearch(startNode);
      } else if (selectedAlgorithm.name === "DIJKSTRA") {
        await dijkstraSearch(startNode);
      } else if (selectedAlgorithm.name === "PRIM") {
        await primSearch(startNode);
      }
    } catch (error) {
      setMessage("Error during traversal: " + error.message);
    } finally {
      setIsAnimating(false);
    }
  };

  const bfsSearch = async (startNode) => {
    const visited = new Set();
    const queue = [{ node: startNode, path: [startNode] }];
    visited.add(startNode);

    while (queue.length > 0) {
      const { node, path } = queue.shift();
      setTraversalPath(path);
      setMessage(`BFS: Visiting node ${node}`);
      await delay(800);

      // Check neighbors
      for (const neighbor of graphData[node]) {
        const neighborNode = typeof neighbor === 'object' ? neighbor.node : neighbor;
        if (!visited.has(neighborNode)) {
          visited.add(neighborNode);
          queue.push({ node: neighborNode, path: [...path, neighborNode] });
          await delay(300); // Brief delay between neighbor visits
        }
      }
    }

    setMessage("BFS traversal completed!");
  };

  const dfsSearch = async (startNode) => {
    const visited = new Set();
    const stack = [{ node: startNode, path: [startNode] }];

    while (stack.length > 0) {
      const { node, path } = stack.pop();
      if (visited.has(node)) continue;
      
      visited.add(node);
      setTraversalPath(path);
      setMessage(`DFS: Visiting node ${node}`);
      await delay(800);

      // Push neighbors in reverse order for left-to-right DFS
      const neighbors = [...graphData[node]].reverse();
      for (const neighbor of neighbors) {
        const neighborNode = typeof neighbor === 'object' ? neighbor.node : neighbor;
        if (!visited.has(neighborNode)) {
          stack.push({ node: neighborNode, path: [...path, neighborNode] });
        }
      }
    }

    setMessage("DFS traversal completed!");
  };

  const dijkstraSearch = async (startNode) => {
    // Simplified visualization - highlight nodes in order of distance
    const distances = {};
    const previous = {};
    const nodes = Object.keys(graphData).map(Number);
    const visited = new Set();
    
    // Initialize distances
    nodes.forEach(node => {
      distances[node] = node === startNode ? 0 : Infinity;
    });

    while (nodes.length > 0) {
      // Sort nodes by distance
      nodes.sort((a, b) => distances[a] - distances[b]);
      const closestNode = nodes.shift();
      
      // Skip if unreachable
      if (distances[closestNode] === Infinity) break;
      
      // Visit node
      visited.add(closestNode);
      setTraversalPath(Array.from(visited));
      setMessage(`Dijkstra: Visiting node ${closestNode} (distance: ${distances[closestNode]})`);
      await delay(1000);

      // Update neighbors
      for (const edge of graphData[closestNode]) {
        const neighbor = edge.node;
        const weight = edge.weight;
        const totalDistance = distances[closestNode] + weight;
        
        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          previous[neighbor] = closestNode;
        }
      }
    }

    setMessage(`Dijkstra's algorithm completed! Shortest paths from node ${startNode}`);
  };

  const primSearch = async (startNode) => {
    // Simplified visualization - highlight edges in MST
    const visited = new Set([startNode]);
    const mstEdges = [];
    setTraversalPath([startNode]);
    setMessage(`Prim's: Starting from node ${startNode}`);
    await delay(1000);

    while (visited.size < Object.keys(graphData).length) {
      let minEdge = null;
      
      // Find minimum edge connecting visited to unvisited
      for (const node of visited) {
        for (const edge of graphData[node]) {
          const neighbor = edge.node;
          if (!visited.has(neighbor) && (!minEdge || edge.weight < minEdge.weight)) {
            minEdge = { from: node, to: neighbor, weight: edge.weight };
          }
        }
      }

      if (!minEdge) break; // Disconnected graph
      
      visited.add(minEdge.to);
      mstEdges.push(minEdge);
      
      // Highlight the new edge and node
      setTraversalPath(Array.from(visited));
      setMessage(`Prim's: Added edge ${minEdge.from}-${minEdge.to} (weight: ${minEdge.weight})`);
      await delay(1200);
    }

    setMessage(`Prim's algorithm completed! MST has ${mstEdges.length} edges`);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Render the graph visualization
  const renderGraph = () => {
    if (Object.keys(graphData).length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-base-content text-xl font-medium text-center p-6 bg-base-100/10 rounded-xl">
            Graph is empty. Click "Randomize Graph" to start!
          </div>
        </div>
      );
    }

    const nodes = Object.keys(graphData).map(Number);
    const edges = [];
    const drawnEdges = new Set();

    // Collect edges (avoid duplicates for undirected graphs)
    nodes.forEach(source => {
      graphData[source].forEach(connection => {
        const target = typeof connection === 'object' ? connection.node : connection;
        const edgeKey = `${Math.min(source, target)}-${Math.max(source, target)}`;
        
        if (!drawnEdges.has(edgeKey)) {
          edges.push({
            source,
            target,
            weight: typeof connection === 'object' ? connection.weight : null,
          });
          drawnEdges.add(edgeKey);
        }
      });
    });

    // Determine if nodes/edges are in traversal path
    const isNodeInPath = (node) => traversalPath.includes(node);
    const isEdgeInPath = (source, target) => {
      for (let i = 0; i < traversalPath.length - 1; i++) {
        if (
          (traversalPath[i] === source && traversalPath[i + 1] === target) ||
          (traversalPath[i] === target && traversalPath[i + 1] === source)
        ) {
          return true;
        }
      }
      return false;
    };

    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        className="bg-base-100/10 rounded-2xl"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const sourcePos = nodePositions[edge.source];
          const targetPos = nodePositions[edge.target];
          if (!sourcePos || !targetPos) return null;

          const inPath = isEdgeInPath(edge.source, edge.target);
          const edgeColor = inPath ? "#10B981" : "#94A3B8"; // Green if in path, gray otherwise

          return (
            <g key={`edge-${i}`}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={edgeColor}
                strokeWidth={inPath ? 3 : 2}
                strokeOpacity={inPath ? 1 : 0.7}
                className="transition-all duration-300"
              />
              {edge.weight !== null && (
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2 - 5}
                  fill="#F8FAFC"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const pos = nodePositions[node];
          if (!pos) return null;

          const inPath = isNodeInPath(node);
          const isCurrent = traversalPath[traversalPath.length - 1] === node && isAnimating;
          const algorithmColor = selectedAlgorithm?.color || "#3B82F6";
          const nodeColor = isCurrent ? "#F59E0B" : inPath ? "#10B981" : algorithmColor;

          return (
            <g 
              key={`node-${node}`}
              onMouseDown={(e) => handleMouseDown(node, e)}
              className="cursor-move transition-transform duration-300 hover:scale-110"
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrent ? 28 : 25}
                fill={nodeColor}
                stroke={isCurrent ? "#D97706" : inPath ? "#059669" : "#1D4ED8"}
                strokeWidth="2"
                className={`transition-all duration-300 ${isCurrent ? "animate-pulse" : ""}`}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                className="select-none"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200 p-4 font-sans">
      {/* Graph Visualization Section (Left/Top) */}
      <div 
        className={`w-full lg:w-[70%] rounded-3xl shadow-2xl overflow-hidden transition-all duration-500
          ${selectedAlgorithm ? `border-4 border-[${selectedAlgorithm.color}]` : 'border-4 border-gray-400'}`}
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #4F46E5 100%)",
          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
          minHeight: "60vh"
        }}
      >
        <div className="h-full w-full p-2">
          {renderGraph()}
        </div>
      </div>

      {/* Control Panel Section (Right/Bottom) */}
      <div className="w-full lg:w-[30%] lg:ml-6 mt-6 lg:mt-0 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #4338CA 100%)",
          boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)"
        }}
      >
        <div className="h-full flex flex-col">
          {/* Algorithm Info */}
          <div className="p-6 bg-base-100/10 backdrop-blur-sm border-b border-base-content/20">
            {selectedAlgorithm ? (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  {selectedAlgorithm.name}
                  <span className="ml-3 text-sm font-normal text-base-content/70">
                    {selectedAlgorithm.type}
                  </span>
                </h2>
                <p className="text-base-content/90 text-sm mb-4">
                  {selectedAlgorithm.para}
                </p>
                <div className="flex justify-between text-xs">
                  <div className="bg-base-100/20 px-3 py-1 rounded-full">
                    <span className="text-success">Time:</span> {selectedAlgorithm.complexity.time}
                  </div>
                  <div className="bg-base-100/20 px-3 py-1 rounded-full">
                    <span className="text-warning">Space:</span> {selectedAlgorithm.complexity.space}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <h2 className="text-xl font-bold text-base-content animate-pulse">
                  Select an Algorithm
                </h2>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="p-4 bg-base-100/5 border-b border-base-content/10">
            <div className="bg-base-100/20 p-3 rounded-lg">
              <h3 className="text-sm font-semibold text-primary mb-1">Status</h3>
              <p className="text-base-content text-sm">
                {message || "Ready to perform graph operations"}
              </p>
              {traversalPath.length > 0 && (
                <div className="mt-2 text-xs text-success">
                  <span className="font-mono">{traversalPath.join(" → ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-4">
              <button
                onClick={searchNode}
                disabled={isAnimating}
                className={`btn btn-success w-full ${isAnimating ? 'btn-disabled' : ''}`}
              >
                {isAnimating ? 'Running...' : 'Start Traversal'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={randomizeGraph}
                className="btn btn-warning"
              >
                Randomize
              </button>
              <button
                onClick={resetGraph}
                className="btn btn-neutral"
              >
                Reset
              </button>
            </div>

            <div className="mt-auto text-xs text-base-content/50 text-center">
              <p>Drag nodes to reposition them</p>
              <p>Click "Randomize" to generate a new graph</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}