
import { useState, useEffect } from "react";

export default function ArrayPage() {
  const [array, setarray] = useState([]);
  const [pushValue, setPushValue] = useState("");
  const [PopValue, setPopValue] = useState("");
  const [Pop_Element_Index, set_Pop_Element_Index] = useState("");
  const [Array_Element, setArray_Element] = useState("");
  const [selectedCode, setSelectedCode] = useState("cpp");

  console.log(pushValue);

  function Handleclick() {
    const newRandomArray = [];
    for (let i = 0; i < 6; i++) {
      newRandomArray.push(Math.floor(Math.random() * 101));
    }
    setarray(newRandomArray);
    console.log("Generated Array:", newRandomArray);
  }

  function HandlePush() {
    if (pushValue.trim() === "") return; // removing the whitespace
    const parsed = !isNaN(pushValue) ? Number(pushValue) : pushValue;
    setarray((prev) => [...prev, parsed]); // push the element with original and new
    setPushValue(""); // clear after push
  }

  function HandlePop() {
    if (PopValue.trim() === "") return;

    // Check if the array contains numbers or strings
    const isAllNumbers = array.every((item) => !isNaN(item));
    const valueToRemove = isAllNumbers ? Number(PopValue) : PopValue;

    const index = array.findIndex((item) => item === valueToRemove);

    if (index !== -1) {
      const newArray = [...array];
      newArray.splice(index, 1); // remove one element at index
      setarray(newArray);
      console.log("Value removed:", valueToRemove);
    } else {
      console.log("Value not found:", valueToRemove);
    }

    setPopValue(""); // clear input
  }

  function HandlePop_Element_Index() {
    if (Pop_Element_Index.trim() === "") return;

    const index = Number(Pop_Element_Index);

    if (isNaN(index) || index < 0 || index >= array.length) {
      console.log("Invalid index");
      return;
    }

    const newArray = [...array];
    newArray.splice(index, 1); // remove 1 item at index

    setarray(newArray);
    set_Pop_Element_Index(""); // clear input
  }

  function Your_Array() {
    if (Array_Element.trim() === "") return;

    const items = Array_Element.split(",").map((item) => item.trim());
    const finalArray = items.map((val) =>
      !isNaN(val) && val !== "" ? Number(val) : val
    );

    setarray(finalArray);
    setArray_Element("");
  }

  // Code snippets remain the same
  const codeSnippets = {
    cpp: `#include <iostream>
using namespace std;
int main() {
    int arr[100];
    int size = 4;
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    arr[3] = 40;
    cout << "Initial Array: ";
    for (int i = 0; i < size; i++) cout << arr[i] << " ";
    cout << endl;
    arr[size] = 50;
    size++;
    size--;
    for (int i = size; i > 2; i--) {
        arr[i] = arr[i - 1];
    }
    arr[2] = 25;
    size++;
    for (int i = 1; i < size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    size--;
    cout << "Final Array: ";
    for (int i = 0; i < size; i++) cout << arr[i] << " ";
    cout << endl;
    return 0;
}`,
    python: `arr = [10, 20, 30, 40]
print("Initial Array:", arr)
arr.append(50)
arr.pop()
arr.insert(2, 25)
arr.pop(1)
print("Final Array:", arr)`,
    java: `import java.util.*;
public class Main {
  public static void main(String[] args) {
    ArrayList<Integer> arr = new ArrayList<>(Arrays.asList(10, 20, 30, 40));
    System.out.println("Initial Array: " + arr);
    arr.add(50);
    arr.remove(arr.size() - 1);
    arr.add(2, 25);
    arr.remove(1);
    System.out.println("Final Array: " + arr);
  }
}`,
  };

  // text animation
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-base-200 text-base-content min-h-screen ">
      {/* TOP SECTION */}
      <h1
        className={`text-4xl sm:text-5xl font-extrabold text-center mb-8 transition-all duration-1000 ease-in-out transform
        ${animate ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 "}`}
      >
        <span className="text-pink-500 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">Array </span>
        <span>
          Data Structure
        </span>
        <span className="text-teal-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
          Visualizer
        </span>
      </h1>

      <div className="container mx-auto rounded-2xl bg-base-100 p-4 md:p-6 font-sans space-y-8 shadow-xl">
        {/* MAIN GRID */}
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* LEFT: Array Algorithms */}
          <div className="flex-1 flex flex-col bg-base-100 rounded-2xl shadow-lg p-6 max-h-[520px] overflow-y-auto hover:scale-[1.01] hover:shadow-xl transition-transform duration-300 font-serif">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-700 pb-2">
              ARRAY ALGORITHMS
            </h2>
            <p className="text-base-content mb-4 leading-relaxed">
              An array is a linear data structure used to store elements of the
              same type in a contiguous memory block.
            </p>
            <ul className="list-disc list-inside text-base-content text-base mb-6 space-y-2">
              <li>
                <strong>Fixed Size:</strong> Defined at creation, but dynamic in some languages.
              </li>
              <li>
                <strong>Indexing:</strong> Elements accessed directly via index <code>arr[i]</code>.
              </li>
              <li>
                <strong>Efficient Access:</strong> Random access is fast –{" "}
                <code>O(1)</code>.
              </li>
            </ul>
            <div className="text-base-content text-base space-y-3 mt-auto">
              <div>
                <h3 className="text-lg font-semibold underline mb-2 text-teal-400">
                  ⏱️ Time Complexity
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Access: <code>O(1)</code>
                  </li>
                  <li>
                    Search (Linear): <code>O(n)</code>
                  </li>
                  <li>
                    Search (Binary, Sorted): <code>O(log n)</code>
                  </li>
                  <li>
                    Insertion/Deletion (End): <code>O(1)</code> (amortized)
                  </li>
                  <li>
                    Insertion/Deletion (Middle): <code>O(n)</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CENTER: Code Execution */}
          <div className="flex-1 bg-base-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 font-mono flex flex-col">
            <h2 className="text-2xl font-bold text-teal-400 mb-6 text-center border-b border-teal-700 pb-2">
              Code Execution
            </h2>
            <div className="flex justify-center mb-6 gap-4">
              {["cpp", "python", "java"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedCode(lang)}
                  className={`btn ${selectedCode === lang
                    ? "btn-primary"
                    : "btn-outline"
                    } transition-all duration-300`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <pre className="text-sm bg-base-200 text-base-content rounded-xl p-4 shadow-inner flex-grow overflow-auto max-h-[350px]">
              <code>{codeSnippets[selectedCode]}</code>
            </pre>
          </div>

          {/* RIGHT: Array Visualization Controls */}
          <div className="flex-1 flex flex-col items-center justify-start bg-base-100 rounded-2xl shadow-lg p-6 hover:scale-[1.02] hover:shadow-2xl font-serif transition-transform duration-300">
            <h2 className="text-2xl font-bold text-pink-400 mb-6 border-b border-pink-700 pb-2 w-full text-center">
              Array Operations
            </h2>

            <div className="flex flex-col items-center space-y-6 w-full">
              {/* Generate Custom Array */}
              <div className="flex items-center w-full space-x-4">
                <input
                  className="input input-primary flex-grow"
                  placeholder="e.g., 10,20,30,40"
                  onChange={(e) => setArray_Element(e.target.value)}
                  value={Array_Element}
                />
                <button
                  className="btn btn-primary"
                  onClick={Your_Array}
                >
                  GENERATE
                </button>
              </div>

              {/* Generate Random Array */}
              <button
                onClick={Handleclick}
                className="btn btn-secondary w-full"
              >
                GENERATE RANDOM ARRAY
              </button>

              <div className="flex flex-col gap-6 w-full mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PUSH ELEMENT */}
                  <div className="flex flex-col items-center space-y-3 p-4 bg-base-200 rounded-xl shadow-md">
                    <input
                      placeholder="Element to Push"
                      className="input input-bordered w-full"
                      onChange={(e) => setPushValue(e.target.value)}
                      value={pushValue}
                    />
                    <button
                      className="btn btn-success w-full"
                      onClick={HandlePush}
                    >
                      PUSH
                    </button>
                  </div>

                  {/* POP BY VALUE */}
                  <div className="flex flex-col items-center space-y-3 p-4 bg-base-200 rounded-xl shadow-md">
                    <input
                      placeholder="Element to Pop"
                      className="input input-bordered w-full"
                      onChange={(e) => setPopValue(e.target.value)}
                      value={PopValue}
                    />
                    <button
                      className="btn btn-error w-full"
                      onClick={HandlePop}
                    >
                      POP BY VALUE
                    </button>
                  </div>
                </div>

                {/* POP BY INDEX */}
                <div className="flex flex-col items-center space-y-3 p-4 bg-base-200 rounded-xl shadow-md">
                  <input
                    placeholder="Index to Pop"
                    className="input input-bordered w-full"
                    onChange={(e) => set_Pop_Element_Index(e.target.value)}
                    value={Pop_Element_Index}
                  />
                  <button
                    className="btn btn-error w-full"
                    onClick={HandlePop_Element_Index}
                  >
                    POP BY INDEX
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM VISUALIZATION SECTION */}
        <div className="w-full bg-base-100 rounded-2xl shadow-xl p-6 text-center font-sans mt-8">
          <h2 className="text-3xl font-bold text-white mb-6 tracking-wide border-b border-gray-700 pb-3">
            Graphical Visualization
          </h2>

          <div className="flex justify-center items-end space-x-6 overflow-x-auto px-4 py-4 min-h-[100px]">
            {array.length === 0 ? (
              <p className="text-base-content/70 text-lg">Array is empty. Generate or add elements!</p>
            ) : (
              array.map((item, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center group transition duration-300 hover:scale-110"
                >
                  {/* Index Number */}
                  <span className="text-sm font-bold text-base-content/70 mb-1">{index}</span>

                  {/* Array Box */}
                  <div className="relative h-16 w-16 bg-gradient-to-br from-primary to-secondary text-primary-content font-bold text-xl flex items-center justify-center rounded-lg border-2 border-primary shadow-lg transition duration-300 transform group-hover:rotate-3 group-hover:shadow-2xl">
                    {item}
                  </div>

                  {/* Connecting Line */}
                  {index !== array.length - 1 && (
                    <div className="absolute top-1/2 left-[calc(100%+0.5rem)] -translate-y-1/2 w-6 h-[2px] bg-base-content/30 transition duration-300 group-hover:w-8 group-hover:bg-secondary"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}