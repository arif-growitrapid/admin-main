"use server";

import config from "@/config";
import clientPromise from "@/db/db";
import { DBAuthType, roleType } from "@/types/auth";
import { ObjectId, WithId } from "mongodb";
import { matchPermissions } from "./auth";
import { Response, ServerFunctionResponse } from "./functions";
import { revalidatePath } from "next/cache";

/**
 * Get a user by their ID
 */
export async function getUserByID(id: string): Promise<ServerFunctionResponse<WithId<DBAuthType> | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to view users");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to view users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const user = await user_collection.findOne({ _id: new ObjectId(id) });

        return Response("success", user);
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Get users by their role
 */
export async function getUsersByRole(role: string): Promise<ServerFunctionResponse<WithId<DBAuthType>[] | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to view users");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to view users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const users = await user_collection.find({ roles: role }).toArray();

        return Response("success", users);
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Search for users by name, email, phone, etc.
 */
export async function searchForUser(
    query: string,
    limit: number = 10,
    skip: number = 0,
): Promise<ServerFunctionResponse<WithId<DBAuthType>[] | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to view users");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to view users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const users = await user_collection.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { "phone.number": { $regex: query, $options: "i" } },
            ]
        }).skip(skip).limit(limit).toArray();

        return Response("success", users);
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Filter users by any field
 */
export async function filterUsers(
    filter: Partial<DBAuthType>,
    limit: number = 10,
    skip: number = 0,
): Promise<ServerFunctionResponse<DBAuthType[] | null>> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to view users");
        const { session, isMatched, matches } = t;

        if (!isMatched) return Response("error", null, 401, "You don't have the permission to view users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const users = (await user_collection.find(filter).skip(skip).limit(limit).toArray()).map(user => ({
            ...user,
            _id: user._id.toString(),
        }));

        return Response("success", users);
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Update a user by their ID
 */
export async function updateUserByID(
    id: string,
    update: Partial<DBAuthType>,
): Promise<ServerFunctionResponse<WithId<DBAuthType> | null>> {
    try {
        // Match permissions to edit other user or edit self
        // If this user has the permission to edit other user, then return the user
        const t = await matchPermissions(["user_edit", "user_edit_others"]);
        if (!t) return Response("error", null, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can only edit their own profile
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("user_edit_others")
            && (session?.user?.id !== id
                || !matches.includes("user_edit")))
            return Response("error", null, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", null, 401, "You don't have the permission to edit users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const user = await user_collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" });

        return Response("success", user);
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Create a new user
 * May be created by an operator or by the user themselves through the signup page
 * If the user is created by an operator, then the user will be created with the status "active"
 * If the user is created by the user themselves, then the user will be created with the status "pending"
 * Also the user will be created with the role "user" and a payload of created user will be received through
 * parameter of this function
 */
export async function createUser(
    user: Partial<DBAuthType>
): Promise<ServerFunctionResponse<WithId<DBAuthType> | null>> {
    try {
        // Match permissions to get if the user has the permission to create user
        // If the user has the permission to create user, then create the user as active
        const t = await matchPermissions(["user_add"]);
        const { session, isMatched, matches } = t!;
        const isCreatedFromOperator = matches.includes("user_add");

        const client = await clientPromise;
        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        if (!user.email || user.email === "") return Response("error", null, 400, "Email is required");

        // Create a new user object
        const new_user: DBAuthType = {
            ...user as DBAuthType,
            roles: ["user", ...(user.roles || [])],
            status: user.status || (isCreatedFromOperator ? "active" : "pending"),
            createdAt: user.createdAt || new Date(),
        };

        // If user exists, then update the user
        // If user doesn't exist, then create a new user
        const result = await user_collection.updateOne({ email: user.email }, { $set: new_user }, { upsert: true });

        // Get the user from the database
        const created_user = await user_collection.findOne({
            $or: [
                { _id: result.upsertedId! },
                { email: user.email },
            ]
        });

        return Response("success", created_user);

    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

/**
 * Delete a user by their ID
 * Only an operator can delete a user, but they can not delete themselves
 */
export async function deleteUsersByID(
    ids: string[],
    path?: string,
): Promise<ServerFunctionResponse<boolean>> {
    try {
        // Match permissions to get if the user has the permission to delete user
        // If the user has the permission to delete user, then delete the user
        const t = await matchPermissions(["user_delete"]);
        if (!t) return Response("error", false, 401, "You don't have the permission to delete users");
        const { session, isMatched, matches } = t;

        // If user doesn't have the permission to delete other user, then return error
        if (!matches.includes("user_delete")) return Response("error", false, 401, "You don't have the permission to delete users");

        // If trying to delete self, then return error
        if (ids.includes(session?.user?.id)) return Response("error", false, 401, "You can not delete yourself");

        // If there is no match, then the user doesn't have the permission to delete any user including self.
        if (!isMatched) return Response("error", false, 401, "You don't have the permission to delete users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const result = await user_collection.deleteMany({ _id: { $in: ids.map(id => new ObjectId(id)) } });

        if (path) revalidatePath(path, "page");
        return Response("success", result.deletedCount > 0);
    } catch (error) {
        console.error(error);
        return Response("error", false, 500, "Internal server error");
    }
}

/**
 * Change the visibility of a user by their ID
 * Only an operator can change the visibility of a user, but they can not change the visibility of themselves
 * 
 * active | pending | inactive | blocked
 */
export async function changeVisibilityOfUsersByID(
    ids: string[],
    visibility: "active" | "pending" | "inactive" | "blocked",
    path?: string,
): Promise<ServerFunctionResponse<boolean>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["user_edit_others"]);
        if (!t) return Response("error", false, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If trying to edit self, then return error
        if (ids.includes(session?.user?.id)) return Response("error", false, 401, "You can not edit yourself");

        // If the user is not an operator, then they can not change visibility of any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("user_edit_others"))
            return Response("error", false, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", false, 401, "You don't have the permission to edit users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const result = await user_collection.updateMany(({
            _id: {
                $in: ids.map(id => new ObjectId(id))
            }
        }), ({
            $set: {
                status: visibility
            }
        }));

        if (path) revalidatePath(path, "page");
        return Response("success", result.modifiedCount === 1);
    } catch (error) {
        console.error(error);
        return Response("error", false, 500, "Internal server error");
    }
}

/**
 * Assign roles to users by their ID
 * Only an operator can assign roles to users, but they can not assign roles to themselves
 */
export async function assignRolesToUsersByID(
    ids: string[],
    roles: string[],
    path?: string,
): Promise<ServerFunctionResponse<boolean>> {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["user_edit_others"]);
        if (!t) return Response("error", false, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If trying to edit self, then return error
        if (ids.includes(session?.user?.id)) return Response("error", false, 401, "You can not edit yourself");

        // If the user is not an operator, then they can not assign roles to any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("user_edit_others"))
            return Response("error", false, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", false, 401, "You don't have the permission to edit users");

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");
        const roles_collection = db.collection<roleType>("roles");

        // Check if the roles exist and if they exist, then get the roles
        const rolesExist = await roles_collection.find({ name: { $in: roles }, status: 'active' }).toArray();
        if (rolesExist.length !== roles.length) return Response("error", false, 400, "Some roles don't exist");

        // Reorder the roles
        roles = rolesExist.sort((a, b) => a.rank - b.rank).map(role => role.name);

        const result = await user_collection.updateMany(({
            _id: {
                $in: ids.map(id => new ObjectId(id))
            }
        }), ({
            $push: {
                roles: {
                    $each: roles
                }
            }
        }));

        if (path) revalidatePath(path, "page");
        return Response("success", result.modifiedCount === 1);
    } catch (error) {
        console.error(error);
        return Response("error", false, 500, "Internal server error");
    }
}
