"use client";

import React from 'react'
import AppBar from '../components/appbar'
import { useSession } from 'next-auth/react';
import Login from '@/components/login';

export default function Structure({ children, theme }: { children: React.ReactNode, theme: string }) {
    const { data: session, status } = useSession();

    if (session && session.user
        && session.user.permissions
        && session.user.permissions.view_dashboard
        && session.user.permissions.visit_admin_panel
    )
        return (
            <div className='h-full flex flex-col items-stretch'>
                <AppBar theme={theme} />

                <main className='flex-1 flex-grow overflow-auto'>
                    {children}
                </main>

            </div>
        )
    else
        return <Login />
}