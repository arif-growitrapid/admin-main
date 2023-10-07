import config from '@/config';
import { setCookie } from '@/utils/cookie';
import { BroadcastChannel } from '@/utils/web';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Create a slice to store the UI state
const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: "dark",
    },
    reducers: {
        setTheme(state, payload: PayloadAction<string>) {
            const theme = payload.payload;

            const themeBroadcast = new BroadcastChannel(config.theme_key, { should_receive_own_messages: true });

            setCookie("theme", theme, 15);
            themeBroadcast.postMessage('theme_toggle', { theme });
            document.documentElement.className = "";
            document.documentElement.classList.add(theme);

            state.theme = theme;
        },
    },
});

// Export actions
export const { setTheme } = uiSlice.actions;

export default uiSlice.reducer;
