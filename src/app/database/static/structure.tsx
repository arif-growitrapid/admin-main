"use client";

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon, HamburgerMenuIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import React from 'react'
import CreateCollectionModal from './create_collection_modal';
import { get_radix_icon } from '@/components/radix_icons';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type Props = {
    children?: React.ReactNode;
    data: {
        collections: {
            id: string;
            name: string;
            description: string;
            icon: string;
            isCollection: boolean;
            isActive: boolean;
        }[];
    };
}

export default function Structure({
    children,
    data
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    // Will only work on mobile devices
    // Side panel on mobile devices will actually behave like a separate page (not actually).
    // On desktop, it will be a side panel (not collapsible).
    // Breakpoint for mobile devices is 1024px (tailwindcss: lg)
    const viewModeFromSearchParams = searchParamsHook?.get('view');
    const [viewMode, setViewMode] = React.useState<'editor' | 'panel'>(
        pathname === '/database/static'
            ? 'panel'
            : ['editor', 'panel'].includes(viewModeFromSearchParams || "")
                ? viewModeFromSearchParams as 'editor' | 'panel'
                : 'panel'
    );
    // const [viewMode, setViewMode] = React.useState<'editor' | 'panel'>(isHome ? 'panel' : 'editor');
    // Get Boolean value from search params
    const isViewModeEditor = viewMode === 'editor';
    const isViewModePanel = viewMode === 'panel';

    React.useEffect(() => {
        // Update URL search params
        const url = new URL(window.location.href);
        url.searchParams.set('view', viewMode);
        window.history.replaceState({}, '', url.href);
    }, [viewMode]);

    const slugs = pathname.replace('/database/static/', '').split('/');
    const collection = data.collections.find(collection => collection.id === slugs[0]);

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

                        <CreateCollectionModal />
                    </div>

                    <div className='flex-grow flex-shrink flex-1 h-[calc(100%-41px)]'>
                        <ScrollArea className='w-full h-full' orientation='vertical'>

                            {/* Collections List */}
                            <div className='flex flex-col items-stretch gap-2 p-2'>
                                {data.collections.map((data_collection, index) => (
                                    <Button
                                        key={index}
                                        // select this collection if it is the current collection
                                        className={`group overflow-hidden relative h-full px-2 flex gap-2 items-center justify-start text-muted-foreground
                                            ${data_collection.id === collection?.id ? 'bg-muted-foreground/10' : ''}
                                        `}
                                        variant="outline"
                                        onClick={e => {
                                            router.push(`/database/static/${data_collection.id}?view=${viewModeFromSearchParams || 'editor'}`);
                                            setViewMode('editor');
                                        }}>
                                        {React.createElement(get_radix_icon(data_collection.icon).component, {
                                            className: 'w-6 h-6 fill-current',
                                        })}
                                        <p className='block flex-grow text-left'>
                                            <span className='block text-base font-semibold mb-1'>
                                                {data_collection.name}
                                            </span>
                                            <span className='block text-xs line-clamp-2'>
                                                {data_collection.description}
                                            </span>
                                        </p>
                                        <p className={`absolute top-0 right-0 bottom-0 h-full w-auto aspect-[1/2]
                                            bg- background/95 shadow-2xl
                                            flex flex-col items-center justify-evenly
                                            transition-transform translate-x-full
                                            group-hover:translate-x-0`}>
                                            <Button
                                                className='h-full p-1 w-[30px] rounded-full flex gap-2 items-center justify-center text-muted-foreground hover:text-primary'
                                                variant="ghost"
                                                title={`Edit This ${data_collection.isCollection ? "Collection" : "Document"}`}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}>
                                                <Pencil1Icon className='w-4 h-4' />
                                            </Button>
                                            <Button
                                                className='h-full p-1 w-[30px] rounded-full flex gap-2 items-center justify-center text-muted-foreground hover:text-primary'
                                                variant="ghost"
                                                title={`Delete This ${data_collection.isCollection ? "Collection" : "Document"}`}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}>
                                                <TrashIcon className='w-4 h-4' />
                                            </Button>
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
                                disabled={data.collections.length === 0}
                                variant="outline">
                                <ArrowLeftIcon className='w-4 h-4 block sm:hidden' />
                                <HamburgerMenuIcon className='w-4 h-4 hidden sm:block lg:hidden' />
                            </Button>

                            <h2 className='text-lg text-muted-foreground font-medium m-0 lg:ml-4'>
                                {collection?.name || "Static Database"}
                                &nbsp;&nbsp;
                                ({collection?.isCollection ? 'Collection' : 'Document'})
                            </h2>

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