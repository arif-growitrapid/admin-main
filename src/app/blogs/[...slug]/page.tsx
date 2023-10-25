import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { getBlogByID } from '@/functions/blogs'
import matchPermissionToViewPage from '@/functions/match_permission_to_view_page'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import Editor from './editor'
import { BlogPostType } from '@/types/blog'

type Props = {
    params: {
        slug: string[]
    },
    searchParams: {
        [key: string]: string | string[]
    }
}

export default async function page({
    params: {
        slug
    },
    searchParams
}: Props) {
    const session = await getServerSession(nextAuthOptions);
    if (!session) return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');
    const match = await matchPermissionToViewPage(
        session,
        [
            "blogs_edit",
            "blogs_view_draft",
        ],
        ['blogs_edit', 'blogs_view_draft']
    );
    if (!match || !match.isFullyRequiredMatched) return redirect('/?error=unauthorized&redirected=true&redirectedFrom=members');

    const dataRef = await getBlogByID(slug[0]);

    if (dataRef.status !== 200 || !dataRef.data) return notFound();

    const data: BlogPostType = {
        ...dataRef.data,
        _id: dataRef.data._id.toString(),
    }

    return (
        <div className='h-full w-full'>
            <Editor
                blog={data}
                searchParams={searchParams}
            />
        </div>
    )
}