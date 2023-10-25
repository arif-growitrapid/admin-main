import React from 'react'
import { DataTable } from './data-table';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../api/auth/[...nextauth]/authOptions';
import matchPermissionToViewPage from '@/functions/match_permission_to_view_page';
import { BlogPostType, DBBlogPostType } from '@/types/blog';
import { ObjectId } from 'mongodb';
import { getBlogsByUser } from '@/functions/blogs';

type Props = {}

export default async function page({ }: Props) {
    const session = await getServerSession(nextAuthOptions);
    if (!session) return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');
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

    const data: BlogPostType[] = (await getBlogsByUser(session.user.id)).data?.map(t => ({
        ...t,
        _id: new ObjectId(t._id).toHexString(),
    })) || [];

    return (
        <div className="sm:container mx-auto sm:py-5 h-full">
            {/* @ts-ignore */}
            <DataTable initial_data={data} />
        </div>
    )
}