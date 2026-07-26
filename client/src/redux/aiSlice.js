import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sendMessageToAI } from "../services/ai.service";

// ==========================
// Send Message
// ==========================

export const sendMessage = createAsyncThunk(
    "ai/sendMessage",
    async (message, thunkAPI) => {
        try {
            const response = await sendMessageToAI({
                message,
            });
            return {
                userMessage: message,
                aiReply: response.data.reply,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "AI service unavailable"
            );
        }
    }
);

const initialState = {
    messages: [],
    loading: false,
    error: null,
};

const aiSlice = createSlice({
    name: "ai",

    initialState,

    reducers: {
        clearChat(state) {
            state.messages = [];
        },

        clearError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================
            // Send Message
            // ==========================

            .addCase(sendMessage.pending, (state, action) => {
                state.loading = true;
                state.error = null;

                // User message immediately show
                state.messages.push({
                    id: Date.now(),
                    sender: "user",
                    text: action.meta.arg,
                });
            })

            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;

                state.messages.push({
                    id: Date.now() + 1,
                    sender: "ai",
                    text: action.payload.aiReply,
                });
            })

            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                state.messages.push({
                    id: Date.now() + 2,
                    sender: "ai",
                    text:
                        action.payload ||
                        "Sorry, something went wrong. Please try again.",
                });
            });
    },
});

export const { clearChat, clearError } = aiSlice.actions;

export default aiSlice.reducer;