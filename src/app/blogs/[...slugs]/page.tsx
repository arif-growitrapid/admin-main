import CommingSoon from '@/components/svg/comming_soon'
import React from 'react'

type Props = {
    params: {
        slugs: string[]
    },
    searchParams: URLSearchParams
}

export default function page({
    params: {
        slugs
    },
    searchParams
}: Props) {
    return (
        <div className='flex flex-col items-center justify-center gap-4 p-4 h-full'>
            <h2 className='text-2xl font-medium text-center text-muted-foreground tracking-widest uppercase'>
                Add, edit and delete blogs
            </h2>
            <p className='text-lg font-medium text-muted-foreground text-center'>
                Location: <code>src/app/blogs/{slugs.join('/')}/page.tsx</code>
            </p>
            <CommingSoon
                className='w-full h-auto max-w-[600px] mx-auto'
            />
            <p className='text-lg font-medium text-muted-foreground text-center'>This feature is comming soon</p>
        </div>
    )
}