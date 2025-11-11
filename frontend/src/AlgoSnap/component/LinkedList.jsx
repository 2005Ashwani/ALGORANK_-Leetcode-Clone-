import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function LinkedListPage() {
  const [selectedCode, setSelectedCode] = useState("cpp");
  const [array_Element, setArray_Element] = useState([]);
  const [Add_array_Element_start, set_Add_Array_Element_start] = useState("");
  const [Add_array_Element_end, set_Add_Array_Element_end] = useState("");
  const [Add_array_Element_index, set_Add_Array_Element_index] = useState("");
  const [Add_array_Element_index_value, set_Add_Array_Element_index_value] =
    useState("");
  const [Delete_Search_Node_Index, set_Delete_Search_Node_Index] = useState("");
  const [Delete_position, set_Delete_position] = useState("");
  const [animate, setAnimate] = useState(false);

  // send the message
  const [codeAlertMessage, setCodeAlertMessage] = useState("");

  // Change in UI
  const [clickedButton, setClickedButton] = useState(null);
  const [color, setcolor] = useState(null);

  const codeSnippets = {
    cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

void printList(Node* head) {
    while (head != nullptr) {
        cout << head->data << " ";
        head = head->next;
    }
    cout << endl;
}

int main() {
    // Initial List: 10 -> 20 -> 30 -> 40
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    head->next->next->next = new Node(40);

    cout << "Initial List: ";
    printList(head);

    // Insert 25 at position 2 (0-based)
    Node* temp = head;
    for (int i = 0; i < 1; i++) temp = temp->next;
    Node* newNode = new Node(25);
    newNode->next = temp->next;
    temp->next = newNode;

    // Delete node at position 1
    temp = head;
    Node* toDelete = temp->next;
    temp->next = toDelete->next;
    delete toDelete;

    cout << "Final List: ";
    printList(head);
    return 0;
}`,

    python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def print_list(head):
    curr = head
    while curr:
        print(curr.data, end=" ")
        curr = curr.next
    print()

# Initial List: 10 -> 20 -> 30 -> 40
head = Node(10)
head.next = Node(20)
head.next.next = Node(30)
head.next.next.next = Node(40)

print("Initial List:", end=" ")
print_list(head)

# Insert 25 at position 2 (0-based)
temp = head
for _ in range(1):
    temp = temp.next
new_node = Node(25)
new_node.next = temp.next
temp.next = new_node

# Delete node at position 1
temp = head
temp.next = temp.next.next

print("Final List:", end=" ")
print_list(head)`,

    java: `class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public class Main {
    public static void printList(Node head) {
        while (head != null) {
            System.out.print(head.data + " ");
            head = head.next;
        }
        System.out.println();
    }

    public static void main(String[] args) {
        // Initial List: 10 -> 20 -> 30 -> 40
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        head.next.next.next = new Node(40);

        System.out.print("Initial List: ");
        printList(head);

        // Insert 25 at position 2
        Node temp = head;
        for (int i = 0; i < 1; i++) temp = temp.next;
        Node newNode = new Node(25);
        newNode.next = temp.next;
        temp.next = newNode;

        // Delete node at position 1
        temp = head;
        temp.next = temp.next.next;

        System.out.print("Final List: ");
        printList(head);
    }
}`,
  };

  // Generate color
  function getRandomColor() {
    const tailwindColors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-pink-400",
      "bg-purple-400",
      "bg-indigo-400",
      "bg-orange-400",
      "bg-teal-400",
      "bg-lime-400",
    ];
    const randomIndex = Math.floor(Math.random() * tailwindColors.length);
    return tailwindColors[randomIndex];
  }

  // Insert at start
  function handleInsertStart() {
    if (Add_array_Element_start.trim() !== "") {
      setArray_Element([Add_array_Element_start.trim(), ...array_Element]);
      set_Add_Array_Element_start("");
      setClickedButton("start");
      setCodeAlertMessage(
        `${Add_array_Element_start.trim()} is added at start`
      );

      // Generate color
      setcolor(getRandomColor());
      console.log(color);

      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("Insert the element at start");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Insert at end
  function handleInsertEnd() {
    if (Add_array_Element_end.trim() !== "") {
      setArray_Element([...array_Element, Add_array_Element_end]);
      set_Add_Array_Element_end("");

      setClickedButton("end");
      setCodeAlertMessage(`${Add_array_Element_end} added at the end`);
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("Insert element to be added at End");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Insert at index
  function handleInsertIndex() {
    if (
      Add_array_Element_index.trim() &&
      Add_array_Element_index_value.trim() !== ""
    ) {
      const newArray = [...array_Element];
      newArray.splice(
        Add_array_Element_index,
        0,
        Add_array_Element_index_value
      );
      setArray_Element(newArray);

      setCodeAlertMessage(
        `${Add_array_Element_index_value} added at Position : ${Add_array_Element_index}`
      );
      setClickedButton("position");
      setTimeout(() => setClickedButton(null), 3000);
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("Please Insert Index and Value");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Delete Element at start
  function handleDeleteStart() {
    if (array_Element.length !== 0) {
      const newArray = [...array_Element];
      newArray.shift();
      setArray_Element(newArray);
      setClickedButton("delete_start");
      setCodeAlertMessage("Element is deleted at Starting");

      setTimeout(() => {
        setClickedButton("");
        setCodeAlertMessage("");
      }, 3000);
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("No Node is to Delete at Start");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  //delete the element at end
  function handleDeleteEnd() {
    if (array_Element.length !== 0) {
      const newArray = [...array_Element];
      newArray.pop();
      setArray_Element(newArray);

      setClickedButton("delete_end");
      setCodeAlertMessage("Element is deleted at end");

      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("Nothing is to be delete at end");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Reset the array
  function handleReset() {
    if (array_Element.length !== 0) {
      setArray_Element([]);

      setClickedButton("reset");
      setCodeAlertMessage("Reset Node");

      setTimeout(() => {
        setClickedButton("");
        setCodeAlertMessage("");
      }, 3000);
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("No Node Available for Reset");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Search Node by Index
  function searchNodeIndex() {
    if (Delete_Search_Node_Index.trim() !== "") {
      const targetIndex = Number(Delete_Search_Node_Index);
      if (targetIndex >= 0 && targetIndex < array_Element.length) {
        setCodeAlertMessage(
          `Node at index ${targetIndex} is ${array_Element[targetIndex]}`
        );
        setClickedButton("delete_position");
        setTimeout(() => {
          setCodeAlertMessage(null);
          setClickedButton(null);
        }, 3000);
      } else {
        setCodeAlertMessage("Invalid index");
        setClickedButton("delete_position");
        setTimeout(() => {
          setCodeAlertMessage(null);
          setClickedButton(null);
        }, 3000);
      }
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("Nothing have to delete");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Delete Node by Index
  function deleteNodeIndex() {
    if (Delete_position.trim() !== "") {
      const newArray = [...array_Element];
      const targetIndex = Number(Delete_position);

      if (targetIndex >= 0 && targetIndex < newArray.length) {
        newArray.splice(targetIndex, 1);
        setArray_Element(newArray);
        setCodeAlertMessage(`${targetIndex} is deleted`);
        setClickedButton("delete_node");
        setTimeout(() => {
          setCodeAlertMessage("");
          setClickedButton(null);
        }, 3000);
      } else {
        setCodeAlertMessage("Invalid index");
        setClickedButton("delete_node");
        setTimeout(() => {
          setCodeAlertMessage("");
          setClickedButton(null);
        }, 3000);
      }
    } else {
      setClickedButton("start"); // This is to toggle
      setCodeAlertMessage("Insert Delete index");
      setTimeout(() => {
        setClickedButton(null);
        setCodeAlertMessage("");
      }, 3000);
    }
  }

  // Handle Random Linked List
  function handleRandomLinkedList() {
    const length = 5;
    const min = 1;
    const max = 100;

    const arr = Array.from(
      { length },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );

    setArray_Element(arr);
    setClickedButton("random");
    setCodeAlertMessage("Random Nodes Added");

    setTimeout(() => {
      setClickedButton("");
      setCodeAlertMessage("");
    }, 3000);
  }

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1
        className={`text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-4 px-4 transition-all duration-1000 ease-in-out transform
          ${
            animate
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-90"
          }`}
      >
        <span className="text-pink-500 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
          Linked List
        </span>
        <span > Data Structure </span>
          <span className="text-teal-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
          Visualizer
        </span>
      </h1>

      <div className=" min-h-screen bg-base-200  font-display p-4 space-y-4 transition-all duration-300 rounded-2xl">
        {/* TOP SECTION */}

        <div>
          {/* MAIN CONTENT AREA: LEFT, CENTER, RIGHT BOXES */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* LEFT: Linked List ALGORITHMS */}
            <div className="flex-1 flex flex-col bg-base-100 rounded-2xl shadow-xl p-4 overflow-y-auto transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl font-body text-sm md:text-base">
              <h2 className="text-xl md:text-2xl font-bold text-base-content mb-3 text-center pb-1 border-b-2 border-base-content/20">
                LINKED LIST ALGORITHMS
              </h2>
              <p className="text-base-content mb-3 leading-relaxed">
                A **Linked List** is a linear data structure where elements
                (called **nodes**) are connected using pointers.
              </p>
              <ul className="list-disc list-inside text-base-content/70 mb-3 space-y-0.5">
                <li>**Data:** The actual value stored.</li>
                <li>**Next:** A reference (pointer) to the next node.</li>
              </ul>
              <div className="text-base-content space-y-2">
                <div>
                  <h3 className="text-base font-semibold underline mb-1">
                    Types of Linked Lists
                  </h3>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Singly Linked List</li>
                    <li>Doubly Linked List</li>
                    <li>Circular Linked List</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-base font-semibold mt-2">
                    Basic Operations
                  </h3>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Insert</li>
                    <li>Delete</li>
                    <li>Search</li>
                    <li>Traverse</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CENTER: Code Execution */}
            <div className="flex-1 bg-base-200 p-4 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl font-code text-sm">
              <h2 className="text-xl md:text-2xl font-bold text-base-content mb-3 text-center pb-1 border-b-2 border-base-content/20">
                CODE EXECUTION
              </h2>
              <div className="flex justify-center mb-3 gap-2 animate-fadeIn">
                {["cpp", "python", "java"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedCode(lang)}
                    className={`btn ${
                      selectedCode === lang
                        ? "btn-primary"
                        : "btn-outline btn-primary"
                    } px-4 py-2 rounded-full font-bold uppercase tracking-wide transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary text-xs`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <pre className="text-xs sm:text-sm bg-base-100 rounded-xl p-2 shadow-inner max-h-40 overflow-auto font-mono text-base-content border border-base-content/20">
                <code>{codeSnippets[selectedCode]}</code>
              </pre>
              <h2 className="text-xl font-bold text-base-content mb-2 mt-3 text-center pb-1 border-b-2 border-base-content/20">
                CODE ALERT
              </h2>
              <div
                className={`
                ${
                  clickedButton === "start" ||
                  clickedButton === "end" ||
                  clickedButton === "position" ||
                  clickedButton === "delete_position" ||
                  clickedButton === "delete_node" ||
                  clickedButton === "delete_end" ||
                  clickedButton === "delete_start" ||
                  clickedButton === "reset" ||
                  clickedButton === "random"
                    ? "font-extrabold text-error text-lg scale-105"
                    : "text-sm bg-base-100 rounded-xl p-4 shadow-lg border border-base-content/20 transition-all duration-300"
                }
            `}
              >
                <p
                  className={`transition-all duration-300 ease-in-out text-center tracking-wide
    ${
      clickedButton === "start" ||
      clickedButton === "end" ||
      clickedButton === "position" ||
      clickedButton === "delete_position" ||
      clickedButton === "delete_node" ||
      clickedButton === "delete_end" ||
      clickedButton === "delete_start" ||
      clickedButton === "reset" ||
      clickedButton === "random"
        ? "font-extrabold text-error text-base sm:text-lg scale-105"
        : "font-semibold text-base-content text-sm sm:text-base"
    }
  `}
                >
                  {codeAlertMessage ||
                    "This section displays important messages or outputs."}
                </p>
              </div>
            </div>

            {/* RIGHT: Linked List Operations - REFINED */}
            <div className="flex-1 flex flex-col items-center p-4 bg-base-100 rounded-3xl shadow-xl font-body transition-all duration-500 ease-in-out hover:scale-[1.01] hover:shadow-2xl text-sm md:text-base">
              <h2 className="text-xl md:text-2xl font-bold text-base-content mb-4 pb-1 border-b-2 border-base-content/20 w-full text-center">
                LINKED LIST OPERATIONS
              </h2>

              {/* INSERT OPERATIONS */}
              <div className="w-full mb-6 space-y-4">
                <h3 className="text-center text-lg font-semibold text-base-content">
                  INSERT OPERATIONS
                </h3>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {/* Insert at Start */}
                  <div className="flex flex-col items-center w-full md:w-1/3 space-y-2">
                    <input
                      type="text"
                      placeholder="Insert At Start"
                      className="w-full px-3 py-2 rounded-lg shadow-inner border border-base-content/20 focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content font-semibold text-sm"
                      onChange={(e) =>
                        set_Add_Array_Element_start(e.target.value)
                      }
                      value={Add_array_Element_start}
                    />
                    <button
                      className="btn btn-primary w-full text-sm"
                      onClick={handleInsertStart}
                    >
                      Start
                    </button>
                  </div>

                  {/* Insert at End */}
                  <div className="flex flex-col items-center w-full md:w-1/3 space-y-2">
                    <input
                      type="text"
                      placeholder="Insert At End"
                      className="w-full px-3 py-2 rounded-lg shadow-inner border border-base-content/20 focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content font-semibold text-sm"
                      onChange={(e) =>
                        set_Add_Array_Element_end(e.target.value)
                      }
                      value={Add_array_Element_end}
                    />
                    <button
                      className="btn btn-primary w-full text-sm"
                      onClick={handleInsertEnd}
                    >
                      End
                    </button>
                  </div>

                  {/* Insert at Index */}
                  <div className="flex flex-col items-center w-full md:w-1/3 space-y-2">
                    <div className="flex gap-2 w-full">
                      <input
                        type="number"
                        placeholder="Index"
                        className="w-1/2 px-3 py-2 rounded-lg shadow-inner border border-base-content/20 focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content font-semibold text-sm"
                        onChange={(e) =>
                          set_Add_Array_Element_index(e.target.value)
                        }
                        value={Add_array_Element_index}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        className="w-1/2 px-3 py-2 rounded-lg shadow-inner border border-base-content/20 focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content font-semibold text-sm"
                        onChange={(e) =>
                          set_Add_Array_Element_index_value(e.target.value)
                        }
                        value={Add_array_Element_index_value}
                      />
                    </div>
                    <button
                      className="btn btn-primary w-full text-sm"
                      onClick={handleInsertIndex}
                    >
                      Insert at Position
                    </button>
                  </div>
                </div>
              </div>

              {/* DELETE AND SEARCH */}
              <div className="w-full mb-6 space-y-4">
                <h3 className="text-center text-lg font-semibold text-base-content">
                  DELETE & SEARCH
                </h3>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {/* Search by Index */}
                  <div className="flex flex-col items-center w-full md:w-1/2 space-y-2">
                    <input
                      type="number"
                      placeholder="Search Index"
                      className="w-full px-3 py-2 rounded-lg shadow-inner border border-base-content/20 focus:outline-none focus:ring-2 focus:ring-secondary bg-base-100 text-base-content font-semibold text-sm"
                      onChange={(e) =>
                        set_Delete_Search_Node_Index(e.target.value)
                      }
                      value={Delete_Search_Node_Index}
                    />
                    <button
                      className="btn btn-secondary w-full text-sm"
                      onClick={searchNodeIndex}
                    >
                      Search Node
                    </button>
                  </div>

                  {/* Delete by Index */}
                  <div className="flex flex-col items-center w-full md:w-1/2 space-y-2">
                    <input
                      type="number"
                      placeholder="Delete At Index"
                      className="w-full px-3 py-2 rounded-lg shadow-inner border border-base-content/20 focus:outline-none focus:ring-2 focus:ring-error bg-base-100 text-base-content font-semibold text-sm"
                      onChange={(e) => set_Delete_position(e.target.value)}
                      value={Delete_position}
                    />
                    <button
                      className="btn btn-error w-full text-sm"
                      onClick={deleteNodeIndex}
                    >
                      Delete Node
                    </button>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="w-full space-y-2">
                <h3 className="text-center text-lg font-semibold text-base-content">
                  QUICK ACTIONS
                </h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <button
                    className="btn btn-error text-xs sm:px-4"
                    onClick={handleDeleteStart}
                  >
                    Delete Start
                  </button>
                  <button
                    className="btn btn-primary text-xs sm:px-4"
                    onClick={handleDeleteEnd}
                  >
                    Delete End
                  </button>
                  <button
                    className="btn btn-neutral text-xs sm:px-4"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    className="btn btn-secondary text-xs sm:px-4"
                    onClick={handleRandomLinkedList}
                  >
                    Random Linked List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM VISUALIZATION SECTION */}
          <div className="w-full bg-base-100 rounded-2xl shadow-xl p-4 text-center font-sans">
            {" "}
            <h2 className="text-xl md:text-2xl font-bold text-base-content mb-4 tracking-wide pb-1 border-b-2 border-base-content/20">
              GRAPHICAL VISUALIZATION
            </h2>
            {/* Representation */}
            <div className="flex gap-2 items-center justify-start md:justify-center p-2 min-h-[100px] overflow-x-auto">
              {" "}
              {array_Element.length === 0 && (
                <p className="text-base text-primary font-semibold animate-pulse">
                  List is empty. Add elements to visualize!
                </p>
              )}
              {array_Element.map((item, index) => (
                // Changed fragment to a div with a key
                <div
                  key={`node-arrow-pair-${index}`}
                  className="flex items-center"
                >
                  {/* Node */}
                  <div className="flex flex-col items-center animate-fadeInNode">
                    <span className="text-xs font-bold text-base-content/70 mb-0.5">
                      IDX: {index}
                    </span>
                    <div className="flex border-2 border-primary rounded-md overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                      <div
                        className={`flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 p-1 text-white font-bold text-sm sm:text-base border-r-2 border-primary ${
                          clickedButton === "start" && index === 0
                            ? color
                            : "bg-primary"
                        }`}
                      >
                        {item}
                      </div>

                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 p-1 bg-base-100 text-base-content text-xs font-semibold">
                        {" "}
                        NEXT
                      </div>
                    </div>
                  </div>
                  {/* Arrow between nodes */}
                  {index < array_Element.length - 1 && (
                    <div className="flex items-center justify-center mx-1">
                      {" "}
                      <svg
                        className="w-6 h-3 sm:w-8 sm:h-4 text-primary animate-pulse-arrow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {/* NULL box at the end if there are elements */}
              {array_Element.length > 0 && (
                <div key="null-node-pair" className="flex items-center">
                  {" "}
                  <div className="flex items-center justify-center mx-1">
                    <svg
                      className="w-6 h-3 sm:w-8 sm:h-4 text-primary animate-pulse-arrow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center animate-fadeInNode">
                    <span className="text-xs font-bold text-base-content/70 mb-0.5">
                      END
                    </span>
                    <div className="flex border-2 border-error rounded-md overflow-hidden shadow-md">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 p-1 bg-error text-white font-bold text-sm sm:text-base">
                        {" "}
                        NULL
                      </div>
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 p-1 bg-base-100 text-base-content text-xs font-semibold">
                        {" "}
                        X
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
