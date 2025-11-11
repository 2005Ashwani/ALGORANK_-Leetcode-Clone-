import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function SortingPage() {
  const location = useLocation();
  const isVisualizationRoute = location.pathname.includes("/visualization");

  // The content
  const sortingAlgorithms = [
    {
      name: "BUBBLE",
      para: "Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This continues until the list is sorted. Despite its simplicity, it is inefficient for large datasets due to its O(n²) time complexity. However, it's often used in educational settings to teach the concept of sorting, swapping, and optimization (e.g., early stopping if no swaps happen in a pass).",

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
      para: "Selection Sort works by repeatedly selecting the minimum element from the unsorted part and placing it at the beginning. It's known for its simplicity, but it's inefficient on large lists due to its consistent O(n²) time complexity regardless of input. It makes the minimum possible number of swaps — exactly n − 1 — which is an advantage when writing to memory is costly (e.g., flash memory systems).",

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
      para: "Insertion Sort builds the final sorted array one element at a time. It's efficient for small data sets and mostly sorted data, but not suitable for large datasets. It performs well on nearly sorted arrays and is stable, meaning it preserves the relative order of equal elements. It's commonly used as a subroutine in more advanced algorithms like TimSort or when the dataset is small.",

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
      para: "Merge Sort is a divide-and-conquer algorithm that splits the array into halves, sorts each half, and merges them back together. It is efficient and stable but requires additional memory. Merge Sort guarantees O(n log n) performance in all cases and is especially effective for sorting linked lists and external datasets (e.g., in file systems). It forms the basis of JavaScript's and Python's built-in sort algorithms.",

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
      para: "Quick Sort is a fast, divide-and-conquer algorithm. It picks a pivot, partitions the array around it, and recursively sorts the partitions. It's efficient on average but has a worst-case of O(n²) when poor pivots are chosen. It is not a stable sort but is highly space-efficient with O(log n) space. Quick Sort is widely used due to its in-place sorting, and many libraries use its optimized versions (like introsort).",

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
      para: "Heap Sort uses a binary heap data structure to sort elements. It first builds a max heap, then repeatedly extracts the maximum element to sort the array. It is not stable but has good time guarantees of O(n log n) regardless of input. It's an in-place algorithm and doesn't require recursion, making it useful in memory-constrained environments. However, it often has worse cache performance compared to Merge or Quick Sort.",

      complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(1)",
      },
      type: "Heap-based",
    },
  ];
  // language array
  const sortingAlgorithmsCode = [
    {
      name: "BUBBLE",
      languages: {
        C: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
        CPP: `void bubbleSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}`,
        PYTHON: `def bubble_sort(arr):
  n = len(arr)
  for i in range(n - 1):
    for j in range(n - i - 1):
      if arr[j] > arr[j + 1]:
        arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
        JAVA: `void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
      },
    },
    {
      name: "SELECTION",
      languages: {
        C: `void selectionSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    int min_idx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[min_idx])
        min_idx = j;
    int temp = arr[min_idx];
    arr[min_idx] = arr[i];
    arr[i] = temp;
  }
}`,
        CPP: `void selectionSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    int min_idx = i;
    for (int j = i + 1; j < n; j++)
      if (arr[j] < arr[min_idx])
        min_idx = j;
    swap(arr[i], arr[min_idx]);
  }
}`,
        PYTHON: `def selection_sort(arr):
  n = len(arr)
  for i in range(n):
    min_idx = i
    for j in range(i+1, n):
      if arr[j] < arr[min_idx]:
        min_idx = j
    arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
        JAVA: `void selectionSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    int min_idx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx])
        min_idx = j;
    }
    int temp = arr[min_idx];
    arr[min_idx] = arr[i];
    arr[i] = temp;
  }
}`,
      },
    },
    {
      name: "INSERTION",
      languages: {
        C: `void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
        CPP: `void insertionSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
        PYTHON: `def insertion_sort(arr):
  for i in range(1, len(arr)):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j -= 1
    arr[j + 1] = key`,
        JAVA: `void insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
      },
    },
    {
      name: "MERGE",
      languages: {
        C: `void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int L[n1], R[n2];

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
        CPP: `void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j])
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
    }

    while (i < n1)
        arr[k++] = L[i++];

    while (j < n2)
        arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;

        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        merge(arr, left, mid, right);
    }
}`,
        PYTHON: `def merge_sort(arr):
  if len(arr) > 1:
    mid = len(arr) // 2
    L = arr[:mid]
    R = arr[mid:]
    merge_sort(L)
    merge_sort(R)
    i = j = k = 0
    while i < len(L) and j < len(R):
      if L[i] < R[j]:
        arr[k] = L[i]
        i += 1
      else:
        arr[k] = R[j]
        j += 1
      k += 1
    while i < len(L):
      arr[k] = L[i]
      i += 1
      k += 1
    while j < len(R):
      arr[k] = R[j]
      j += 1
      k += 1`,
        JAVA: `public class MergeSort {

    public static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; i++)
            L[i] = arr[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = arr[mid + 1 + j];

        int i = 0, j = 0;
        int k = left;

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k++] = L[i++];
            } else {
                arr[k++] = R[j++];
            }
        }

        while (i < n1)
            arr[k++] = L[i++];

        while (j < n2)
            arr[k++] = R[j++];
    }

    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;

            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);

            merge(arr, left, mid, right);
        }
    }
}`,
      },
    },
    {
      name: "QUICK",
      languages: {
        C: `#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        CPP: `void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int partition(vector<int> &arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int> &arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        PYTHON: `def quick_sort(arr):
  if len(arr) <= 1:
    return arr
  else:
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)`,
        JAVA: `public class QuickSort {

    static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }

        swap(arr, i + 1, high);
        return i + 1;
    }

    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
}`,
      },
    },
    {
      name: "HEAP",
      languages: {
        C: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
        CPP: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();

    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    for (int i = n - 1; i >= 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
        PYTHON: `def heapify(arr, n, i):
  largest = i
  l = 2 * i + 1
  r = 2 * i + 2
  if l < n and arr[l] > arr[largest]:
    largest = l
  if r < n and arr[r] > arr[largest]:
    largest = r
  if largest != i:
    arr[i], arr[largest] = arr[largest], arr[i]
    heapify(arr, n, largest)

def heap_sort(arr):
  n = len(arr)
  for i in range(n//2 - 1, -1, -1):
    heapify(arr, n, i)
  for i in range(n-1, 0, -1):
    arr[i], arr[0] = arr[0], arr[i]
    heapify(arr, i, 0)`,
        JAVA: `public class HeapSort {

    static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest])
            largest = left;

        if (right < n && arr[right] > arr[largest])
            largest = right;

        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }

    static void heapSort(int[] arr) {
        int n = arr.length;

        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);

        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }
}`,
      },
    },
  ];

  const [content, setContent] = useState(sortingAlgorithms[0]);
  const [language, setLanguage] = useState("C");

  const [code, setCode] = useState(
    sortingAlgorithmsCode.find((algo) => algo.name === "BUBBLE").languages.C
  );

  // handle content
  function HandleContentAdder(name) {
    console.log(name);
    const result = sortingAlgorithms.find((algo) => algo.name === name);

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
    const code = sortingAlgorithmsCode.find(
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
    const codeObj = sortingAlgorithmsCode.find(
      (algo) => algo.name === content.name
    );
    if (codeObj) {
      setCode(codeObj.languages[language]);
    }
  }, [content, language]);

  // Text animation
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
                Sorting{" "}
              </span>
              <span>Data Structure</span>
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
                  className="btn btn-info btn-sm"
                  onClick={() => HandleContentAdder("BUBBLE")}
                >
                  BUBBLE
                </button>

                <button
                  className="btn btn-success btn-sm"
                  onClick={() => HandleContentAdder("SELECTION")}
                >
                  SELECTION
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => HandleContentAdder("INSERTION")}
                >
                  INSERTION
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => HandleContentAdder("MERGE")}
                >
                  MERGE
                </button>

                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => HandleContentAdder("QUICK")}
                >
                  QUICK
                </button>

                <button
                  className="btn btn-error btn-sm"
                  onClick={() => HandleContentAdder("HEAP")}
                >
                  HEAP
                </button>
              </div>

              {/* content display  */}
              <div className="text-xs mt-3 bg-base-200 rounded-xl p-2 shadow-inner overflow-auto font-mono text-base-content border border-base-content/20">
                <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-content/20 space-y-4">
                  <h3 className="text-2xl font-bold text-base-content">
                    {content.name}
                  </h3>
                  <p className="text-base-content">{content.para}</p>
                  <h3 className="text-2xl font-bold text-base-content">
                    COMPLEXITY
                  </h3>
                  <ul>
                    <li>Best Case : {content.complexity.best}</li>
                    <li>Average Case : {content.complexity.average}</li>
                    <li>Worst Case : {content.complexity.worst}</li>
                    <li>Space complexity : {content.complexity.space}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Center - Code Display & Language Selection */}
            <div className="flex-grow flex flex-col gap-6">
              {/* Language Selection */}
              <div className="flex gap-8 p-4 bg-base-100 rounded-xl shadow-xl border border-base-content/20 justify-center animate-fadeIn transition-all duration-500 ease-in-out">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => HandleCodeAdder("C")}
                >
                  C
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => HandleCodeAdder("CPP")}
                >
                  C++
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => HandleCodeAdder("PYTHON")}
                >
                  PYTHON
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => HandleCodeAdder("JAVA")}
                >
                  JAVA
                </button>
              </div>

              {/* Code display */}
              <div className="bg-base-200 text-base-content p-6 rounded-xl shadow-xl overflow-auto font-mono text-sm relative border border-base-content/20 animate-fadeInUp flex-grow h-[350]">
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
            <div className="w-full lg:w-1/4">
              <div className="p-6 bg-base-100 rounded-xl shadow-lg border border-base-content/20 h-full flex flex-col justify-between text-center animate-slideInRight">
                <div>
                  <h3 className="text-2xl font-bold text-base-content mb-4">
                    Operations
                  </h3>
                  <p className="text-base-content/70 text-lg mb-4">
                    Watch the sorting process unfold step by step!
                  </p>

                  <div
                    className="bg-base-200 p-4 rounded-lg border border-base-content/20 min-h-[150px] flex flex-col justify-center items-center text-base-content text-base overflow-y-auto custom-scrollbar"
                    id="operations-display"
                  >
                    <p
                      className="text-center text-base-content font-semibold"
                      id="operation-status"
                    >
                      Click "Start Visualization" to begin sorting.
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
