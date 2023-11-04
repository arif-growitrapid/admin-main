import { AuthType, MinAuthType } from "@/types/auth";

export function MinifyAuth(auth: AuthType): MinAuthType {
    return {
        id: auth.id,
        roles: auth.roles,
        is_employee: auth.is_employee,
        status: auth.status,
        createdAt: auth.createdAt,

        name: auth.name,
        email: auth.email,
        image: auth.image,
        emailVerified: auth.emailVerified,
    }
}