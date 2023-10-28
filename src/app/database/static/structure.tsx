"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon, HamburgerMenuIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react'
import CreateCollectionModal from './create_collection_modal';
import { get_radix_icon } from '@/components/radix_icons';
import { useRouter } from 'next/navigation';

type Props = {
    children?: React.ReactNode;
    searchParams?: {
        view?: 'editor' | 'panel';
    }
    data: {
        collection?: {
            id: string;
            name: string;
            description: string;
            icon: string;
        };
        collections: {
            id: string;
            name: string;
            description: string;
            icon: string;
        }[];
    };
}

export default function Structure({
    children,
    searchParams,
    data
}: Props) {
    // Will only work on mobile devices
    // Side panel on mobile devices will actually behave like a separate page (not actually).
    // On desktop, it will be a side panel (not collapsible).
    // Breakpoint for mobile devices is 1024px (tailwindcss: lg)
    const [viewMode, setViewMode] = React.useState<'editor' | 'panel'>(['editor', 'panel'].includes(searchParams?.view || "")
        ? searchParams?.view as 'editor' | 'panel'
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

    const router = useRouter();

    return (
        <div className='h-full w-full relative'>
            <div className='relative h-full w-full flex flex-row items-stretch'>

                {/* Side Panel */}
                <div className={`h-full w-full border-r bg-background
                    absolute top-0 left-0 z-[1500]
                    transition-transform duration-300
                    ${isViewModePanel ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                    sm:w-[20rem]
                    flex flex-col items-stretch
                `}>

                    <div className={`header w-full h-[41px] border-b p-1
                    flex flex-row flex-wrap items-center justify-between gap-2`}>
                        <div className='flex-grow'></div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    className='h-full px-2 flex gap-2 items-center justify-center'
                                    variant="outline">
                                    <PlusIcon className='w-4 h-4' />
                                    <span>Create Collection</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={`rounded-lg w-full max-w-[calc(100%-2rem)] lg:max-w-4xl h-full max-h-[calc(100%-2rem)] p-0`}>
                                <CreateCollectionModal />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className='flex-grow flex-shrink flex-1 h-[calc(100%-41px)]'>
                        <ScrollArea className='w-full h-full' orientation='vertical'>

                            {/* Collections List */}
                            <div className='flex flex-col items-stretch gap-2 p-2'>
                                {data.collections.map((collection, index) => (
                                    <Button
                                        key={index}
                                        // select this collection if it is the current collection
                                        className={`h-full px-2 flex gap-2 items-center justify-start text-muted-foreground
                                            ${collection.id === data.collection?.id ? 'bg-muted-foreground/10' : ''}
                                        `}
                                        variant="outline"
                                        onClick={e => {
                                            setViewMode('editor');
                                            router.push(`/database/static/${collection.id}?view=${searchParams?.view || 'editor'}`);
                                        }}>
                                        {React.createElement(get_radix_icon(collection.icon).component, {
                                            className: 'w-6 h-6 fill-current',
                                        })}
                                        <p className='block flex-grow text-left'>
                                            <span className='block text-base font-semibold mb-1'>
                                                {collection.name}
                                            </span>
                                            <span className='block text-xs line-clamp-2'>
                                                {collection.description}
                                            </span>
                                        </p>
                                    </Button>
                                ))}
                            </div>

                        </ScrollArea>
                    </div>

                </div>

                {/* Overlay */}
                <div className={`absolute w-full h-full top-0 left-0 z-[1499]
                    transition-all duration-300 bg-background/80 backdrop-blur-sm
                    lg:!hidden
                    ${isViewModePanel ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
                `} onClick={() => setViewMode('editor')}></div>

                {/* Main Content */}
                <div className={`editor-wrapper relative h-full
                    w-full
                    lg:w-[calc(100%-20rem)]`}>
                    <div className='w-full h-full'>

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

                            <h2 className='text-lg text-muted-foreground font-medium m-0 lg:ml-4'>{data.collection?.name || "Static Database"}</h2>

                            <div className='flex-grow'></div>

                            <Button
                                className='h-full px-2 flex gap-2 items-center justify-center'
                                variant="outline">
                                <PlusIcon className='w-4 h-4' />
                                <span className='hidden sm:block'>Add Document</span>
                            </Button>
                        </header>

                        <ScrollArea className='w-full h-[calc(100%-41px)]' orientation='vertical'>
                            {children}
                        </ScrollArea>
                    </div>
                </div>

            </div>
        </div>
    )
}