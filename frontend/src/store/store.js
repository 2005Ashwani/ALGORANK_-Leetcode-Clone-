// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import chatHistoryReducer from "../redux/AiHistorySlicer_ALGORANK"
import codeHistoryReducer from "../redux/codeSlicer";
import AlgoSnapAIReducer from "../redux/AlgoSnapHistory";
import themeReducer from "../redux/Theme";

// Me

export const store = configureStore({
  reducer: {
    auth: authReducer, // Slice reducer for authentication
    storeChat: chatHistoryReducer,   // Slice to store the Chat History of the AlgoRank
    storeCode: codeHistoryReducer,    // Slice to store code
    AlgoSnapAI: AlgoSnapAIReducer,   // To Store the History of AlgoRank


    theme: themeReducer,



  },
});

