"use server";

import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AuthType, MinAuthType } from "@/types/auth";
import { PermissionsArrayType } from "@/types/permissions";
import { ObjectId } from "mongodb";
import { Session, getServerSession } from "next-auth";

/**
 * If returns null, then the user is not logged in
 * or, occoured an error
 */
export async function matchPermissions(
    permissions: PermissionsArrayType[],
): Promise<{
    session: Session;
    matches: typeof permissions;
    isMatched: boolean;
    isFullyMatched: boolean;
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
            isFullyMatched: matches.length === permissions.length,
        };

    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function MinifyAuth(auth: AuthType): Promise<MinAuthType> {
    return {
        id: auth.id,
        roles: auth.roles,
        status: auth.status,
        createdAt: auth.createdAt,

        name: auth.name,
        email: auth.email,
        image: auth.image,
        emailVerified: auth.emailVerified,
    }
}

