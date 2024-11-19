import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import build from "next/dist/build";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    increByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        incrementAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.value += action.payload;
        }
      )
      .addCase(incrementAsync.pending, () => {
        console.log("Increment is Pendding....");
      })
      .addCase(incrementAsync.rejected, () => {
        console.log("Increment Rejected");
      });
  },
});

// Async function
export const incrementAsync = createAsyncThunk(
  "counter/incrementAsync",
  async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 3500));
    return amount;
  }
);

// Export action for app to access it
export const { increment, decrement, increByAmount, reset } =
  counterSlice.actions;

// Export reducers for configureStore use
export default counterSlice.reducer;
