import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

export default function loading({ }: Props) {
    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <div className="rounded-md border h-full flex flex-col">

                <div className="flex items-center justify-between gap-1 border-b-4 p-2">
                    <div className="flex gap-1">
                        <Skeleton className="flex flex-grow w-full h-9 rounded-md border border-input max-w-[245.04px] px-3 py-1 text-sm shadow-sm" />
                        <Skeleton className="w-[180px] h-9 rounded-md border border-input p-2 px-3 py-1 text-sm shadow-sm" />
                    </div>

                    <Skeleton className="rounded-md text-sm font-medium border border-input h-9 w-[113.68px] px-4 py-2" />
                </div>

                <ScrollArea className="w-full relative flex-grow" orientation='both'>

                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between h-[49.08px] align-middle px-2 border-b-2">
                            <div className='flex items-center justify-center gap-1'>
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                            <div className='flex items-center justify-center gap-2'>
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    ))}

                </ScrollArea>

                <div className="flex items-center justify-end px-2 py-2 border-t-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        <Skeleton className='h-5 w-32' />
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Next
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}