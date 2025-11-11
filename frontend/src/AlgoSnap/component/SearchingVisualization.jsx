import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchingVisualization() {
  const [searchParams] = useSearchParams();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  const [array, setArray] = useState([30, 88, 221, 5, 20, 15]);
  const [customInput, setCustomInput] = useState("");

  const [speed, setSpeed] = useState(1);
  const [target, setTarget] = useState();
  const [presentbg, setpresentbg] = useState([]);

  const [traversed, setTravesed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [Complete, setcomplete] = useState(null);

  const ResetRef = useRef(false);
  const [traversedRight, SettraversedRight] = useState([]);

  const searchingAlgorithms = [
    {
      name: "LINEAR",
      para: "Linear Search is the most basic searching technique...",
      complexity: {
        best: "O(1)",
        average: "O(n)",
        worst: "O(n)",
        space: "O(1)",
      },
      type: "Brute-force",
    },
    {
      name: "BINARY",
      para: "Binary Search is an efficient searching algorithm...",
      complexity: {
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)",
      },
      type: "Divide and Conquer",
    },
  ];

  useEffect(() => {
    const algorithmName = searchParams.get("algorithm");
    if (algorithmName) {
      const algorithm = searchingAlgorithms.find(
        (algo) => algo.name === algorithmName
      );
      setSelectedAlgorithm(algorithm);
    }
  }, [searchParams]);

  const handleInputChange = (e, index) => {
    const newArray = [...array];
    newArray[index] = Number(e.target.value);
    setArray(newArray);
  };

  const handleApplyInput = () => {
    const parsed = customInput
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    setArray(parsed);
  };

  // Sorting
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function Search_Algo() {
    ResetRef.current = false;
    // stopSortingRef.current = false;
    let found = false;

    if (target == null) {
      return;
    }

    if (selectedAlgorithm.name === "LINEAR") {
      const arr = [...array];

      for (let i = 0; i < arr.length; i++) {
        if (ResetRef.current === true) return;

        setCurrentIndex(i); // this triggers movement

        if (arr[i] === Number(target)) {
          setpresentbg([i]);
          setcomplete([i]);
          await sleep(300);
          // Element found
          found = true;
          break;
        } else {
          setpresentbg([i]);
          // to Set the speed
          await sleep(1010 - speed * 10);
        }

        // seting the color of travesed element
        setTravesed((prev) => [...prev, i]);
      }

      if (!found) {
        // Element not found
      }
    }

 if (selectedAlgorithm.name === "BINARY") {
  const arr = [...array];

  if (target == null) {
    return;
  }

  let left = 0;
  let right = arr.length - 1;
  let found = false;

  while (left <= right) {
    if (ResetRef.current === true) return;

    const mid = Math.floor((left + right) / 2);

    setCurrentIndex(mid);
    setpresentbg([mid]);

    await sleep(1010 - speed * 10);

    if (arr[mid] === Number(target)) {
      setcomplete([mid]);
      found = true;
      break;
    } else if (arr[mid] < Number(target)) {
      // Discarding left to mid (inclusive)
      SettraversedRight((prev) => [
        ...new Set([
          ...prev,
          ...Array.from({ length: mid + 1 }, (_, idx) => idx),
        ]),
      ]);

      left = mid + 1;
    } else {
      // Discarding mid to right (inclusive)
      setTravesed((prev) => [
        ...new Set([
          ...prev,
          ...Array.from({ length: right - mid - 1 }, (_, idx) => idx - mid),
        ]),
      ]);

      right = mid - 1;
    }

    await sleep(1010 - speed * 10);
  }

  if (!found) {
    // Element not found
  }
}

  }

  // Reset
  function HandleReset() {
    if (selectedAlgorithm?.name === "BINARY") {
      setArray([5, 15, 20, 30, 88, 221]); // sorted array for binary
    } else if (selectedAlgorithm?.name === "LINEAR") {
      setArray([30, 88, 221, 5, 20, 15]); // unsorted array for linear
    }

    ResetRef.current = true;
    console.log(ResetRef.current);

    setpresentbg([]);
    setSpeed(1);
    setTravesed([]);
    setCustomInput([]);
    SettraversedRight([])
  }

  useEffect(() => {
    if (selectedAlgorithm?.name === "BINARY") {
      setArray([5, 15, 20, 30, 88, 221]); // sort the array passing in original
    }
  }, [selectedAlgorithm]);

  useEffect(() => {
    console.log(traversed);
  });

  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-200 p-4 md:p-6 font-display space-y-8 transition-all duration-500 ease-in-out">
      <h1 className="flex justify-center text-4xl font-extrabold text-blue-800 animate-fadeInDown tracking-wide drop-shadow-lg">
        SEARCHING VISUALIZATION
      </h1>

      <div className="flex flex-col items-center justify-start overflow-hidden bg-base-200 text-base-content p-2 sm:p-10 font-sans">
        <div className="bg-base-100 rounded-3xl shadow-2xl p-4 w-full max-w-6xl border-2 border-primary relative z-10">
          <div className="absolute inset-0 bg-white opacity-5 rounded-3xl animate-pulse-slow"></div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 relative z-10">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 drop-shadow-lg">
              Searching Visualization
            </h2>
            <div
              className={`text-center text-lg font-semibold mt-4 transition-all duration-500 ease-in-out ${
                Complete !== null
                  ? "text-green-400 scale-105 drop-shadow-lg"
                  : "opacity-0"
              }`}
            >
              {Complete !== null
                ? `${target} is present at index ${Complete}`
                : ""}
            </div>

            <div className="text-right">
              {selectedAlgorithm ? (
                <>
                  <h2 className="text-xl font-bold text-blue-300">
                    {selectedAlgorithm.name} SORT
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedAlgorithm.type} • Best:{" "}
                    {selectedAlgorithm.complexity.best} • Avg:{" "}
                    {selectedAlgorithm.complexity.average} • Worst:{" "}
                    {selectedAlgorithm.complexity.worst}
                  </p>
                </>
              ) : (
                <h2 className="text-lg font-bold text-blue-300">
                  Select an Algorithm
                </h2>
              )}
            </div>
          </div>

          <div className="h-40 sm:h-48 bg-base-100 rounded-xl flex items-center justify-center border border-base-content/20 shadow-inner overflow-hidden relative z-10">
            <div>
              <div className="flex gap-5 text-gray-400 text-base sm:text-lg italic relative">
                {array.map((val, index) => (
                  <div
                    key={index}
                    className="text-2xl text-base-content flex flex-col items-center"
                  >
                    <span className="text-sm text-gray-300">{index}</span>
                    <input
                      type="text"
                      className={`${
                        presentbg.includes(index)
                          ? "bg-red-500"
                          : traversed.includes(index)
                          ? "bg-green-500"
                          : traversedRight.includes(index)
                          ? "bg-violet-400"
                          : "bg-blue-400"
                      } px-2 py-1 rounded text-black text-center w-16`}
                      value={val}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                ))}

                {/*  Target indicator BELOW the array */}
                {ResetRef.current === false && (
                  <div
                    className="absolute top-16 transition-all duration-300 ease-in-out flex flex-col items-center"
                    style={{
                      left: `${currentIndex * 5.4}rem`, // adjust as needed for spacing
                    }}
                  >
                    {/* Upward Arrow */}

                    <div
                      className={`${
                        ResetRef.current === true || target == null
                          ? ""
                          : "w-0 h-0 border-l-6 border-r-6 border-b-8 border-l-transparent border-r-transparent border-b-yellow-300"
                      }
 `}
                    ></div>

                    {/* Target Value */}

                    <div
                      className={`
                        ${
                          ResetRef.current === true || target == null
                            ? ""
                            : "px-2 py-1 rounded text-black text-center w-12 bg-yellow-300 shadow-md"
                        }
                        `}
                    >
                      {target !== null ? target : ""}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-teal-700 to-cyan-700 rounded-3xl shadow-2xl p-4 w-full max-w-6xl border-2 border-teal-500 relative z-10">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <div className="flex items-center bg-gray-700 rounded-full py-1 px-3 shadow-md">
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-28 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
            </div>

            <div>
              <input
                placeholder="Search Element"
                className="input input-bordered w-full sm:w-auto flex-grow text-sm"
                onChange={(e) => setTarget(e.target.value)}
              ></input>
              <button
                className="btn btn-primary ml-2 font-bold py-2 px-4 rounded-full shadow-md text-sm transition-transform transform hover:scale-105 active:scale-95"
                onClick={Search_Algo}
              >
                SEARCH
              </button>
              <button
                className="btn btn-primary ml-2 font-bold py-2 px-4 rounded-full shadow-md text-sm transition-transform transform hover:scale-105 active:scale-95"
                // onClick={HandleBackward}
              >
                STEP BACK
              </button>

              <button className="btn btn-primary ml-2 font-bold py-2 px-4 rounded-full shadow-md text-sm transition-transform transform hover:scale-105 active:scale-95">
                STEP FORWARD
              </button>

              <button
                className="btn btn-primary ml-2 font-bold py-2 px-4 rounded-full shadow-md text-sm transition-transform transform hover:scale-105 active:scale-95"
                onClick={HandleReset}
              >
                RESET
              </button>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-4 mb-2 shadow-inner border border-base-content/20">
            <h2 className="text-lg font-bold text-warning mb-2 text-center">
              CUSTOM ARRAY
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
              <input
                type="text"
                placeholder="e.g., 5,2,8,1"
                className="input input-bordered w-full sm:w-auto flex-grow text-sm"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
              <button
                className="btn btn-warning font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 text-sm"
                onClick={handleApplyInput}
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
