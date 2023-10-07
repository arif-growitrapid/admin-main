import { filterUsers } from '@/functions/user';
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function page({ }: {}) {
    const data = await filterUsers({}) || [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <DataTable columns={columns} data={data} />
        </div>
    )
}