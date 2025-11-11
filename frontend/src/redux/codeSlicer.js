// redux/codeSlicer.js
import { createSlice } from "@reduxjs/toolkit";

const codeHistorySlicer = createSlice({
    name: "storeCode",
    initialState: {
        codes: {
            "cpp": "",
            "Java": "",
            "JavaScript": ""
        },
        selectedLanguage: "cpp",
        result: null,
    },
    reducers: {
        // Initialize all language codes at once
        initializeCode: (state, action) => {
            state.codes = action.payload;
        },

        // Set code for currently selected language
        setCode: (state, action) => {
            state.codes[state.selectedLanguage] = action.payload;
        },

        // Change selected language
        setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload;
        },

        // Set result
        setResult: (state, action) => {
            state.result = action.payload;
        },

        // Clear all data
        clearCodeData: (state) => {
            state.codes = {
                "cpp": "",
                "Java": "",
                "JavaScript": ""
            };
            state.result = null;
            state.selectedLanguage = "cpp";
        }
    }
});

export const { 
    initializeCode,
    setCode, 
    setSelectedLanguage, 
    setResult, 
    clearCodeData 
} = codeHistorySlicer.actions;

export default codeHistorySlicer.reducer;