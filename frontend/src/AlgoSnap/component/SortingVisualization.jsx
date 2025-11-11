import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function SortingVisualization() {
  const [searchParams] = useSearchParams();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  // State for array and custom input
  const [array, setArray] = useState([30, 88, 221, 5, 20, 15]);
  const [customInput, setCustomInput] = useState("");
  const [CompareIndex, setCompareIndex] = useState([]); //To store all compared index pairs
  const [swappedIndices, setSwappedIndices] = useState([]); // To store all swap index pairs
  const [sorted, setSorted] = useState([]); // to store sorted pairs

  const [speed, setSpeed] = useState(1); // default value 1 to change the speed
  const stopSortingRef = useRef(false); // to reset the array again

  const pauseRef = useRef(false); // its pause directly when its click
  const [isPaused, setIsPaused] = useState(false); // its take some time or execute at last

  
// const historyRef = useRef([]);   // Backword

  const sortingAlgorithms = [
    {
      name: "BUBBLE",
      para: "Bubble Sort is a simple comparison-based sorting algorithm...",
      complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      type: "Comparison-based",
    },
    {
      name: "SELECTION",
      para: "Selection Sort works by repeatedly selecting the minimum...",
      complexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      type: "Comparison-based",
    },
    {
      name: "INSERTION",
      para: "Insertion Sort builds the final sorted array one element at a time...",
      complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      type: "Comparison-based",
    },
    {
      name: "MERGE",
      para: "Merge Sort is a divide-and-conquer algorithm...",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
      },
      type: "Divide and Conquer",
    },
    {
      name: "QUICK",
      para: "Quick Sort is a fast, divide-and-conquer algorithm...",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)",
      },
      type: "Divide and Conquer",
    },
    {
      name: "HEAP",
      para: "Heap Sort uses a binary heap data structure...",
      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(1)",
      },
      type: "Heap-based",
    },
  ];
 

  useEffect(() => {
    const algorithmName = searchParams.get("algorithm");
    if (algorithmName) {
      const algorithm = sortingAlgorithms.find(
        (algo) => algo.name === algorithmName
      );
      setSelectedAlgorithm(algorithm);
    }
  }, [searchParams]);

  // add your own array
  const handleInputChange = (e, index) => {
    const newArray = [...array];
    newArray[index] = Number(e.target.value);
    setArray(newArray);
  };

  // custom input
  const handleApplyInput = () => {
    const parsed = customInput
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    setArray(parsed);

    setSorted([])
  };

  // Sorting
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Sorting Algorithm with visualization
async function Sorting_Algo() {
  const arr = [...array];
  const n = arr.length;
  setSorted([]);
  // Backward
  // historyRef.current = [[...arr]]; // Reset history
  // console.log(historyRef.current)


               // BUBBLE
  if (selectedAlgorithm.name==="BUBBLE") {
     for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    if (stopSortingRef.current) return;

    await sleep(1010 - speed * 10);

    for (let j = 0; j < n - 1 - i; j++) {
      if (stopSortingRef.current) return;
      while (pauseRef.current) await sleep(100);

      setCompareIndex([j, j + 1]);
      await sleep(1010 - speed * 10);

      if (arr[j] > arr[j + 1]) {
        setSwappedIndices([j, j + 1]);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;



        // backward

        // historyRef.current.push([...arr]); // Record snapshot
// console.log(historyRef.current)

        setArray([...arr]);
        await sleep(1010 - speed * 10);
      }

      setCompareIndex([]);
      setSwappedIndices([]);
    }

    setSorted((prev) => [...prev, n - 1 - i]);

    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k++) {
        setSorted((prev) => [...prev, k]);
      }
      break;
    }
  }

  setSorted((prev) => [...prev, 0]);
  }

   if (selectedAlgorithm.name === "SELECTION") {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    if (stopSortingRef.current) return;

    let minIdx = i;
    setCompareIndex([i]);
    await sleep(1010 - speed * 10);

    for (let j = i + 1; j < n; j++) {
      if (stopSortingRef.current) return;
      while (pauseRef.current) await sleep(100);

      setCompareIndex([minIdx, j]);
      await sleep(1010 - speed * 10);

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      setSwappedIndices([i, minIdx]);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      // Optional: Record snapshot for step-back
      // historyRef.current.push([...arr]);

      setArray([...arr]);
      await sleep(1010 - speed * 10);
    }

    setCompareIndex([]);
    setSwappedIndices([]);
    setSorted((prev) => [...prev, i]);
  }

  setSorted((prev) => [...prev, n - 1]); // Last element is also sorted
}

if (selectedAlgorithm.name === "INSERTION") {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    if (stopSortingRef.current) return;
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      if (stopSortingRef.current) return;
      while (pauseRef.current) await sleep(100);

      setCompareIndex([j, j + 1]);
      await sleep(1010 - speed * 10);

      arr[j + 1] = arr[j];
      setArray([...arr]);
      j--;

      await sleep(1010 - speed * 10);
    }

    arr[j + 1] = key;

    setSwappedIndices([j + 1, i]);
    setArray([...arr]);
    await sleep(1010 - speed * 10);

    setCompareIndex([]);
    setSwappedIndices([]);
    setSorted((prev) => [...prev, i]);
  }

  setSorted((prev) => [...new Set([...prev, 0])]);
}




// Merge

if (selectedAlgorithm.name === "MERGE") {
  async function mergeSort(arr, l, r) {
    if (l >= r || stopSortingRef.current) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  }

  async function merge(arr, l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      if (stopSortingRef.current) return;
      while (pauseRef.current) await sleep(100);

      setCompareIndex([k]);
      await sleep(1010 - speed * 10);

      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }

      setArray([...arr]);
      await sleep(1010 - speed * 10);
    }

    while (i < left.length) {
      arr[k++] = left[i++];
      setArray([...arr]);
      await sleep(1010 - speed * 10);
    }

    while (j < right.length) {
      arr[k++] = right[j++];
      setArray([...arr]);
      await sleep(1010 - speed * 10);
    }

    setCompareIndex([]);
    setSorted((prev) => [...prev, ...Array.from({ length: r - l + 1 }, (_, i) => l + i)]);
  }

  await mergeSort(arr, 0, arr.length - 1);
}



// QUICK SORT
if (selectedAlgorithm.name === "QUICK") {
  async function quickSort(arr, low, high) {
    if (low < high) {
      if (stopSortingRef.current) return;

      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    } else if (low === high) {
      setSorted((prev) => [...prev, low]);
    }
  }

  async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    setCompareIndex([high]);

    for (let j = low; j < high; j++) {
      if (stopSortingRef.current) return;
      while (pauseRef.current) await sleep(100);

      setCompareIndex([j, high]);
      await sleep(1010 - speed * 10);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setSwappedIndices([i, j]);
        setArray([...arr]);
        await sleep(1010 - speed * 10);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setSwappedIndices([i + 1, high]);
    setArray([...arr]);
    await sleep(1010 - speed * 10);

    setCompareIndex([]);
    setSwappedIndices([]);
    setSorted((prev) => [...prev, i + 1]);

    return i + 1;
  }

  await quickSort(arr, 0, arr.length - 1);
}



// HEAP SORT
if (selectedAlgorithm.name === "HEAP") {
  async function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      setSwappedIndices([i, largest]);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(1010 - speed * 10);
      await heapify(arr, n, largest);
    }
  }

  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (stopSortingRef.current) return;
    while (pauseRef.current) await sleep(100);
    await heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    if (stopSortingRef.current) return;
    while (pauseRef.current) await sleep(100);

    setSwappedIndices([0, i]);
    [arr[0], arr[i]] = [arr[i], arr[0]];
    setArray([...arr]);
    setSorted((prev) => [...prev, i]);
    await sleep(1010 - speed * 10);
    await heapify(arr, i, 0);
  }

  setSorted((prev) => [...prev, 0]);
}
 
}


  // Reset
  function HandleReset() {
    stopSortingRef.current = true; // Tell the sorting function to stop

    setArray([30, 88, 221, 5, 20, 15]);
    setSorted([]);
    setCompareIndex([]);
    setSwappedIndices([]);
  }

  // Pause
  function HandlePause() {
    pauseRef.current = !pauseRef.current; // initially false hai or agar click kar raha hai to ulta ho ja raha  hai true ka false OR True ka false
    setIsPaused(pauseRef.current);
    console.log("Pause");
    console.log(pauseRef.current);
  }

//   // Step Backward
// function HandleBackward() {
//   if (historyRef.current.length > 1) {
//     historyRef.current.pop(); // Remove current
//     const prevState = historyRef.current[historyRef.current.length - 1];
//     console.log(prevState)
//     setArray([...prevState]);
//   }
// }


//   useEffect(() => {
//     console.log("CompareIndex changed:", CompareIndex);
//   }, [CompareIndex]);

//   useEffect(() => {
//     console.log("SwappedIndices updated:", swappedIndices);
//   }, [swappedIndices]);

//   function Sorting_Algo() {
//     const arr = [...array];

//     const matchedAlgo = sortingAlgorithms_tech.find(
//       (algo) => algo.name === selectedAlgorithm?.name
//     );

//     if (matchedAlgo) {
//       const sortFunction = new Function("arr", matchedAlgo.sort);
//       const sorted = sortFunction(arr);
//       setArray(sorted);
//       console.log("Sorted Array:", sorted);
//     } else {
//       console.log("Algorithm not found");
//     }
//   }

//   useEffect(() => {
//     console.log("Sorted updated:", sorted);
//   }, [sorted]);

  return (
    <div className="bg-base-100 p-4 md:p-6 font-display space-y-8 transition-all duration-500 ease-in-out">
      <h1 className="flex justify-center text-4xl font-extrabold text-base-content animate-fadeInDown tracking-wide drop-shadow-lg">
        SORTING VISUALIZATION
      </h1>

      <div className="flex flex-col items-center justify-start overflow-hidden bg-base-200 text-base-content p-2 sm:p-10 font-sans">
        {/* Visualization Container */}
        <div className="bg-base-100 rounded-3xl shadow-2xl p-4 w-full max-w-6xl border-2 border-base-content/20 relative z-10">
          <div className="absolute inset-0 bg-base-content opacity-5 rounded-3xl animate-pulse-slow"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 relative z-10">
            <h2 className="text-3xl font-extrabold text-base-content drop-shadow-lg">
              Sorting Visualization
            </h2>
            <div className="text-right">
              {selectedAlgorithm ? (
                <>
                  <h2 className="text-xl font-bold text-base-content">
                    {selectedAlgorithm.name} SORT
                  </h2>
                  <p className="text-xs text-base-content/70 mt-1">
                    {selectedAlgorithm.type} • Best:{" "}
                    {selectedAlgorithm.complexity.best} • Avg:{" "}
                    {selectedAlgorithm.complexity.average} • Worst:{" "}
                    {selectedAlgorithm.complexity.worst}
                  </p>
                </>
              ) : (
                <h2 className="text-lg font-bold text-base-content">
                  Select an Algorithm
                </h2>
              )}
            </div>
          </div>

          {/* Visualization Box */}
          <div className="h-28 sm:h-36 bg-base-200 rounded-xl flex items-center justify-center border border-base-content/20 shadow-inner overflow-hidden relative z-10">
            <div className="flex gap-5 text-base-content/70 text-base sm:text-lg italic">
              {array.map((val, index) => (
                <div
                  key={index}
                  className="text-2xl text-base-content flex flex-col items-center"
                >
                  <span className="text-sm text-base-content/80">{index}</span>
                  <input
                    type="text"
                    className={`${
                      swappedIndices.includes(index)
                        ? "bg-red-500"
                        : CompareIndex.includes(index)
                        ? "bg-yellow-500"
                        : sorted.includes(index)
                        ? "bg-green-500"
                        : "bg-blue-400"
                    } px-2 py-1 rounded text-black text-center w-16`}
                    value={val}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-3">
            <div className="grid grid-cols-3 gap-x-3 text-xs font-medium">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1 shadow-md"></span>
                <span className="text-base-content">COMPARED</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-1 shadow-md"></span>
                <span className="text-base-content">SWAPPED</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-1 shadow-md"></span>
                <span className="text-base-content">SORTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mt-4 bg-base-100 rounded-3xl shadow-2xl p-4 w-full max-w-6xl border-2 border-base-content/20 relative z-10">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={Sorting_Algo}
            >
              PLAY
            </button>
            <button
              className={`btn ${isPaused ? "btn-error" : "btn-primary"} btn-sm`}
              onClick={HandlePause}
            >
              {isPaused ? " RESUME" : " PAUSE"}
            </button>

            <button className="btn btn-primary btn-sm"

            // onClick={HandleBackward}
            >
              STEP BACK
            </button>

            <button className="btn btn-primary btn-sm">
              STEP FORWARD
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={HandleReset}
            >
              RESET
            </button>

            {/* Speed Slider */}
            <div className="flex items-center bg-base-200 rounded-full py-1 px-3 shadow-md">
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-28 h-2 bg-base-content rounded-lg appearance-none cursor-pointer accent-base-content"
              />
            </div>
          </div>

          {/* Custom Array Input */}
          <div className="bg-base-200 rounded-xl p-4 mb-2 shadow-inner border border-base-content/20">
            <h2 className="text-lg font-bold text-base-content mb-2 text-center">
              CUSTOM ARRAY
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
              <input
                type="text"
                placeholder="e.g., 5,2,8,1"
                className="w-full sm:w-auto flex-grow p-2 rounded-lg bg-base-100 border border-base-content/20 text-base-content text-sm placeholder-base-content/50"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
              <button
                className="btn btn-warning btn-sm"
                onClick={handleApplyInput}
              >
                APPLY
              </button>
            </div>
          </div>

          {/* Race Mode */}
          <div className="flex items-center justify-center bg-base-200 rounded-xl p-2 shadow-inner border border-base-content/20">
            <input
              type="checkbox"
              id="race-mode"
              className="checkbox checkbox-primary"
            />
            <label
              htmlFor="race-mode"
              className="ml-2 text-sm font-bold text-base-content"
            >
              ENABLE RACE MODE{" "}
              <span className="text-base-content/70 text-xs">
                (Compare Algorithms)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
