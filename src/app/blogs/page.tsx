import React from 'react'
import { DataTable } from './data-table';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../api/auth/[...nextauth]/authOptions';
import matchPermissionToViewPage from '@/functions/match_permission_to_view_page';

type Props = {}

export default async function page({ }: Props) {
    const session = await getServerSession(nextAuthOptions);
    const match = await matchPermissionToViewPage(
        session,
        [
            "blogs_add",
            "blogs_delete",
            "blogs_edit",
            "blogs_view_draft",
        ],
        ["blogs_add", 'blogs_delete', 'blogs_edit', 'blogs_view_draft']
    );
    if (!match || !match.isFullyRequiredMatched) return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');

    // @ts-ignore
    const data = [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            {/* @ts-ignore */}
            <DataTable initial_data={data} />
        </div>
    )
}