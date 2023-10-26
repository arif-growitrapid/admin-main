"use client";

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon, HamburgerMenuIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react'

type Props = {
    searchParams: {
        [key: string]: string
    }
}

export default function Structure({
    searchParams
}: Props) {
    // Will only work on mobile devices
    // Side panel on mobile devices will actually behave like a separate page (not actually).
    // On desktop, it will be a side panel (not collapsible).
    // Breakpoint for mobile devices is 1024px (tailwindcss: lg)
    const [viewMode, setViewMode] = React.useState<'editor' | 'panel'>(['editor', 'panel'].includes(searchParams.view || "")
        ? searchParams.view as 'editor' | 'panel'
        : 'panel');
    // Get Boolean value from search params
    const isViewModeEditor = viewMode === 'editor';
    const isViewModePanel = viewMode === 'panel';

    React.useEffect(() => {
        // Update URL search params
        const url = new URL(window.location.href);
        url.searchParams.set('view', viewMode);
        window.history.replaceState({}, '', url.href);
    }, [viewMode]);


    return (
        <div className='h-full w-full relative'>
            <div className='relative h-full w-full flex flex-row items-stretch'>

                <div className={`h-full w-full border-r bg-background
                    absolute top-0 left-0 z-[1500]
                    transition-all duration-300
                    ${isViewModePanel ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                    sm:w-[20rem]
                    flex flex-col items-stretch
                `}>

                    <div className={`header w-full h-[41px] border-b p-1
                    flex flex-row flex-wrap items-center justify-between gap-2`}>
                        <div className='flex-grow'></div>

                        <Button
                            className='lg:hidden h-full px-2 flex gap-2 items-center justify-center'
                            onClick={() => setViewMode('editor')}
                            variant="outline">
                            Open Editor
                        </Button>
                    </div>

                    <div className='flex-grow flex-shrink flex-1 h-[calc(100%-41px)]'>
                        <ScrollArea className='w-full h-full' orientation='vertical'>
                        </ScrollArea>
                    </div>

                </div>

                <div className={`absolute w-full h-full top-0 left-0 z-[1499]
                    transition-all duration-300 bg-background/80 backdrop-blur-sm
                    lg:!hidden
                    ${isViewModePanel ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
                `} onClick={() => setViewMode('editor')}></div>

                <div className={`editor-wrapper relative h-full
                    w-full
                    lg:w-[calc(100%-20rem)]`}>
                    <div className='w-full h-full'>
                        <ScrollArea className='w-full h-full' orientation='vertical'>

                            <header className='w-full h-[41px] border-b p-1
                                flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4
                            '>
                                <Button
                                    className='lg:hidden h-full px-2 flex gap-2 items-center justify-center'
                                    onClick={() => setViewMode('panel')}
                                    variant="outline">
                                    <ArrowLeftIcon className='w-4 h-4 block sm:hidden' />
                                    <HamburgerMenuIcon className='w-4 h-4 hidden sm:block lg:hidden' />
                                </Button>

                                <h2 className='text-lg text-muted-foreground font-medium'>Testimonials</h2>

                                <div className='flex-grow'></div>

                                <Button
                                    className='h-full px-2 flex gap-2 items-center justify-center'
                                    variant="outline">
                                    <PlusIcon className='w-4 h-4' />
                                    <span className='hidden sm:block'>Add Document</span>
                                </Button>
                            </header>

                            <div className=''>
                                <h2 className='text-2xl text-center my-8 text-muted-foreground font-medium'>
                                    Comming soon...
                                </h2>
                            </div>

                        </ScrollArea>
                    </div>
                </div>

            </div>
        </div>
    )
}