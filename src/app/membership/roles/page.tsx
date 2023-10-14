import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import CommingSoon from '@/components/svg/comming_soon'
import { getRoles } from '@/functions/roles'
import { roleType } from '@/types/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { DataTable } from './data-table'

type Props = {}

export default async function page({ }: Props) {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
        return redirect('/?error=unauthorized&redirected=true&redirectedFrom=roles');
    } else if (!session.user.permissions?.role_add
        || !session.user.permissions?.role_assign
        || !session.user.permissions?.role_delete
        || !session.user.permissions?.role_edit
        || !session.user.permissions?.role_view
    ) {
        return redirect('/?error=unauthorized&redirected=true&redirectedFrom=roles');
    }

    const roles = (await getRoles()).data || [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <DataTable initial_data={roles} />
        </div>
    )
}