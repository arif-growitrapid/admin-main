import React from 'react'
import Structure from './structure'
import { getCollectionsInfo } from '@/functions/static_db';

type Props = {
    searchParams?: {
        view?: 'editor' | 'panel';
    }
}

export default async function page({
    searchParams
}: Props) {

    const collections = (await getCollectionsInfo()).data?.map(collection => ({
        id: collection?.name || '',
        name: collection?.name || '',
        description: collection?.description || '',
        icon: collection?.icon || ''
    }));

    return (
        <div className='w-full h-full'>

            <h1 className='text-3xl font-bold'>Home Page</h1>

        </div>
    )
}