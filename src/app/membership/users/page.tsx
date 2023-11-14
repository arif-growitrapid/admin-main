import { filterUsers } from '@/functions/user';
import React from 'react'
import { DataTable } from './data-table';
import { redirect } from 'next/navigation';
import { getRoles } from '@/functions/roles';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import matchPermissionToViewPage from '@/functions/match_permission_to_view_page';

export default async function page({ }: {}) {
    const session = await getServerSession(nextAuthOptions);
    const match = await matchPermissionToViewPage(
        session,
        [
            "user_add",
            "user_delete",
            "user_edit",
            "user_edit_others",
            "user_view"
        ],
        ["user_view", "visit_admin_panel"]
    );
    if (!match || !match.isFullyRequiredMatched) return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');

    const data = await filterUsers({}) || {
        data: {
            users: [],
            total: 0
        }
    };
    const roles = await getRoles() || { data: [] };

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            <DataTable
                initial_data={data.data?.users || []}
                initial_roles={roles.data || []}
                initial_total={data.data?.total || 0}
            />
        </div>
    )
}