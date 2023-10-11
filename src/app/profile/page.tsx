import UserModal from '@/components/user_modal'
import { DBAuthType } from '@/types/auth';
import { getServerSession } from 'next-auth';
import React from 'react'
import { nextAuthOptions } from '../api/auth/[...nextauth]/authOptions';

type Props = {}

export default async function page({ }: Props) {
    const auth = await getServerSession(nextAuthOptions);

    return (
        <div className="p-2 h-full">

            <div className="w-full">
                <UserModal
                    user={auth?.user as DBAuthType || {}}
                />
            </div>

        </div>
    )
}