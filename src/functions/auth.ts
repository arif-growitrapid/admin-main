"use server";

import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PermissionsArrayType } from "@/types/permissions";
import { getServerSession } from "next-auth";

/**
 * If returns null, then the user is not logged in
 * or, occoured an error
 */
export async function matchPermissions(
    permissions: PermissionsArrayType[],
): Promise<{
    session: any;
    matches: typeof permissions;
    isMatched: boolean;
} | null> {
    try {
        const session = await getServerSession(nextAuthOptions);
        if (!session) return null;

        const user = session.user;
        if (!user) return null;

        // Match permissions
        const matches = permissions.filter((permission) => {
            return user.permissions?.[permission] === true;
        });

        return {
            session,
            matches,
            isMatched: matches.length > 0,
        };

    }
    catch (error) {
        console.error(error);
        return null;
    }
}

