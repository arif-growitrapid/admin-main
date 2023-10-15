"use server";

import clientPromise from "@/db/db";
import { matchPermissions } from "./auth";
import { Response, ServerFunctionResponse } from "./functions";
import config from "@/config";
import { roleType } from "@/types/auth";
import { ObjectId } from "mongodb";
import { PermissionsArrayType, operator_permissions, user_permissions } from "@/types/permissions";
import { revalidatePath } from "next/cache";

const default_roles: roleType[] = [
    {
        _id: '1',
        name: 'user',
        description: 'This role is assigned to all users by default',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1',
        updatedBy: '1',
        permissions: user_permissions,
        rank: 1,
        status: 'active'
    },
    {
        _id: '2',
        name: 'operator',
        description: 'This role has the maximum permissions. Assigned to all operators.',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1',
        updatedBy: '1',
        permissions: operator_permissions as any,
        rank: 2,
        status: 'active'
    },
];

/**
 * Get all roles
 */
export async function getRoles(): Promise<ServerFunctionResponse<roleType[] | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_view"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        const serverRoles = (await roles_collection.find().toArray()).map(role => ({
            ...role,
            _id: role._id.toString()
        }));

        const roles = [...default_roles, ...serverRoles];

        return Response("success", roles, 200, "Roles fetched");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Get a role by id
 */
export async function getRoleById(id: string): Promise<ServerFunctionResponse<roleType | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_view"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        const role = await roles_collection.findOne({
            _id: new ObjectId(id),
        });

        return Response("success", role, 200, "Role fetched");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Get Role by name
 */
export async function getRoleByName(name: string): Promise<ServerFunctionResponse<roleType | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_view"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        const role = await roles_collection.findOne({
            name: name
        });

        // If the role doesn't exist, then check if the role is a default role
        if (!role) {
            const default_role = default_roles.find(role => role.name === name);
            if (!default_role) return Response("error", null, 400, "Role doesn't exist");
            return Response("success", default_role, 200, "Role fetched");
        }

        return Response("success", role, 200, "Role fetched");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Create a role
 * Only operators can create a role
 */
export async function CreateRole({
    name,
    description,
    rank,
    permissions,
}: {
    name: string;
    description: string;
    rank: number;
    permissions: PermissionsArrayType[];
}, path?: string): Promise<ServerFunctionResponse<string | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_add"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_add"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        // Throw error if trying to create a role with the same name as a default role
        const default_role = default_roles.find(role => role.name === name);
        if (default_role) return Response("error", null, 400, "Role already exists");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        // Check if the role already exists
        const role_exists = await roles_collection.findOne({
            name,
        });
        if (role_exists) return Response("error", null, 400, "Role already exists");

        const role = await roles_collection.insertOne({
            _id: new ObjectId(),
            name,
            description,
            rank,
            permissions,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: session.user.id,
            updatedBy: session.user.id,
            status: "active",
        });

        if (path) revalidatePath(path);
        return Response("success", role.insertedId.toString(), 200, "Role created");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Update a role
 * Only operators can update a role
 */
export async function UpdateRole({
    id,
    name,
    description,
    rank,
    permissions,
    status
}: {
    id: string;
    name: string;
    description: string;
    rank: number;
    permissions: PermissionsArrayType[];
    status: roleType["status"];
}, path?: string): Promise<ServerFunctionResponse<string | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_edit"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_edit"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        // Throw error if trying to edit a default role
        const default_role = default_roles.find(role => role.name === name);
        if (default_role) return Response("error", null, 400, "Can't edit a default role");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        // Check if the role already exists
        const role_exists = await roles_collection.findOne({
            _id: new ObjectId(id),
        });
        if (!role_exists) return Response("error", null, 400, "Role doesn't exist");

        const role = await roles_collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name,
                    description,
                    rank,
                    permissions,
                    status,
                    updatedAt: new Date(),
                    updatedBy: session.user.id,
                },
            }
        );

        if (path) revalidatePath(path);
        return Response("success", id, 200, "Role updated");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Delete a role
 * Only operators can delete a role
 */
export async function DeleteRole(id: string, path?: string): Promise<ServerFunctionResponse<string | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_delete"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_delete"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        // Throw error if trying to delete a default role
        const default_role = default_roles.find(role => role._id === id);
        if (default_role) return Response("error", null, 400, "Can't delete a default role");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        // Check if the role already exists
        const role_exists = await roles_collection.findOne({
            _id: new ObjectId(id),
        });
        if (!role_exists) return Response("error", null, 400, "Role doesn't exist");

        const role = await roles_collection.deleteOne({
            _id: new ObjectId(id),
        });

        if (path) revalidatePath(path);
        return Response("success", id, 200, "Role deleted");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Activate a role
 * Only operators can activate a role
 */
export async function ChangeRoleStatus(id: string, status: roleType["status"], path?: string): Promise<ServerFunctionResponse<string | null>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["role_edit"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("role_edit"))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        // Throw error if trying to change status of a default role
        const default_role = default_roles.find(role => role._id === id);
        if (default_role) return Response("error", null, 400, "Can't change status of a default role");

        const client = await clientPromise;

        const db = client.db(config.db.root_name);
        const roles_collection = db.collection<roleType>("roles");

        // Check if the role already exists
        const role_exists = await roles_collection.findOne({
            _id: new ObjectId(id),
        });
        if (!role_exists) return Response("error", null, 400, "Role doesn't exist");

        const role = await roles_collection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    status: status,
                    updatedAt: new Date(),
                    updatedBy: session.user.id,
                },
            }
        );

        if (path) revalidatePath(path);
        return Response("success", id, 200, "Role activated");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}
