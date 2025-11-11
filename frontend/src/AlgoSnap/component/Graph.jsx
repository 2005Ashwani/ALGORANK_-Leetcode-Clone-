import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Define graphAlgorithms and graphAlgorithmsCode outside the component
// so they are available immediately when the component initializes its state.
const graphAlgorithms = [
  {
    name: "BFS",
    para: "Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key') and explores all of the neighbor nodes at the present depth before moving on to the nodes at the next depth level. BFS is often used to find the shortest path in an unweighted graph.",
    complexity: {
      time: "O(V + E)", // V: vertices, E: edges
      space: "O(V)",
    },
    type: "Traversal",
  },
  {
    name: "DFS",
    para: "Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root (or some arbitrary node) and explores as far as possible along each branch before backtracking. DFS is commonly used for topological sorting, cycle detection, and finding connected components in a graph.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
    },
    type: "Traversal",
  },
  {
    name: "DIJKSTRA",
    para: "Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks. It is widely used in network routing protocols. This algorithm works for graphs with non-negative edge weights.",
    complexity: {
      time: "O((V + E) log V)", // With a binary heap
      space: "O(V)",
    },
    type: "Shortest Path",
  },
  {
    name: "PRIM",
    para: "Prim's algorithm is a greedy algorithm that finds a minimum spanning tree (MST) for a weighted undirected graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.",
    complexity: {
      time: "O((V + E) log V)", // With a binary heap
      space: "O(V + E)",
    },
    type: "Minimum Spanning Tree",
  },
];

const graphAlgorithmsCode = [
  {
    name: "BFS",
    languages: {
      C: `void BFS(int graph[][V], int startNode) {
  int visited[V] = {0};
  int queue[V];
  int front = -1, rear = -1;

  queue[++rear] = startNode;
  visited[startNode] = 1;

  while (front != rear) {
    int currentNode = queue[++front];
    printf("%d ", currentNode);

    for (int i = 0; i < V; i++) {
      if (graph[currentNode][i] == 1 && visited[i] == 0) {
        queue[++rear] = i;
        visited[i] = 1;
      }
    }
  }
}`,
      CPP: `void BFS(vector<vector<int>>& adj, int startNode) {
  vector<bool> visited(adj.size(), false);
  queue<int> q;

  q.push(startNode);
  visited[startNode] = true;

  while (!q.empty()) {
    int u = q.front();
    q.pop();
    cout << u << " ";

    for (int v : adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
      }
    }
  }
}`,
      PYTHON: `from collections import deque

def bfs(graph, start_node):
  visited = set()
  queue = deque([start_node])
  visited.add(start_node)

  while queue:
    current_node = queue.popleft()
    print(current_node, end=' ')

    for neighbor in graph[current_node]:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.append(neighbor)`,
      JAVA: `void BFS(ArrayList<ArrayList<Integer>> adj, int startNode) {
  boolean[] visited = new boolean[adj.size()];
  Queue<Integer> q = new LinkedList<>();

  q.add(startNode);
  visited[startNode] = true;

  while (!q.isEmpty()) {
    int u = q.poll();
    System.out.print(u + " ");

    for (int v : adj.get(u)) {
      if (!visited[v]) {
        visited[v] = true;
        q.add(v);
      }
    }
  }
}`,
    },
  },
  {
    name: "DFS",
    languages: {
      C: `void DFS(int graph[][V], int startNode, int* visited) {
  visited[startNode] = 1;
  printf("%d ", startNode);

  for (int i = 0; i < V; i++) {
    if (graph[startNode][i] == 1 && visited[i] == 0) {
      DFS(graph, i, visited);
    }
  }
}`,
      CPP: `void DFS(vector<vector<int>>& adj, int u, vector<bool>& visited) {
  visited[u] = true;
  cout << u << " ";

  for (int v : adj[u]) {
    if (!visited[v]) {
      DFS(adj, v, visited);
    }
  }
}`,
      PYTHON: `def dfs(graph, start_node, visited=None):
  if visited is None:
    visited = set()
  visited.add(start_node)
  print(start_node, end=' ')

  for neighbor in graph[start_node]:
    if neighbor not in visited:
      dfs(graph, neighbor, visited)`,
      JAVA: `void DFS(ArrayList<ArrayList<Integer>> adj, int u, boolean[] visited) {
  visited[u] = true;
  System.out.print(u + " ");

  for (int v : adj.get(u)) {
    if (!visited[v]) {
      DFS(adj, v, visited);
    }
  }
}`,
    },
  },
  {
    name: "DIJKSTRA",
    languages: {
      C: `void dijkstra(int graph[][V], int startNode) {
  int dist[V];
  int visited[V] = {0};

  for (int i = 0; i < V; i++) {
    dist[i] = INT_MAX;
  }
  dist[startNode] = 0;

  for (int count = 0; count < V - 1; count++) {
    int u = minDistance(dist, visited); // Helper to find min dist vertex
    visited[u] = 1;

    for (int v = 0; v < V; v++) {
      if (!visited[v] && graph[u][v] && dist[u] != INT_MAX &&
          dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  // Print shortest distances
}`,
      CPP: `void dijkstra(vector<vector<pair<int, int>>>& adj, int startNode) {
  priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
  vector<int> dist(adj.size(), INT_MAX);

  dist[startNode] = 0;
  pq.push({0, startNode});

  while (!pq.empty()) {
    int d = pq.top().first;
    int u = pq.top().second;
    pq.pop();

    if (d > dist[u]) continue;

    for (auto& edge : adj[u]) {
      int v = edge.first;
      int weight = edge.second;
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push({dist[v], v});
      }
    }
  }
  // Print shortest distances
}`,
      PYTHON: `import heapq

def dijkstra(graph, start_node):
  distances = {node: float('inf') for node in graph}
  distances[start_node] = 0
  priority_queue = [(0, start_node)] # (distance, node)

  while priority_queue:
    current_distance, current_node = heapq.heappop(priority_queue)

    if current_distance > distances[current_node]:
      continue

    for neighbor, weight in graph[current_node].items():
      distance = current_distance + weight
      if distance < distances[neighbor]:
        distances[neighbor] = distance
        heapq.heappush(priority_queue, (distance, neighbor))
  return distances`,
      JAVA: `void dijkstra(ArrayList<ArrayList<Pair>> adj, int startNode) {
  PriorityQueue<Pair> pq = new PriorityQueue<>((a, b) -> a.weight - b.weight);
  int[] dist = new int[adj.size()];
  Arrays.fill(dist, Integer.MAX_VALUE);

  dist[startNode] = 0;
  pq.add(new Pair(startNode, 0));

  while (!pq.isEmpty()) {
    Pair current = pq.poll();
    int u = current.node;
    int d = current.weight;

    if (d > dist[u]) continue;

    for (Pair neighbor : adj.get(u)) {
      int v = neighbor.node;
      int weight = neighbor.weight;
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.add(new Pair(v, dist[v]));
      }
    }
  }
  // Print shortest distances
}`,
    },
  },
  {
    name: "PRIM",
    languages: {
      C: `void prim(int graph[][V]) {
  int parent[V];
  int key[V];
  int mstSet[V] = {0};

  for (int i = 0; i < V; i++) {
    key[i] = INT_MAX;
  }
  key[0] = 0;
  parent[0] = -1;

  for (int count = 0; count < V - 1; count++) {
    int u = minKey(key, mstSet); // Helper to find min key vertex
    mstSet[u] = 1;

    for (int v = 0; v < V; v++) {
      if (graph[u][v] && mstSet[v] == 0 && graph[u][v] < key[v]) {
        parent[v] = u;
        key[v] = graph[u][v];
      }
    }
  }
  // Print MST
}`,
      CPP: `void prim(vector<vector<pair<int, int>>>& adj) {
  priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
  vector<int> key(adj.size(), INT_MAX);
  vector<int> parent(adj.size(), -1);
  vector<bool> inMST(adj.size(), false);

  key[0] = 0;
  pq.push({0, 0}); // (weight, vertex)

  while (!pq.empty()) {
    int u = pq.top().second;
    pq.pop();

    if (inMST[u]) continue;
    inMST[u] = true;

    for (auto& edge : adj[u]) {
      int v = edge.first;
      int weight = edge.second;
      if (!inMST[v] && weight < key[v]) {
        key[v] = weight;
        parent[v] = u;
        pq.push({key[v], v});
      }
    }
  }
  // Print MST
}`,
      PYTHON: `import heapq

def prim(graph):
  min_cost = {node: float('inf') for node in graph}
  min_cost[list(graph.keys())[0]] = 0 # Start from first node
  mst_set = {node: False for node in graph}
  parent = {node: None for node in graph}
  
  pq = [(0, list(graph.keys())[0])] # (cost, node)

  while pq:
    cost, u = heapq.heappop(pq)
    
    if mst_set[u]:
      continue
    mst_set[u] = True

    for v, weight in graph[u].items():
      if not mst_set[v] and weight < min_cost[v]:
        min_cost[v] = weight
        parent[v] = u
        heapq.heappush(pq, (weight, v))
  return parent`,
      JAVA: `void prim(ArrayList<ArrayList<Pair>> adj) {
  PriorityQueue<Pair> pq = new PriorityQueue<>((a, b) -> a.weight - b.weight);
  int[] key = new int[adj.size()];
  int[] parent = new int[adj.size()];
  boolean[] inMST = new boolean[adj.size()];

  Arrays.fill(key, Integer.MAX_VALUE);
  Arrays.fill(parent, -1);

  key[0] = 0; // Start from vertex 0
  pq.add(new Pair(0, 0)); // (vertex, key_value)

  while (!pq.isEmpty()) {
    int u = pq.poll().node;

    if (inMST[u]) continue;
    inMST[u] = true;

    for (Pair neighbor : adj.get(u)) {
      int v = neighbor.node;
      int weight = neighbor.weight;
      if (!inMST[v] && weight < key[v]) {
        key[v] = weight;
        parent[v] = u;
        pq.add(new Pair(v, key[v]));
      }
    }
  }
  // Print MST
}`,
    },
  },
];

export default function GraphPages() {
  const location = useLocation();
  // Check if the current route includes visualization for nested route
  const isVisualizationRoute = location.pathname.includes("/visualization");

  // State to manage the currently displayed algorithm's content and code
  const [content, setContent] = useState(graphAlgorithms[0]);
  const [language, setLanguage] = useState("C");

  const [code, setCode] = useState(
    graphAlgorithmsCode.find((algo) => algo.name === "BFS").languages.C
  );

  // Function to handle changing the displayed algorithm content
  function HandleContentAdder(name) {
    const result = graphAlgorithms.find((algo) => algo.name === name);
    if (result) {
      setContent(result);
    } else {
      console.log("No content found for this algorithm.");
    }
  }

  // Function to handle changing the displayed code language
  function HandleCodeAdder(lang) {
    setLanguage(lang);
    const codeObj = graphAlgorithmsCode.find(
      (algo) => algo.name === content.name
    );
    if (codeObj) {
      setCode(codeObj.languages[lang]);
    } else {
      console.log("No code found for this algorithm in the selected language.");
    }
  }

  // Effect hook to update code when content or language changes
  useEffect(() => {
    const codeObj = graphAlgorithmsCode.find(
      (algo) => algo.name === content.name
    );
    if (codeObj) {
      setCode(codeObj.languages[language]);
    }
  }, [content, language]);

  // Graphanimation
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-8 font-inter">
      {/* Conditional rendering based on whether it's a visualization route */}
      {/* The Outlet is crucial here for nested routes */}
      {isVisualizationRoute ? (
        <Outlet context={{ content }} /> // Pass content via context for visualization
      ) : (
        <>
          {/* TOP SECTION - Title */}
          <div className="text-center pb-8">
            <h1
              className={`text-4xl sm:text-5xl font-extrabold text-center mb-5 transition-all duration-1000 ease-in-out transform
        ${
          animate
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-90"
        }`}
            >
              <span className="text-purple-600 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
                Graph
              </span>
              <span>Data Structure</span>
              <span className="text-teal-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
                Visualizer
              </span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8 max-w-7xl mx-auto">
            {/* Left - Graph Algorithms Selection & Description */}
            <div className="lg:w-1/3 p-4 bg-base-100 rounded-xl shadow-lg border border-base-content/20 animate-slideInLeft transition-all duration-500 ease-in-out flex flex-col">
              <h3 className="text-lg font-semibold text-base-content mb-4 border-b pb-2 border-base-content/10">
                Algorithms
              </h3>

              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => HandleContentAdder("BFS")}
                >
                  BFS
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => HandleContentAdder("DFS")}
                >
                  DFS
                </button>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => HandleContentAdder("DIJKSTRA")}
                >
                  DIJKSTRA
                </button>
                <button
                  className="btn btn-neutral btn-sm"
                  onClick={() => HandleContentAdder("PRIM")}
                >
                  PRIM
                </button>
              </div>

              {/* Content Display */}
              <div className="flex-grow text-xs bg-base-200 rounded-xl p-2 shadow-inner overflow-auto font-mono text-base-content border border-base-content/20">
                <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-content/20 space-y-4 h-full">
                  <h3 className="text-2xl font-bold text-base-content">
                    {content.name}
                  </h3>
                  <p className="text-base-content">{content.para}</p>
                  <h3 className="text-2xl font-bold text-base-content">
                    COMPLEXITY
                  </h3>
                  <ul>
                    <li>Time Complexity: {content.complexity.time}</li>
                    <li>Space Complexity: {content.complexity.space}</li>
                  </ul>
                  <p className="text-base-content/70 text-sm mt-2">
                    Type: {content.type}
                  </p>
                </div>
              </div>
            </div>

            {/* Center - Code Display & Language Selection */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 flex-grow">
              {/* Language Selection */}
              <div className="flex flex-wrap justify-center gap-4 p-4 bg-base-100 rounded-xl shadow-xl border border-base-content/20 animate-fadeIn transition-all duration-500 ease-in-out">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => HandleCodeAdder("C")}
                >
                  C
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => HandleCodeAdder("CPP")}
                >
                  C++
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => HandleCodeAdder("PYTHON")}
                >
                  PYTHON
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => HandleCodeAdder("JAVA")}
                >
                  JAVA
                </button>
              </div>

              {/* Code Display */}
              <div className="bg-base-100 text-base-content p-4 sm:p-6 rounded-xl shadow-xl overflow-auto font-mono text-sm relative border border-base-content/20 animate-fadeInUp flex-grow max-h-[400px] h-auto">
                {/* Window Control Dots */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="block w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="block w-3 h-3 bg-green-500 rounded-full"></span>
                </div>

                {/* Code Content */}
                <pre className="mt-6 whitespace-pre-wrap break-words">
                  <code className="language-javascript">{`${code}`}</code>
                </pre>
              </div>
            </div>

            {/* Right - Operations */}
            <div className="lg:w-1/4 flex-none">
              <div className="p-6 bg-base-100 rounded-xl shadow-lg border border-base-content/20 h-full flex flex-col justify-between text-center animate-slideInRight">
                <div>
                  <h3 className="text-2xl font-bold text-base-content mb-4">
                    Operations
                  </h3>
                  <p className="text-base-content/70 text-lg mb-4">
                    Watch the graph algorithm process unfold step by step!
                  </p>

                  <div
                    className="bg-base-200 p-4 rounded-lg border border-base-content/20 min-h-[150px] flex flex-col justify-center items-center text-base-content text-base overflow-y-auto custom-scrollbar"
                    id="operations-display"
                  >
                    <p
                      className="text-center text-primary font-semibold"
                      id="operation-status"
                    >
                      Click "Start Visualization" to begin.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 ">
                  <Link to={`visualization?algorithm=${content.name}`}>
                    <button className="btn btn-success w-full">
                      Start Visualization
                    </button>
                  </Link>

                  <button id="reset-array-btn" className="mt-4 btn btn-error w-full">
                    Reset Graph
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
