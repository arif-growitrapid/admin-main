import type {HistoryState} from '@lexical/react/LexicalHistoryPlugin';

import {createEmptyHistoryState} from '@lexical/react/LexicalHistoryPlugin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Create a slice to store the history state
const historySlice = createSlice({
    name: 'history',
    initialState: createEmptyHistoryState(),
    reducers: {
        // Add a reducer to update the history state
        updateHistoryState(state, action: PayloadAction<HistoryState>) {
            return action.payload;
        },
    },
});

// Export the action creator
export const {updateHistoryState} = historySlice.actions;

// Export the reducer
export default historySlice.reducer;
