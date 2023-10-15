import { PermissionsArrayType } from "@/types/permissions";
import { Session } from "next-auth";

export default async function matchPermissionToViewPage(
    session: Session | null,
    permissions: PermissionsArrayType[],
    required_permissions: PermissionsArrayType[],
): Promise<{
    isPartiallyMatched: boolean;
    isPartiallyRequiredMatched: boolean;
    isFullyMatched: boolean;
    isFullyRequiredMatched: boolean;
    matches: typeof permissions;
    required_matches: typeof required_permissions;
} | null> {
    try {
        if (!session) return null;

        const user = session.user;
        if (!user) return null;

        if (permissions.length === 0 && required_permissions.length === 0) return {
            isFullyMatched: true,
            isFullyRequiredMatched: true,
            isPartiallyMatched: true,
            isPartiallyRequiredMatched: true,
            matches: [],
            required_matches: [],
        };

        // Match permissions
        const matches = permissions.filter((permission) => {
            return user.permissions?.[permission] === true;
        });

        // Check if the user has the required permissions
        const required_matches = required_permissions.filter((permission) => {
            return user.permissions?.[permission] === true;
        });

        // Check if the user has the required permissions
        const isPartiallyMatched = matches.length > 0;
        const isPartiallyRequiredMatched = required_matches.length > 0;
        const isFullyMatched = matches.length === permissions.length;
        const isFullyRequiredMatched = required_matches.length === required_permissions.length;

        return {
            isPartiallyMatched,
            isPartiallyRequiredMatched,
            isFullyMatched,
            isFullyRequiredMatched,
            matches,
            required_matches,
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}
