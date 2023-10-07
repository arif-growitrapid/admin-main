import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

import uiSliceReducer from "./slices/ui";
import HistorySliceReducer from "./slices/sharedHistory";

export function makeStore() {
    return configureStore({
        reducer: {
            ui: uiSliceReducer,
            history: HistorySliceReducer,
        },
        devTools: process.env.NEXT_PUBLIC_ENV === "development",
    });
}

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();