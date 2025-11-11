import { useForm } from "react-hook-form";
import { Send, Copy } from "lucide-react"; // Added Copy icon
import { useEffect, useRef } from "react";
import axiosClient from "../utils/axiosClient";

//  Redux imports
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setError } from "../redux/AiHistorySlicer_ALGORANK";

const ChatAI = ({ problem }) => {
  // Redux store connection
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.storeChat);
  const { theme } = useSelector((state) => state.theme);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Ref for auto-scroll
  const messageEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  Handle form submit (send message to backend)
  const onSubmit = async (data) => {
    // 1 Create the new user message object
    const newMessage = { role: "user", parts: [{ text: data.message }] };

    // Add user message immediately (optimistic UI update)
    dispatch(addMessage(newMessage));

    //   Clear input field
    reset();

    try {
      // 4️ Prepare full conversation for backend
      const messagesToSend = [...messages, newMessage];

      // 5️ Call backend API with chat history + problem details
      const response = await axiosClient.post("/ai/chat", {
        messages: messagesToSend,
        tittle: problem.tittle,
        description: problem.description,
        startCode: problem.startCode,
        visibleTestCases: problem.visibleTestCases,
      });

      // 6️ Parse backend response safely
      let parsed;
      try {
        parsed = JSON.parse(response.data.message);
      } catch {
        parsed = { text: response.data.message }; // fallback if plain text
      }

      // 7️ Append model response into messages (Redux)
      dispatch(addMessage({ role: "model", parts: [parsed] }));
    } catch (error) {
      console.error(error);

      // 8️ Handle API error gracefully
      dispatch(
        addMessage({
          role: "model",
          parts: [{ text: "X Oops! Something went wrong." }],
        })
      );

      // 9️ Store error in Redux for debugging/logging
      dispatch(setError(error.message));
    }
  };

  //  Copy code to clipboard
  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };


  return (
    <div className={`flex flex-col h-screen font-sans rounded-2xl ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-100 via-gray-200 to-white text-black'
        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
    }`}>
      {/*  Chat messages area */}
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-2xl p-4 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform ${
                  message.role === "user"
                    ? theme === 'light'
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 rounded-br-none hover:scale-[1.03]"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 rounded-br-none hover:scale-[1.03]"
                    : theme === 'light'
                      ? "bg-gradient-to-r from-gray-200 to-gray-300 rounded-bl-none hover:scale-[1.03]"
                      : "bg-gradient-to-r from-gray-700 to-gray-800 rounded-bl-none hover:scale-[1.03]"
                }`}
              >
                {/*  User message */}
                {message.role === "user" && (
                  <p className={`text-sm leading-relaxed ${
                    theme === 'light' ? 'text-black' : 'text-white'
                  }`}>
                    🙋 {message.parts[0].text}
                  </p>
                )}

                {/*  Model message */}
                {message.role === "model" && (
                  <div className="space-y-3">
                    {/* 🧾 Text response */}
                    {message.parts[0].text && (
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        theme === 'light' ? 'text-green-700' : 'text-green-300'
                      }`}>
                        {message.parts[0].text}
                      </p>
                    )}

                    {/*  Code block with copy button */}
                    {message.parts[0].code && (
                      <div className="relative">
                        {/*  Copy button */}
                        <button
                          onClick={() => handleCopy(message.parts[0].code)}
                          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-md transition ${
                            theme === 'light'
                              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <Copy size={14} />
                        </button>

                        {/*  Code area */}
                        <pre className={`p-4 rounded-lg text-xs overflow-x-auto font-mono border ${
                          theme === 'light'
                            ? 'bg-gray-100 border-gray-300'
                            : 'bg-black/80 border-gray-700'
                        }`}>
                          <code>{message.parts[0].code}</code>
                        </pre>
                      </div>
                    )}

                    {/* ⏱ Time Complexity */}
                    {message.parts[0].timeComplexity && (
                      <p className={`text-xs ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        ⏱ Time Complexity:{" "}
                        <span className={`${
                          theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                        }`}>
                          {message.parts[0].timeComplexity}
                        </span>
                      </p>
                    )}

                    {/* 💾 Space Complexity */}
                    {message.parts[0].spaceComplexity && (
                      <p className={`text-xs ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        💾 Space Complexity:{" "}
                        <span className={`${
                          theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                        }`}>
                          {message.parts[0].spaceComplexity}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/*  Input form fixed at bottom */}
      <div className={`sticky bottom-0 backdrop-blur-lg p-4 shadow-lg border-t ${
        theme === 'light'
          ? 'bg-gray-100/90 border-gray-300'
          : 'bg-gray-900/90 border-gray-700'
      }`}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center space-x-3"
        >
          {/* Input */}
          <input
            type="text"
            className={`flex-grow p-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-base ${
              theme === 'light'
                ? 'bg-gray-200 text-black border-gray-400 focus:border-blue-400 focus:ring-blue-400 placeholder:text-gray-500'
                : 'bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400'
            }`}
            placeholder="Type your message..."
            {...register("message", { required: true, minLength: 1 })}
          />

          {/*  Send button */}
          <button
            type="submit"
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>

        {/*  Error state */}
        {errors.message && (
          <p className="text-red-400 text-sm mt-2 ml-3">
            Message cannot be empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatAI;
