import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function TreeVisualization() {
  const [searchParams] = useSearchParams();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [treeData, setTreeData] = useState({
    value: 8,
    left: { value: 3, left: null, right: null },
    right: { value: 10, left: null, right: null }
  });
  const [newNodeValue, setNewNodeValue] = useState("");
  const [removeNodeValue, setRemoveNodeValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState("Welcome to Tree Visualization!");
  const [traversalPath, setTraversalPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [treeType, setTreeType] = useState("BINARY");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const treeAlgorithms = [
    {
      name: "BINARY-TREE",
      para: "A Binary Tree is a hierarchical data structure in which each node has at most two children, referred to as the left and right child. It is the foundation for more advanced trees and supports traversal operations like inorder, preorder, and postorder.",
      complexity: {
        best: "O(log n)",
        average: "O(log n)",
        worst: "O(n)",
        space: "O(n)",
      },
      type: "Hierarchical Structure",
    },
    {
      name: "BINARY-SEARCH-TREE",
      para: "A Binary Search Tree (BST) is a binary tree where each node's left subtree contains values less than the node and the right subtree contains values greater. It enables efficient searching, insertion, and deletion in average logarithmic time.",
      complexity: {
        best: "O(log n)",
        average: "O(log n)",
        worst: "O(n)",
        space: "O(n)",
      },
      type: "Search Tree",
    },
    {
      name: "AVL",
      para: "An AVL Tree is a self-balancing Binary Search Tree where the difference between the heights of left and right subtrees is at most one for all nodes. It ensures logarithmic height, resulting in efficient operations.",
      complexity: {
        best: "O(log n)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(n)",
      },
      type: "Self-Balancing Tree",
    },
    {
      name: "HEAP",
      para: "A Heap is a special complete binary tree used to implement priority queues. In a Min-Heap, the parent is smaller than its children; in a Max-Heap, the parent is larger. It allows efficient access to the min/max element.",
      complexity: {
        best: "O(1) (peek), O(log n) (insert/delete)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(n)",
      },
      type: "Complete Binary Tree",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const algorithmName = searchParams.get("algorithm");
    if (algorithmName) {
      const algorithm = treeAlgorithms.find(
        (algo) => algo.name === algorithmName
      );
      setSelectedAlgorithm(algorithm || null);
      setTreeType(algorithmName);
      
      // Initialize different tree types with appropriate data
      if (algorithmName === "HEAP") {
        setTreeData({
          value: 9,
          left: { value: 7, left: { value: 5, left: null, right: null }, right: { value: 6, left: null, right: null } },
          right: { value: 8, left: { value: 4, left: null, right: null }, right: { value: 3, left: null, right: null } }
        });
      } else if (algorithmName === "AVL") {
        setTreeData({
          value: 10,
          left: { value: 5, left: { value: 2, left: null, right: null }, right: { value: 7, left: null, right: null } },
          right: { value: 15, left: { value: 12, left: null, right: null }, right: { value: 18, left: null, right: null } }
        });
      } else if (algorithmName === "BINARY-SEARCH-TREE") {
        setTreeData({
          value: 8,
          left: { value: 3, left: { value: 1, left: null, right: null }, right: { value: 6, left: null, right: null } },
          right: { value: 10, left: null, right: { value: 14, left: null, right: null } }
        });
      } else {
        // Default binary tree
        setTreeData({
          value: 8,
          left: { value: 3, left: null, right: null },
          right: { value: 10, left: null, right: null }
        });
      }
    }
  }, [searchParams]);

  // Calculate height for AVL balancing
  const getHeight = (node) => {
    if (!node) return 0;
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  };

  // Calculate balance factor for AVL
  const getBalanceFactor = (node) => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };

  // Validate heap property (max-heap)
  const validateHeapProperty = (node) => {
    if (!node) return true;
    
    // Check left child
    if (node.left && node.value < node.left.value) {
      return false;
    }
    
    // Check right child
    if (node.right && node.value < node.right.value) {
      return false;
    }
    
    // Recursively check children
    return validateHeapProperty(node.left) && validateHeapProperty(node.right);
  };

  // Tree operations
  const addNode = async () => {
    if (!newNodeValue.trim()) {
      setMessage("Please enter a node value");
      return;
    }
    
    const value = parseInt(newNodeValue);
    if (isNaN(value)) {
      setMessage("Please enter a valid number");
      return;
    }

    if (treeType === "HEAP") {
      setMessage(`Adding node ${value} to heap...`);
      const newTree = await insertHeapNode(treeData, value);
      setTreeData(newTree);
      setNewNodeValue("");
    } else if (treeType === "AVL") {
      setTreeData(prevTree => insertAVLNode(prevTree, value));
      setNewNodeValue("");
      setMessage(`Node ${value} added successfully to ${treeType}`);
    } else if (treeType === "BINARY-SEARCH-TREE") {
      setTreeData(prevTree => insertBSTNode(prevTree, value));
      setNewNodeValue("");
      setMessage(`Node ${value} added successfully to ${treeType}`);
    } else {
      setTreeData(prevTree => insertBinaryNode(prevTree, value));
      setNewNodeValue("");
      setMessage(`Node ${value} added successfully to ${treeType}`);
    }
  };

  // Remove node function
  const removeNode = () => {
    if (!removeNodeValue.trim()) {
      setMessage("Please enter a node value to remove");
      return;
    }
    
    const value = parseInt(removeNodeValue);
    if (isNaN(value)) {
      setMessage("Please enter a valid number");
      return;
    }

    if (treeType === "HEAP") {
      setMessage(`Removing node ${value} from heap...`);
      const newTree = extractMax(treeData);
      setTreeData(newTree);
      setRemoveNodeValue("");
      setMessage(`Node ${value} removed from heap`);
    } else if (treeType === "AVL") {
      setTreeData(prevTree => deleteAVLNode(prevTree, value));
      setRemoveNodeValue("");
      setMessage(`Node ${value} removed from ${treeType}`);
    } else if (treeType === "BINARY-SEARCH-TREE") {
      setTreeData(prevTree => deleteBSTNode(prevTree, value));
      setRemoveNodeValue("");
      setMessage(`Node ${value} removed from ${treeType}`);
    } else {
      setTreeData(prevTree => deleteBinaryNode(prevTree, value));
      setRemoveNodeValue("");
      setMessage(`Node ${value} removed from ${treeType}`);
    }
  };

  // Reset function
  const Reset = () => {
    setTreeData(null);
    setNewNodeValue("");
    setRemoveNodeValue("");
    setMessage("Tree reset successfully!");
    setTraversalPath([]);
  };

  // Binary Tree insertion (simple)
  const insertBinaryNode = (node, value) => {
    if (!node) {
      return { value, left: null, right: null };
    }
    
    // Simple insertion - find first empty spot
    if (!node.left) {
      return { ...node, left: { value, left: null, right: null } };
    } else if (!node.right) {
      return { ...node, right: { value, left: null, right: null } };
    } else {
      // Try to insert in left subtree first
      const leftResult = insertBinaryNode(node.left, value);
      if (leftResult !== node.left) {
        return { ...node, left: leftResult };
      }
      // If left is full, try right
      return { ...node, right: insertBinaryNode(node.right, value) };
    }
  };

  // BST insertion
  const insertBSTNode = (node, value) => {
    if (!node) {
      return { value, left: null, right: null };
    }

    if (value < node.value) {
      return {
        ...node,
        left: insertBSTNode(node.left, value)
      };
    } else if (value > node.value) {
      return {
        ...node,
        right: insertBSTNode(node.right, value)
      };
    }
    
    return node; // Value already exists
  };

  // AVL insertion with balancing
  const insertAVLNode = (node, value) => {
    if (!node) {
      return { value, left: null, right: null };
    }

    if (value < node.value) {
      node.left = insertAVLNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertAVLNode(node.right, value);
    } else {
      return node; // Value already exists
    }

    // Get balance factor
    const balance = getBalanceFactor(node);

    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  };

  // Heap insertion (Max-Heap) with delayed heapify
  const insertHeapNode = async (node, value) => {
    if (!node) {
      return { value, left: null, right: null };
    }

    // Check if value already exists
    if (nodeExists(node, value)) {
      return node; // Don't add duplicates
    }

    // Find the next position in level order
    const queue = [node];
    let newNode = null;
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!current.left) {
        current.left = { value, left: null, right: null };
        newNode = current.left;
        break;
      }
      if (!current.right) {
        current.right = { value, left: null, right: null };
        newNode = current.right;
        break;
      }
      
      queue.push(current.left);
      queue.push(current.right);
    }

    // Wait 3 seconds before heapifying
    setMessage(`Node ${value} added at position. Heapifying in 3 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Perform heapify up with visual feedback
    return await heapifyUpWithAnimation(node, newNode);
  };

  // Heapify up with animation for max-heap
  const heapifyUpWithAnimation = async (root, newNode) => {
    // Find path from root to new node
    const path = findPathToNode(root, newNode);
    if (!path) return root;

    setMessage("Starting heapify up process...");
    
    // Bubble up the new value to maintain max-heap property
    let current = newNode;
    for (let i = path.length - 2; i >= 0; i--) {
      const parent = path[i];
      
      // Highlight current nodes being compared
      setTraversalPath([parent.value, current.value]);
      setMessage(`Comparing ${current.value} with parent ${parent.value}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (current.value > parent.value) {
        // Swap values with animation
        setMessage(`Swapping ${current.value} and ${parent.value}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const temp = current.value;
        current.value = parent.value;
        parent.value = temp;
        
        setMessage(`Swapped! ${temp} is now at parent position.`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        current = parent;
      } else {
        setMessage(`${current.value} is smaller than ${parent.value}. No swap needed.`);
        await new Promise(resolve => setTimeout(resolve, 500));
        break;
      }
    }

    setMessage("Heapify up completed! Max-heap property maintained.");
    setTraversalPath([]);
    return root;
  };

  // Check if value already exists in tree
  const nodeExists = (node, value) => {
    if (!node) return false;
    if (node.value === value) return true;
    return nodeExists(node.left, value) || nodeExists(node.right, value);
  };

  // Heapify up for max-heap
  const heapifyUp = (root, newNode) => {
    // Find path from root to new node
    const path = findPathToNode(root, newNode);
    if (!path) return root;

    // Bubble up the new value to maintain max-heap property
    let current = newNode;
    for (let i = path.length - 2; i >= 0; i--) {
      const parent = path[i];
      if (current.value > parent.value) {
        // Swap values
        const temp = current.value;
        current.value = parent.value;
        parent.value = temp;
        current = parent;
      } else {
        break;
      }
    }

    return root;
  };

  // Find path from root to a specific node
  const findPathToNode = (root, targetNode) => {
    if (!root) return null;
    if (root === targetNode) return [root];
    
    const leftPath = findPathToNode(root.left, targetNode);
    if (leftPath) return [root, ...leftPath];
    
    const rightPath = findPathToNode(root.right, targetNode);
    if (rightPath) return [root, ...rightPath];
    
    return null;
  };

  // Extract max from heap
  const extractMax = (node) => {
    if (!node) return null;
    
    const maxValue = node.value;
    
    // Find the last node in level order
    const lastNode = findLastNode(node);
    if (lastNode === node) {
      return null; // Only one node
    }
    
    // Replace root with last node
    node.value = lastNode.value;
    
    // Remove last node
    removeLastNode(node);
    
    // Heapify down
    heapifyDown(node);
    
    return maxValue;
  };

  // Find the last node in level order
  const findLastNode = (node) => {
    if (!node) return null;
    
    const queue = [node];
    let lastNode = node;
    
    while (queue.length > 0) {
      const current = queue.shift();
      lastNode = current;
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return lastNode;
  };

  // Remove the last node
  const removeLastNode = (node) => {
    if (!node) return;
    
    const queue = [node];
    const parentQueue = [null];
    
    while (queue.length > 0) {
      const current = queue.shift();
      const parent = parentQueue.shift();
      
      if (current.left) {
        queue.push(current.left);
        parentQueue.push(current);
      }
      if (current.right) {
        queue.push(current.right);
        parentQueue.push(current);
      }
      
      // If this is the last node
      if (queue.length === 0) {
        if (parent) {
          if (parent.left === current) {
            parent.left = null;
          } else {
            parent.right = null;
          }
        }
      }
    }
  };

  // Heapify down for max-heap
  const heapifyDown = (node) => {
    if (!node) return;
    
    let largest = node;
    
    if (node.left && node.left.value > largest.value) {
      largest = node.left;
    }
    
    if (node.right && node.right.value > largest.value) {
      largest = node.right;
    }
    
    if (largest !== node) {
      // Swap values
      const temp = node.value;
      node.value = largest.value;
      largest.value = temp;
      
      // Recursively heapify down
      heapifyDown(largest);
    }
  };

  // Rotation functions for AVL
  const rightRotate = (y) => {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    return x;
  };

  const leftRotate = (x) => {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    return y;
  };

  const searchNode = async () => {
    if (!searchValue.trim()) {
      setMessage("Please enter a search value");
      return;
    }

    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setMessage("Please enter a valid number");
      return;
    }

    setIsAnimating(true);
    setTraversalPath([]);
    
    let found = false;
    if (treeType === "HEAP") {
      found = await searchHeap(treeData, value);
    } else if (treeType === "AVL" || treeType === "BINARY-SEARCH-TREE") {
      found = await searchBST(treeData, value);
    } else {
      found = await searchBinary(treeData, value);
    }
    
    if (found) {
      setMessage(`Node ${value} found in ${treeType}!`);
    } else {
      setMessage(`Node ${value} not found in ${treeType}`);
    }
    
    setIsAnimating(false);
  };

  // Binary tree search (level-order)
  const searchBinary = async (node, value) => {
    if (!node) return false;

    const queue = [node];
    const path = [];
    
    while (queue.length > 0) {
      const current = queue.shift();
      path.push(current.value);
      setTraversalPath([...path]);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (current.value === value) {
        return true;
      }

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return false;
  };

  // BST search (inorder-like)
  const searchBST = async (node, value) => {
    if (!node) return false;

    const path = [];
    const result = await searchBSTHelper(node, value, path);
    return result;
  };

  const searchBSTHelper = async (node, value, path) => {
    if (!node) return false;

    path.push(node.value);
    setTraversalPath([...path]);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (node.value === value) {
      return true;
    }

    if (value < node.value) {
      return await searchBSTHelper(node.left, value, path);
    } else {
      return await searchBSTHelper(node.right, value, path);
    }
  };

  // Heap search (level-order)
  const searchHeap = async (node, value) => {
    return await searchBinary(node, value); // Same as binary tree for heap
  };

  const randomizeTree = async () => {
    let values;
    let newTree = null;
    
    if (treeType === "HEAP") {
      values = [9, 7, 8, 5, 6, 4, 3, 2, 1];
      setMessage("Randomizing heap...");
      for (let i = 0; i < values.length; i++) {
        newTree = await insertHeapNode(newTree, values[i]);
        setTreeData(newTree);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setMessage(`${treeType} randomized successfully`);
    } else if (treeType === "AVL") {
      values = [10, 5, 15, 2, 7, 12, 18, 1, 3, 6, 8, 11, 13, 16, 19];
      values.forEach(value => {
        newTree = insertAVLNode(newTree, value);
      });
      setTreeData(newTree);
      setMessage(`${treeType} randomized successfully`);
    } else if (treeType === "BINARY-SEARCH-TREE") {
      values = [8, 3, 10, 1, 6, 14, 4, 7, 13];
      values.forEach(value => {
        newTree = insertBSTNode(newTree, value);
      });
      setTreeData(newTree);
      setMessage(`${treeType} randomized successfully`);
    } else {
      values = [8, 3, 10, 1, 6, 14, 4, 7, 13];
      values.forEach(value => {
        newTree = insertBinaryNode(newTree, value);
      });
      setTreeData(newTree);
      setMessage(`${treeType} randomized successfully`);
    }
  };

  // Binary Tree deletion
  const deleteBinaryNode = (node, value) => {
    if (!node) return null;
    
    if (node.value === value) {
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      // Find the rightmost node in the left subtree
      let temp = node.left;
      while (temp.right) {
        temp = temp.right;
      }
      node.value = temp.value;
      node.left = deleteBinaryNode(node.left, temp.value);
      return node;
    }
    
    node.left = deleteBinaryNode(node.left, value);
    node.right = deleteBinaryNode(node.right, value);
    return node;
  };

  // BST deletion
  const deleteBSTNode = (node, value) => {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = deleteBSTNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteBSTNode(node.right, value);
    } else {
      // Node to delete found
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      // Find the smallest value in the right subtree
      let temp = node.right;
      while (temp.left) {
        temp = temp.left;
      }
      node.value = temp.value;
      node.right = deleteBSTNode(node.right, temp.value);
    }
    return node;
  };

  // AVL deletion
  const deleteAVLNode = (node, value) => {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = deleteAVLNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteAVLNode(node.right, value);
    } else {
      // Node to delete found
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      // Find the smallest value in the right subtree
      let temp = node.right;
      while (temp.left) {
        temp = temp.left;
      }
      node.value = temp.value;
      node.right = deleteAVLNode(node.right, temp.value);
    }
    
    // Update height and balance
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    const balance = getBalanceFactor(node);
    
    // Left Left Case
    if (balance > 1 && getBalanceFactor(node.left) >= 0) {
      return rightRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && getBalanceFactor(node.left) < 0) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && getBalanceFactor(node.right) <= 0) {
      return leftRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && getBalanceFactor(node.right) > 0) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }
    
    return node;
  };

  const renderNode = (node, depth = 0) => {
    if (!node) return null;

    const isInPath = traversalPath.includes(node.value);
    const isCurrent = isAnimating && isInPath;

    // Adjust node size based on screen size and depth
    const nodeSize = windowSize.width < 768 ? 
      (depth > 2 ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm') : 
      (depth > 2 ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base');

    return (
      <div className="relative flex flex-col items-center animate-fadeIn">
        <div 
          className={`z-10 rounded-full shadow-lg font-bold transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-xl ${
            isCurrent 
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black scale-125 animate-pulse" 
              : isInPath 
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white animate-bounce" 
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
          } ${nodeSize}`}
          style={{
            fontFamily: "'Poppins', sans-serif",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
          }}
        >
          {node.value}
        </div>
        
        {(node.left || node.right) && (
          <div className={`flex justify-between w-full mt-4 sm:mt-6 md:mt-8 relative ${
            depth > 1 ? 'min-w-[100px]' : 'min-w-[150px]'
          } animate-slideInUp`}>
            {/* Left Child */}
            <div className="flex flex-col items-center w-1/2 animate-slideInLeft">
              {renderNode(node.left, depth + 1)}
            </div>

            {/* Right Child */}
            <div className="flex flex-col items-center w-1/2 animate-slideInRight">
              {renderNode(node.right, depth + 1)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="treeConatiner" className="mt-4 min-h-[90vh] flex flex-col lg:flex-row items-stretch justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 p-4 sm:p-6 font-sans transition-all duration-700 ease-in-out">
      {/* Tree Visualization Section - Now on top for mobile */}
      <div className={`w-full lg:w-[70%] bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl flex text-white font-bold text-xl tracking-wide justify-center pt-4 pb-8 lg:pb-4 hover:scale-[1.02] transition-all duration-500 ease-in-out mb-4 lg:mb-0 ${
        windowSize.width < 1024 ? 'order-1' : 'order-none'
      }`} 
           style={{
             background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #4f46e5 100%)",
             boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
             minHeight: windowSize.width < 768 ? '50vh' : 'auto'
           }}>
        <div className="flex flex-col items-center relative mt-4 sm:mt-10 animate-fadeIn w-full overflow-x-auto">
          {renderNode(treeData)}
        </div>
      </div>

      {/* Control Panel Section - Now below for mobile */}
      <div className={`w-full lg:w-[30%] lg:ml-8 rounded-3xl shadow-2xl flex flex-col items-center justify-start text-white text-base p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transition-all duration-500 ease-in-out hover:scale-[1.02] ${
        windowSize.width < 1024 ? 'order-2' : 'order-none'
      }`}
           style={{
             background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #4338ca 100%)",
             boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)"
           }}>
        {/* Top Description */}
        <div className="h-[40vh] sm:h-[50vh] w-full rounded-2xl bg-white/20 backdrop-blur-md p-4 sm:p-6 text-white text-sm overflow-y-auto border border-white/30 shadow-xl transition-all duration-500 ease-in-out hover:shadow-2xl hover:bg-white/25">
          <div className="w-full text-center">
            {selectedAlgorithm ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 drop-shadow-lg animate-fadeInDown"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: "700" }}>
                  {selectedAlgorithm?.name}
                </h2>

                <p className="text-xs text-gray-200 mt-2 sm:mt-4 italic leading-relaxed animate-fadeInUp"
                   style={{ fontFamily: "'Inter', sans-serif" }}>
                  {selectedAlgorithm.type} • Best:{" "}
                  <span className="text-green-300 font-semibold">{selectedAlgorithm.complexity.best}</span> • Avg:{" "}
                  <span className="text-yellow-300 font-semibold">{selectedAlgorithm.complexity.average}</span> • Worst:{" "}
                  <span className="text-red-300 font-semibold">{selectedAlgorithm.complexity.worst}</span>
                </p>
              </>
            ) : (
              <h2 className="text-lg sm:text-xl font-bold text-white animate-pulse"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                Select an Algorithm
              </h2>
            )}
          </div>
          
          {/* Enhanced Message Section */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 animate-fadeInUp">
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-blue-200 mb-1 sm:mb-2 animate-pulse"
                   style={{ fontFamily: "'Poppins', sans-serif" }}>
                Status
              </div>
              <div className="text-xs sm:text-sm text-white font-medium leading-relaxed"
                   style={{ fontFamily: "'Inter', sans-serif" }}>
                {message || "Ready to perform tree operations"}
              </div>
            </div>
            
            {traversalPath.length > 0 && (
              <div className="mt-2 sm:mt-4 p-2 sm:p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-300/30 animate-slideInUp">
                <div className="text-xs text-green-200 font-semibold mb-1"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                  Search Path:
                </div>
                <div className="text-xs text-white font-mono bg-black/20 p-2 rounded border border-white/10">
                  {traversalPath.join(" → ")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="w-full mt-4 sm:mt-6 h-auto bg-white/20 rounded-2xl shadow-xl px-3 sm:px-4 py-4 sm:py-6 backdrop-blur-md border border-white/30 transition-all duration-500 ease-in-out hover:shadow-2xl hover:bg-white/25">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {/* Add Node */}
            <div className="flex flex-col items-center gap-2 animate-fadeInUp">
              <input 
                placeholder="Add" 
                value={newNodeValue}
                onChange={(e) => setNewNodeValue(e.target.value)}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-black text-xs sm:text-sm w-full bg-white/90 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                onClick={addNode}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xs sm:text-sm uppercase shadow-lg hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:rotate-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Add
              </button>
            </div>

            {/* Remove Node */}
            <div className="flex flex-col items-center gap-2 animate-fadeInUp">
              <input 
                placeholder="Remove" 
                value={removeNodeValue}
                onChange={(e) => setRemoveNodeValue(e.target.value)}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-black text-xs sm:text-sm w-full bg-white/90 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                onClick={removeNode}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 w-full rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-xs sm:text-sm uppercase shadow-lg hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 transform hover:rotate-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Remove
              </button>
            </div>

            {/* Search Node */}
            <div className="flex flex-col items-center gap-2 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              <input 
                placeholder="Search" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-black text-xs sm:text-sm w-full bg-white/90 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                onClick={searchNode}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs sm:text-sm uppercase shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transform hover:rotate-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Search
              </button>
            </div>

            {/* Reset & Randomize */}
            <div className="flex flex-col items-center gap-2 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              <button 
                onClick={Reset}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs sm:text-sm uppercase shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transform hover:rotate-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Reset
              </button>

              <button
                onClick={randomizeTree}
                className="treebutton px-3 py-1.5 sm:px-4 sm:py-2 w-full rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold text-xs sm:text-sm uppercase shadow-lg hover:from-purple-600 hover:to-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transform hover:rotate-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Randomize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}