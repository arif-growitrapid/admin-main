"use server";

import clientPromise from "@/db/db";
import { matchPermissions } from "./auth";
import { Response, ServerFunctionResponse } from "./functions";
import config from "@/config";
import { roleType } from "@/types/auth";
import { ObjectId } from "mongodb";
import { PermissionsArrayType } from "@/types/permissions";

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

        const roles = await roles_collection.find().toArray();

        return Response("success", roles, 200, "Roles fetched");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Get a roles by id
 */
export async function getRolesById(ids: string[]): Promise<ServerFunctionResponse<roleType[] | null>> {
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

        const role = await roles_collection.find({
            _id: {
                $in: ids.map((id) => new ObjectId(id)),
            }
        }).toArray();

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
}): Promise<ServerFunctionResponse<string | null>> {
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

        return Response("success", role.insertedId.toString(), 200, "Role created");
    } catch (e) {
        console.error(e);
        return Response("error", null, 500, "Internal server error");
    }
}
