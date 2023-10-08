import { filterUsers } from '@/functions/user';
import React from 'react'
import { DataTable } from './data-table';

export default async function page({ }: {}) {
    const data = await filterUsers({}) || [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <DataTable data={data} />
        </div>
    )
}