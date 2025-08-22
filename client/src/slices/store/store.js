import { configureStore } from "@reduxjs/toolkit";
 import rootReducer from "../reudcerCombiner";

export const store = configureStore({
  reducer: rootReducer,
});
