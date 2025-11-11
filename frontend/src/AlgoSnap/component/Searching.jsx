import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Searching() {
  const location = useLocation();
  const isVisualizationRoute = location.pathname.includes("/visualization");

  // The content
  const searchingAlgorithms = [
    {
      name: "LINEAR",
      para: "Linear Search is the simplest search algorithm that checks each element in a list one by one until the target value is found or the list ends. It doesn't require sorted data and works on any data structure like arrays or linked lists. While it's easy to implement, its time complexity is linear, making it inefficient for large datasets.",
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
      para: "Binary Search is an efficient algorithm for finding an element in a sorted array. It repeatedly divides the search interval in half by comparing the target with the middle element. If the middle element is equal to the target, the search ends; otherwise, it continues in the appropriate half. It drastically reduces the time complexity compared to linear search but requires the array to be sorted.",
      complexity: {
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)",
      },
      type: "Divide and Conquer",
    },
  ];

  // language array
  const searchingAlgorithmsCode = [
    {
      name: "LINEAR",
      languages: {
        C: `int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target)
      return i;
  }
  return -1;
}`,
        CPP: `int linearSearch(vector<int>& arr, int target) {
  for (int i = 0; i < arr.size(); i++) {
    if (arr[i] == target)
      return i;
  }
  return -1;
}`,
        PYTHON: `def linear_search(arr, target):
  for i in range(len(arr)):
    if arr[i] == target:
      return i
  return -1`,
        JAVA: `int linearSearch(int[] arr, int target) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target)
      return i;
  }
  return -1;
}`,
      },
    },

    {
      name: "BINARY",
      languages: {
        C: `int binarySearch(int arr[], int left, int right, int target) {
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target)
      return mid;
    else if (arr[mid] < target)
      left = mid + 1;
    else
      right = mid - 1;
  }
  return -1;
}`,
        CPP: `int binarySearch(vector<int>& arr, int target) {
  int left = 0, right = arr.size() - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target)
      return mid;
    else if (arr[mid] < target)
      left = mid + 1;
    else
      right = mid - 1;
  }
  return -1;
}`,
        PYTHON: `def binary_search(arr, target):
  left, right = 0, len(arr) - 1
  while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
      return mid
    elif arr[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return -1`,
        JAVA: `int binarySearch(int[] arr, int target) {
  int left = 0, right = arr.length - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target)
      return mid;
    else if (arr[mid] < target)
      left = mid + 1;
    else
      right = mid - 1;
  }
  return -1;
}`,
      },
    },
  ];

  const [content, setContent] = useState(searchingAlgorithms[0]);
  const [language, setLanguage] = useState("C");

  const [code, setCode] = useState(
    searchingAlgorithmsCode.find((algo) => algo.name === "LINEAR").languages.C
  );

  // handle content
  function HandleContentAdder(name) {
    console.log(name);
    const result = searchingAlgorithms.find((algo) => algo.name === name);

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
    const code = searchingAlgorithmsCode.find(
      (algo) => algo.name === content.name
    );

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
    const codeObj = searchingAlgorithmsCode.find(
      (algo) => algo.name === content.name
    );
    if (codeObj) {
      setCode(codeObj.languages[language]);
    }
  }, [content, language]);


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
        ${animate ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90"}`}
            >
              <span className="text-primary animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">Searching </span>
              <span className="text-base-content">
                Data Structure 
              </span>
                 <span className="text-teal-400 animate-pulse drop-shadow-lg hover:scale-105 transition-transform duration-500">
          Visualizer
        </span>

            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            {/* Left - Sorting Algorithms */}
            <div className="p-4 bg-base-100 rounded-xl shadow-lg border border-base-content/20 animate-slideInLeft transition-all duration-500 ease-in-out">
              <h3 className="text-lg font-semibold text-base-content mb-4 border-b pb-2 border-base-content/20">
                Algorithms
              </h3>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  className="btn btn-primary px-5 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
                  onClick={() => HandleContentAdder("LINEAR")}
                >
                  LINEAR SEARCHING
                </button>

                <button
                  className="btn btn-secondary px-5 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
                  onClick={() => HandleContentAdder("BINARY")}
                >
                  BINARY SEARCHING
                </button>
              </div>

              {/* content display  */}
              <div className="text-xs mt-3 bg-base-100 rounded-xl p-2 shadow-inner overflow-auto font-mono text-base-content border border-base-content/20">
                <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-content/20 space-y-4">
                  <h3 className="text-2xl font-bold text-base-content">
                    {content.name}
                  </h3>
                  <p className="text-base-content/70">{content.para}</p>
                  <h3 className="text-2xl font-bold text-base-content">
                    COMPLEXITY
                  </h3>
                  <ul className="text-base-content/70">
                    <li>Best Case : {content.complexity.best}</li>
                    <li>Average Case : {content.complexity.average}</li>
                    <li>Worst Case : {content.complexity.worst}</li>
                    <li>Space complexity : {content.complexity.space}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Center - Code Display & Language Selection */}
            <div className="flex-grow flex flex-col gap-6 w-full">
              {/* Language Selection */}
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center p-4 bg-base-100 rounded-xl shadow-xl border border-base-content/20 animate-fadeIn transition-all duration-500 ease-in-out">
                <button
                  className="btn btn-primary px-4 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
                  onClick={() => HandleCodeAdder('C')}
                >
                  C
                </button>

                <button
                  className="btn btn-primary px-4 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
                  onClick={() => HandleCodeAdder('CPP')}
                >
                  C++
                </button>

                <button
                  className="btn btn-outline btn-primary px-4 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
                  onClick={() => HandleCodeAdder('PYTHON')}
                >
                  PYTHON
                </button>

                <button
                  className="btn btn-outline btn-primary px-4 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
                  onClick={() => HandleCodeAdder('JAVA')}
                >
                  JAVA
                </button>
              </div>

              {/* Code display */}
              <div className="bg-base-200 text-base-content p-4 sm:p-6 rounded-xl shadow-xl overflow-auto font-mono text-sm relative border border-base-content/20 animate-fadeInUp flex-grow max-h-[350px] w-full">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className="block w-3 h-3 bg-error rounded-full"></span>
                  <span className="block w-3 h-3 bg-warning rounded-full"></span>
                  <span className="block w-3 h-3 bg-success rounded-full"></span>
                </div>

                <pre className="mt-6 sm:mt-4 text-xs sm:text-sm whitespace-pre-wrap break-words">
                  <code className="language-javascript">{`${code}`}</code>
                </pre>
              </div>
            </div>


            {/* Right - Operations */}
            <div className="flex-none lg:w-1/4">
              <div className="p-6 bg-base-100 rounded-xl shadow-lg border border-base-content/20 h-full flex flex-col justify-between text-center animate-slideInRight">
                <div>
                  <h3 className="text-2xl font-bold text-base-content mb-4">
                    Operations
                  </h3>
                  <p className="text-base-content/70 text-lg mb-4">
                    Watch the searching process unfold step by step!
                  </p>

                  <div
                    className="bg-base-100 p-4 rounded-lg border border-base-content/20 min-h-[150px] flex flex-col justify-center items-center text-base-content/70 text-base overflow-y-auto custom-scrollbar"
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
                    <button className="btn btn-success px-6 py-3 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200 w-full">
                      Start Visualization
                    </button>
                  </Link>

                  <button
                    id="reset-array-btn"
                    className="btn btn-error px-6 py-3 mt-3 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 duration-200 w-full"
                  >
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
