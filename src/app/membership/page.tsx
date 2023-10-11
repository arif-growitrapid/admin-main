import { filterUsers } from '@/functions/user';
import React from 'react'
import { DataTable } from './data-table';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';

export default async function page({ }: {}) {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
        return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');
    } else if (!session.user.permissions?.user_add
        || !session.user.permissions?.user_delete
        || !session.user.permissions?.user_delete_others
        || !session.user.permissions?.user_edit
        || !session.user.permissions?.user_edit_others
        || !session.user.permissions?.user_view
    ) {
        return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');
    }

    const data = await filterUsers({}) || [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <DataTable initial_data={data} />
        </div>
    )
}