import React from 'react'
import AppBar from '../appbar'

export default function Structure({ children, theme }: { children: React.ReactNode, theme: string }) {
    return (
        <div className='h-full flex flex-col items-stretch'>
            <AppBar theme={theme} />

            <main className='flex-1 flex-grow overflow-auto'>
                {children}
            </main>

        </div>
    )
}