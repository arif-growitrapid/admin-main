"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider } from 'next-auth/react';
import { useEffect, useRef } from "react";
import { BroadcastChannel } from "@/utils/web";
import config from "@/config";
import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin";
import { Session } from "next-auth";

export default function Providers({
    children,
    theme,
    session
}: {
    children: React.ReactNode,
    theme?: string,
    session: Session | null,
}) {
    const themeBroadcast = useRef(new BroadcastChannel(config.theme_key, { should_receive_own_messages: false }));

    useEffect(() => {
        themeBroadcast.current.onReceiveMessage((event, data) => {
            if (event === "theme_toggle") {
                document.body.className = "";
                document.body.classList.add(data.theme as string);
            }
        })
    }, []);

    return <SessionProvider session={session}>
        <Provider store={store} serverState={{
            ui: {
                theme: theme || "dark",
            },
            history: createEmptyHistoryState(),
        }}>
            {children}
        </Provider>
    </SessionProvider>;
}