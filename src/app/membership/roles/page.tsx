import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { getRoles } from '@/functions/roles'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { DataTable } from './data-table'
import matchPermissionToViewPage from '@/functions/match_permission_to_view_page'

type Props = {}

export default async function page({ }: Props) {
    const session = await getServerSession(nextAuthOptions);
    const match = await matchPermissionToViewPage(
        session,
        [
            "role_add",
            "role_delete",
            "role_edit",
            "role_view",
        ],
        ["role_view", "visit_admin_panel"]
    );
    if (!match || !match.isFullyRequiredMatched) return redirect('/?error=unauthorized&redirected=true&redirectedFrom=roles');

    const roles = (await getRoles()).data || [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <DataTable initial_data={roles} />
        </div>
    )
}