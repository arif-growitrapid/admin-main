import React from 'react'
import Structure from '../structure'
import { getCollectionsInfo } from '@/functions/static_db';

type Props = {
    params: {
        slugs: string[]
    },
    searchParams?: {
        view?: 'editor' | 'panel';
    }
}

export default async function page({
    params,
    searchParams
}: Props) {

    const collections = (await getCollectionsInfo()).data?.map(collection => ({
        id: collection?.name || '',
        name: collection?.name || '',
        description: collection?.description || '',
        icon: collection?.icon || ''
    }));

    const collection = collections?.find(collection => collection.id === params.slugs[0]);

    return (
        <div className='h-full w-full'>
            Hello
        </div>
    )
}