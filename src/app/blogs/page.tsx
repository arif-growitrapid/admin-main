import CommingSoon from '@/components/svg/comming_soon'
import React from 'react'
import { DataTable } from './data-table';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../api/auth/[...nextauth]/authOptions';

type Props = {}

export default async function page({ }: Props) {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
        return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');
    } else if (!session.user.permissions?.blogs_add
        || !session.user.permissions?.blogs_edit
        || !session.user.permissions?.blogs_delete
    ) {
        return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');
    }

    // @ts-ignore
    const data = [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            {/* @ts-ignore */}
            <DataTable initial_data={data} />
        </div>
    )
}