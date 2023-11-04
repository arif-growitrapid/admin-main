import { getCollectionsInfo } from '@/functions/static_db';
import React from 'react'
import Structure from './structure';

type Props = {
    children: React.ReactNode;
}

export default async function layout({
    children
}: Props) {
    const collections = (await getCollectionsInfo()).data?.map(collection => ({
        id: collection?.collection_id || '',
        name: collection?.name || '',
        description: collection?.description || '',
        icon: collection?.icon || '',
        isCollection: collection?._isCollection || false,
        isActive: collection?._is_active || false,
    }));

    return (
        <Structure
            data={{
                collections: collections || [],
            }}
        >
            {children}
        </Structure>
    )
}