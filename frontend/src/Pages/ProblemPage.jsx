// components/CodeEditor.jsx
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ProblemSubmission from "./problemSubmission";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ChatAI from "../component/ChatAI";
import Editorial from "../component/Editorial";
import { useSelector, useDispatch } from "react-redux";
import {
  initializeCode,
  setCode,
  setSelectedLanguage,
  setResult,
} from "../redux/codeSlicer";

const ProblemPage = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  // Get codes object and selectedLanguage from Redux
  const { codes, selectedLanguage, result } = useSelector(
    (state) => state.storeCode
  );

  // Get current language's code
  const currentCode = codes[selectedLanguage];

  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leftContent, setLeftContent] = useState("Description");
  const [rightContent, setRightContent] = useState("code");
  const editorRef = useRef(null);
  const { problemId } = useParams();

  // Fetch problem on mount and initialize all codes
  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        const data = response.data;
        setProblem(data);

        // Initialize codes for all three languages
        const initialCodes = {
          cpp:
            data?.startCode?.find((sc) => sc.language === "C++")?.initialCode ||
            "",
          Java:
            data?.startCode?.find((sc) => sc.language === "Java")
              ?.initialCode || "",
          JavaScript:
            data?.startCode?.find((sc) => sc.language === "JavaScript")
              ?.initialCode || "",
        };

        dispatch(initializeCode(initialCodes));
      } catch (error) {
        console.error("Error fetching problem:", error);
        alert(
          "Error fetching problem: " + (error.response?.data || error.message)
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [problemId, dispatch]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Handle editor change
  const handleEditorChange = (value) => {
    dispatch(setCode(value));
  };

  // Run code
  const handleRunCode = async () => {
    setIsLoading(true);
    dispatch(setResult(null));
    try {
      console.log("Running the code...");

      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: currentCode,
        language:
          selectedLanguage === "cpp"
            ? "c++"
            : selectedLanguage === "JavaScript"
            ? "javascript"
            : "java",
      });

      const resultData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      dispatch(setResult(resultData));
      setRightContent("result");
    } catch (error) {
      console.error("Error running code:", error);
      const errorMessage = error.response?.data || error.message;
      alert("Error running code: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit code
  const handleSubmitCode = async () => {
    setIsLoading(true);
    dispatch(setResult(null));
    try {
      console.log("Submitting the problem...");

      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: currentCode,
          language:
            selectedLanguage === "cpp"
              ? "c++"
              : selectedLanguage === "JavaScript"
              ? "JavaScript"
              : "Java",
        }
      );

      dispatch(setResult(response.data));
      setRightContent("result");
      console.log("Submission successful:", response.data);
      alert("Problem submitted successfully!");
    } catch (error) {
      console.error("Error submitting:", error);
      const errorMessage = error.response?.data || error.message;
      alert("Error submitting problem: " + errorMessage);

      if (
        errorMessage.includes("Token Not Present") ||
        errorMessage.includes("Invalid Token")
      ) {
        alert("Please login first before submitting code");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug log
  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div className="min-h-screen bg-base-200 p-3" data-theme={theme}>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 p-6 bg-base-100 rounded-lg shadow-lg animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-base-300 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-base-300 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-base-300 rounded w-5/6 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : !problem ? (
        <div className="text-center text-error text-xl font-semibold">Problem not found</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-3 m-2">
          {/* Left Panel */}
          <div className="p-3 rounded-lg w-full lg:w-1/2 bg-base-100 shadow-lg">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                onClick={() => setLeftContent("Description")}
                className="btn btn-primary btn-sm"
              >
                Description
              </button>
              <button
                onClick={() => setLeftContent("Editorial")}
                className="btn btn-secondary btn-sm"
              >
                Editorial
              </button>
              <button
                onClick={() => setLeftContent("Solution")}
                className="btn btn-accent btn-sm"
              >
                Solution
              </button>
              <button
                onClick={() => setLeftContent("Submission")}
                className="btn btn-info btn-sm"
              >
                Submission
              </button>
              <button onClick={() => setLeftContent("chatAI")} className="btn btn-warning btn-sm">
                ChatAI
              </button>
            </div>

            {leftContent === "Description" && (
              <div className="bg-base-100 p-3 rounded-lg shadow-lg h-[80vh] overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4 text-base-content">{problem?.tittle}</h1>

                <div className="mb-4 flex flex-wrap gap-4">
                  <span className="font-semibold text-base-content">Difficulty: </span>
                  <span className={`badge ${problem.difficulty === 'easy' ? 'badge-success' : problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'}`}>
                    {problem.difficulty.toUpperCase()}
                  </span>
                  <span className="font-semibold text-base-content">Tags: </span>
                  <span className="badge badge-info">
                    {problem.tags.toUpperCase()}
                  </span>
                </div>

                <div className="prose max-w-none mb-4">
                  <h2 className="text-xl font-semibold mb-2 text-base-content">Description</h2>
                  <p className="text-base-content">{problem.description}</p>
                </div>

                {problem.visibleTestCases?.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-base-content">
                      Example Test Cases
                    </h2>
                    {problem.visibleTestCases.map((testCase, index) => (
                      <div
                        key={index}
                        className="mb-2 p-3 bg-base-200 rounded-lg shadow-sm"
                      >
                        <div className="text-base-content">
                          <strong>Input:</strong> {testCase.input}
                        </div>
                        <div className="text-base-content">
                          <strong>Output:</strong> {testCase.output}
                        </div>
                        <div className="text-base-content">
                          <strong>Explanation:</strong> {testCase.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftContent === "Solution" && (
              <div className="bg-base-100 p-3 rounded-lg shadow-lg h-[80vh] overflow-y-auto">
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                  <div className="font-bold text-2xl text-base-content">
                    {problem?.tittle}
                  </div>
                  <div className="text-xl text-error font-semibold">
                    {problem?.referenceSolution[0]?.language}
                  </div>
                </div>
                <div className="bg-base-200 p-3 rounded-lg">
                  <SyntaxHighlighter language="cpp" style={dark}>
                    {problem?.referenceSolution?.[0]?.completeCode}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {leftContent === "Editorial" && <Editorial problem={problem} />}

            {leftContent === "chatAI" && (
              <div className="bg-base-100 p-3 rounded-lg shadow-lg h-[80vh]">
                <h2 className="flex justify-center text-2xl font-bold text-base-content mb-4">
                  CHAT WITH AI
                </h2>
                <div>
                  <ChatAI problem={problem} />
                </div>
              </div>
            )}

            {leftContent === "Submission" && (
              <div className="bg-base-100 p-3 rounded-lg shadow-lg h-[80vh] overflow-y-auto">
                <ProblemSubmission problemId={problemId} />
              </div>
            )}
          </div>

          {/* Right Panel - Code Editor */}
          <div className="flex flex-col p-4 w-full lg:w-1/2 bg-base-100 rounded-2xl shadow-lg border border-base-300">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setRightContent("code")}
                  className={`btn btn-sm ${rightContent === "code" ? "btn-active" : ""}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setRightContent("testcode")}
                  className={`btn btn-sm ${rightContent === "testcode" ? "btn-active" : ""}`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setRightContent("result")}
                  className={`btn btn-sm ${rightContent === "result" ? "btn-active" : ""}`}
                >
                  Result
                </button>
              </div>

              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className="btn btn-warning btn-sm"
              >
                {isLoading ? "Running..." : "Run"}
              </button>
            </div>

            {/* Editor Content */}
            <div className="flex flex-col bg-base-200 rounded-xl shadow-inner overflow-hidden h-[75vh]">
              {rightContent === "code" && (
                <div className="flex flex-col h-full">
                  {/* Language Buttons */}
                  <div className="flex gap-2 bg-base-300 px-4 py-2 border-b border-base-content/20">
                    <button
                      onClick={() => dispatch(setSelectedLanguage("cpp"))}
                      className={`btn btn-xs ${selectedLanguage === "cpp" ? "btn-active" : ""}`}
                    >
                      C++
                    </button>
                    <button
                      onClick={() => dispatch(setSelectedLanguage("Java"))}
                      className={`btn btn-xs ${selectedLanguage === "Java" ? "btn-active" : ""}`}
                    >
                      Java
                    </button>
                    <button
                      onClick={() => dispatch(setSelectedLanguage("JavaScript"))}
                      className={`btn btn-xs ${selectedLanguage === "JavaScript" ? "btn-active" : ""}`}
                    >
                      JavaScript
                    </button>
                  </div>

                  {/* Monaco Editor */}
                  <Editor
                    key={selectedLanguage}
                    height="100%"
                    language={
                      selectedLanguage === "cpp"
                        ? "cpp"
                        : selectedLanguage === "JavaScript"
                        ? "javascript"
                        : "java"
                    }
                    theme="vs-dark"
                    value={currentCode}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                  />
                </div>
              )}

              {rightContent === "testcode" && result && (
                <div
                  className={`p-4 w-full m-4 rounded-2xl shadow-lg ${
                    result?.accepted?.status?.toLowerCase?.() === "accepted" ||
                    result?.status?.description?.toLowerCase?.() === "accepted"
                      ? "bg-success text-success-content"
                      : "bg-error text-error-content"
                  }`}
                >
                  <div className="font-semibold">
                    <h1>Status: {result?.status?.description || result?.accepted?.status}</h1>
                    <h1>Memory: {result?.memory} KB</h1>
                    <h1>Runtime: {result?.time || result?.runTime} Sec</h1>
                  </div>

                  {problem.visibleTestCases?.length > 0 && (
                    <div className="mt-4">
                      {problem.visibleTestCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="mt-2 p-3 bg-base-100 rounded-lg text-base-content"
                        >
                          <div><strong>Input:</strong> {testCase.input}</div>
                          <div><strong>Output:</strong> {testCase.output}</div>
                          <div><strong>Explanation:</strong> {testCase.explanation}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rightContent === "result" && result && (
                <div className="p-4 bg-success text-success-content w-full m-4 rounded-2xl shadow-lg">
                  <h1 className="font-semibold">
                    Status: {result?.status?.description || result?.accepted?.status}
                  </h1>
                  {result?.passedTestCases !== undefined && (
                    <h1>Test Cases Passed: {result.passedTestCases}/{result.totalTestCases}</h1>
                  )}
                  <h1>Memory: {result?.memory} KB</h1>
                  <h1>Runtime: {result?.time || result?.runTime} Sec</h1>
                </div>
              )}

              {rightContent === "result" && !result && (
                <div className="text-base-content/60 p-4 m-4 text-center">
                  No results yet. Run or submit your code to see results.
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitCode}
              disabled={isLoading}
              className="btn btn-success btn-sm mt-4"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
