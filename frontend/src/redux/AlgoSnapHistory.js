import { createSlice } from "@reduxjs/toolkit";

const AlgoSnapAI = createSlice({
    name: 'AlgoSnapAI',

    initialState: {
        messages: [
            { role: "model", parts: [{ text: "Hi, how are you? 👋" }] },
            { role: "user", parts: [{ text: "I am fine 😃" }] },
        ],
        isLoading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearChat: (state) => {
            state.messages = [];
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    }
})


export const { addMessage, clearChat, setError } = AlgoSnapAI.actions;
export default AlgoSnapAI.reducer;