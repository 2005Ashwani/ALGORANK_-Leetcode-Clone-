import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function TreePages() {
  const location = useLocation();
  const isVisualizationRoute = location.pathname.includes("/visualization");

  // The content
  const treeAlgorithms = [
    {
      name: "BINARY-TREE",
      para: "A Binary Tree is a hierarchical data structure in which each node has at most two children referred to as the left and right child. It forms the foundation for more advanced tree structures like BST, Heaps, and AVL Trees. Binary Trees are used in various applications like expression parsing, hierarchical data storage, and tree-based traversals.",
      complexity: {
        search: "$O(n)$",
        insert: "$O(n)$",
        delete: "$O(n)$",
        space: "$O(n)$",
      },
      type: "Hierarchical",
    },

    {
      name: "BINARY-SEARCH-TREE",
      para: "A Binary Search Tree (BST) is a binary tree in which each node's left subtree contains values less than the node, and the right subtree contains values greater than the node. BST enables efficient searching, insertion, and deletion operations when balanced. However, performance can degrade to linear time if the tree becomes unbalanced.",
      complexity: {
        search: "$O(log n)$",
        insert: "$O(log n)$",
        delete: "$O(log n)$",
        space: "$O(n)$",
      },
      type: "Search Tree",
    },

    {
      name: "AVL",
      para: "An AVL Tree is a self-balancing Binary Search Tree where the difference in heights of left and right subtrees for any node is at most one. After every insertion or deletion, the tree balances itself using rotations. This ensures logarithmic time complexity for search, insert, and delete operations.",
      complexity: {
        search: "$O(log n)$",
        insert: "$O(log n)$",
        delete: "$O(log n)$",
        space: "$O(n)$",
      },
      type: "Self-Balancing BST",
    },

    {
      name: "HEAP",
      para: "A Heap is a special complete binary tree-based data structure used to implement priority queues. In a Min Heap, the parent node is always smaller than its children, while in a Max Heap, the parent is greater. It is not suitable for fast searching but is excellent for quickly accessing the smallest or largest element.",
      complexity: {
        search: "$O(n)$",
        insert: "$O(log n)$",
        delete: "$O(log n)$",
        space: "$O(n)$",
      },
      type: "Complete Binary Tree",
    },
  ];

  // language array
  const treeAlgorithmsCode = [
    {
      name: "BINARY-TREE",
      languages: {
        C: `void inorder(struct Node* root) {
  if (root == NULL) return;
  inorder(root->left);
  printf("%d ", root->data);
  inorder(root->right);
}`,
        CPP: `void inorder(Node* root) {
  if (!root) return;
  inorder(root->left);
  cout << root->data << " ";
  inorder(root->right);
}`,
        PYTHON: `def inorder(root):
  if root:
    inorder(root.left)
    print(root.data, end=' ')
    inorder(root.right)`,
        JAVA: `void inorder(Node root) {
  if (root == null) return;
  inorder(root.left);
  System.out.print(root.data + " ");
  inorder(root.right);
}`,
      },
    },

    {
      name: "BINARY-SEARCH-TREE",
      languages: {
        C: `struct Node* insert(struct Node* node, int key) {
  if (node == NULL) return newNode(key);
  if (key < node->data)
    node->left = insert(node->left, key);
  else if (key > node->data)
    node->right = insert(node->right, key);
  return node;
}`,
        CPP: `Node* insert(Node* root, int key) {
  if (!root) return new Node(key);
  if (key < root->data)
    root->left = insert(root->left, key);
  else if (key > root->data)
    root->right = insert(root->right, key);
  return root;
}`,
        PYTHON: `def insert(root, key):
  if root is None:
    return Node(key)
  if key < root.data:
    root.left = insert(root.left, key)
  elif key > root.data:
    root.right = insert(root.right, key)
  return root`,
        JAVA: `Node insert(Node root, int key) {
  if (root == null)
    return new Node(key);
  if (key < root.data)
    root.left = insert(root.left, key);
  else if (key > root.data)
    root.right = insert(root.right, key);
  return root;
}`,
      },
    },

    {
      name: "AVL",
      languages: {
        C: `int height(struct Node* node) {
  if (node == NULL) return 0;
  return node->height;
}

// Assume rotateLeft(), rotateRight() functions exist

struct Node* insert(struct Node* node, int key) {
  if (node == NULL) return newNode(key);
  if (key < node->data)
    node->left = insert(node->left, key);
  else if (key > node->data)
    node->right = insert(node->right, key);

  updateHeight(node);
  int balance = getBalance(node);

  if (balance > 1 && key < node->left->data)
    return rotateRight(node);
  if (balance < -1 && key > node->right->data)
    return rotateLeft(node);
  if (balance > 1 && key > node->left->data) {
    node->left = rotateLeft(node->left);
    return rotateRight(node);
  }
  if (balance < -1 && key < node->right->data) {
    node->right = rotateRight(node->right);
    return rotateLeft(node);
  }
  return node;
}`,
        CPP: `int height(Node* node) {
  return node ? node->height : 0;
}

// Assume rotateLeft(), rotateRight() are implemented

Node* insert(Node* root, int key) {
  if (!root) return new Node(key);
  if (key < root->data)
    root->left = insert(root->left, key);
  else if (key > root->data)
    root->right = insert(root->right, key);

  updateHeight(root);
  int balance = getBalance(root);

  if (balance > 1 && key < root->left->data)
    return rotateRight(root);
  if (balance < -1 && key > root->right->data)
    return rotateLeft(root);
  if (balance > 1 && key > root->left->data) {
    root->left = rotateLeft(root->left);
    return rotateRight(root);
  }
  if (balance < -1 && key < root->right->data) {
    root->right = rotateRight(root->right);
    return rotateLeft(root);
  }
  return root;
}`,
        PYTHON: `def insert(node, key):
  if not node:
    return Node(key)
  if key < node.data:
    node.left = insert(node.left, key)
  elif key > node.data:
    node.right = insert(node.right, key)

  update_height(node)
  balance = get_balance(node)

  if balance > 1 and key < node.left.data:
    return rotate_right(node)
  if balance < -1 and key > node.right.data:
    return rotate_left(node)
  if balance > 1 and key > node.left.data:
    node.left = rotate_left(node.left)
    return rotate_right(node)
  if balance < -1 and key < node.right.data:
    node.right = rotate_right(node.right)
    return rotate_left(node)
  return node`,
        JAVA: `int height(Node node) {
  return node == null ? 0 : node.height;
}

// Assume rotateLeft(), rotateRight() are implemented

Node insert(Node node, int key) {
  if (node == null) return new Node(key);
  if (key < node.data)
    node.left = insert(node.left, key);
  else if (key > node.data)
    node.right = insert(node.right, key);

  updateHeight(node);
  int balance = getBalance(node);

  if (balance > 1 && key < node.left.data)
    return rotateRight(node);
  if (balance < -1 && key > node.right.data)
    return rotateLeft(node);
  if (balance > 1 && key > node.left.data) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  if (balance < -1 && key < node.right.data) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  return node;
}`,
      },
    },

    {
      name: "HEAP",
      languages: {
        C: `void insertMinHeap(int heap[], int* size, int value) {
  (*size)++;
  int i = *size - 1;
  heap[i] = value;
  while (i != 0 && heap[(i - 1) / 2] > heap[i]) {
    swap(&heap[i], &heap[(i - 1) / 2]);
    i = (i - 1) / 2;
  }
}`,
        CPP: `void insertMinHeap(vector<int>& heap, int value) {
  heap.push_back(value);
  int i = heap.size() - 1;
  while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
    swap(heap[i], heap[(i - 1) / 2]);
    i = (i - 1) / 2;
  }
}`,
        PYTHON: `def insert_min_heap(heap, value):
  heap.append(value)
  i = len(heap) - 1
  while i > 0 and heap[(i - 1) // 2] > heap[i]:
    heap[i], heap[(i - 1) // 2] = heap[(i - 1) // 2], heap[i]
    i = (i - 1) // 2`,
        JAVA: `void insertMinHeap(ArrayList<Integer> heap, int value) {
  heap.add(value);
  int i = heap.size() - 1;
  while (i > 0 && heap.get((i - 1) / 2) > heap.get(i)) {
    Collections.swap(heap, i, (i - 1) / 2);
    i = (i - 1) / 2;
  }
}`,
      },
    },
  ];

  const [content, setContent] = useState(treeAlgorithms[0]);
  const [language, setLanguage] = useState("C");

  const [code, setCode] = useState(
    treeAlgorithmsCode.find((algo) => algo.name === "BINARY-TREE").languages.C
  );

  // handle content
  function HandleContentAdder(name) {
    console.log(name);
    const result = treeAlgorithms.find((algo) => algo.name === name);

    if (result) {
      setContent(result);
      console.log(content);
    } else {
      console.log("NO CONTENT IS FOUND");
    }
  }

  // handle language
  function HandleCodeAdder(lang) {
    console.log(lang);
    setLanguage(lang);
    const code = treeAlgorithmsCode.find((algo) => algo.name === content.name);

    console.log(code);

    if (code) {
      setCode(code.languages[lang]);
      console.log(code.languages[lang]);
    } else {
      console.log("NO CODE IS FOUND");
    }
  }

  // if any change in contant
  useEffect(() => {
    const codeObj = treeAlgorithmsCode.find(
      (algo) => algo.name === content.name
    );
    if (codeObj) {
      setCode(codeObj.languages[language]);
    }
  }, [content, language]);
  // tree animation
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isVisualizationRoute ? (
        <Outlet content={content} />
      ) : (
        <>
          {/* TOP SECTION */}
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
                Tree
              </span>
              <span>Data Structure</span>
              <span className="text-teal-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
                Visualizer
              </span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8 px-4">
            {/* Left - Sorting Algorithms */}
            <div className="lg:w-1/4 p-4 bg-base-100 rounded-xl shadow-lg border border-base-content/20 animate-slideInLeft transition-all duration-500 ease-in-out">
              <h3 className="text-lg font-semibold text-base-content mb-4 border-b pb-2 border-base-content/20">
                Algorithms
              </h3>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => HandleContentAdder("BINARY-TREE")}
                >
                  BINARY TREE
                </button>

                <button
                  className="btn btn-success btn-sm"
                  onClick={() => HandleContentAdder("BINARY-SEARCH-TREE")}
                >
                  BINARY SEARCH TREE
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => HandleContentAdder("AVL")}
                >
                  AVL TREE
                </button>
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => HandleContentAdder("HEAP")}
                >
                  HEAP TREE
                </button>
              </div>

              {/* content display  */}
              <div className="text-xs mt-3 bg-base-200 rounded-xl p-2 shadow-inner overflow-auto font-mono text-base-content border border-base-content/20">
                <div className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 border border-base-content/20 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                    {content.name}
                  </h3>
                  <p className="text-base-content/70 text-sm sm:text-base">
                    {content.para}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                    COMPLEXITY
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                    <li>Best Case : {content.complexity.search}</li>
                    <li>Average Case : {content.complexity.insert}</li>
                    <li>Worst Case : {content.complexity.delete}</li>
                    <li>Space complexity : {content.complexity.space}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Center - Code Display & Language Selection */}
            <div className="flex-grow flex flex-col gap-6">
              {/* Language Selection */}
              <div className="flex flex-wrap gap-4 p-4 bg-base-100 rounded-xl shadow-xl border border-base-content/20 justify-center animate-fadeIn transition-all duration-500 ease-in-out">
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
                  className="btn btn-warning btn-sm"
                  onClick={() => HandleCodeAdder("PYTHON")}
                >
                  PYTHON
                </button>

                <button
                  className="btn btn-info btn-sm"
                  onClick={() => HandleCodeAdder("JAVA")}
                >
                  JAVA
                </button>
              </div>

              {/* Code display */}
              <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-xl shadow-xl overflow-auto font-mono text-xs sm:text-sm relative border border-gray-700 animate-fadeInUp flex-grow min-h-[300px]">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="block w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="block w-3 h-3 bg-green-500 rounded-full"></span>
                </div>

                <pre className="mt-4">
                  <code className="language-javascript">{`${code}`}</code>
                </pre>
              </div>
            </div>

            {/* Right - Operations */}
            <div className="lg:w-1/4">
              <div className="p-4 sm:p-6 bg-base-100 rounded-xl shadow-lg border border-base-content/20 h-full flex flex-col justify-between text-center animate-slideInRight">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-4">
                    Operations
                  </h3>
                  <p className="text-base-content/70 text-sm sm:text-base mb-4">
                    Watch the searching process unfold step by step!
                  </p>

                  <div
                    className="bg-base-200 p-4 rounded-lg border border-base-content/20 min-h-[150px] flex flex-col justify-center items-center text-base-content text-sm sm:text-base overflow-y-auto custom-scrollbar"
                    id="operations-display"
                  >
                    <p
                      className="text-center text-primary font-semibold"
                      id="operation-status"
                    >
                      Click "Start Visualization" to begin searching.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link to={`visualization?algorithm=${content.name}`}>
                    <button className="btn btn-success w-full">
                      Start Visualization
                    </button>
                  </Link>

                  <button id="reset-array-btn" className="mt-3 btn btn-error w-full">
                    Reset Array
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
