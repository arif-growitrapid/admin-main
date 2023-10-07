"use server";

import config from "@/config";
import clientPromise from "@/db/db";
import { DBAuthType } from "@/types/auth";
import { ObjectId, WithId } from "mongodb";
import { matchPermissions } from "./auth";
import { User } from "next-auth";

/**
 * Get a user by their ID
 */
export async function getUserByID(id: string): Promise<WithId<DBAuthType> | null> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return null;
        const { session, isMatched, matches } = t;

        if (!isMatched) return null;

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const user = await user_collection.findOne({ id });

        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Get users by their role
 */
export async function getUsersByRole(role: string): Promise<WithId<DBAuthType>[] | null> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return null;
        const { session, isMatched, matches } = t;

        if (!isMatched) return null;

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const users = await user_collection.find({ roles: role }).toArray();

        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Search for users by name, email, phone, etc.
 */
export async function searchForUser(
    query: string,
    limit: number = 10,
    skip: number = 0,
): Promise<WithId<DBAuthType>[] | null> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return null;
        const { session, isMatched, matches } = t;

        if (!isMatched) return null;

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

        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Filter users by any field
 */
export async function filterUsers(
    filter: Partial<DBAuthType>,
    limit: number = 10,
    skip: number = 0,
): Promise<DBAuthType[] | null> {
    try {
        // Match permissions to view user
        // If the user has the permission to view user, then return the user
        const t = await matchPermissions(["user_view"]);
        if (!t) return null;
        const { session, isMatched, matches } = t;

        if (!isMatched) return null;

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const users = (await user_collection.find(filter).skip(skip).limit(limit).toArray()).map(user => ({
            ...user,
            _id: user._id.toString(),
        }));

        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Update a user by their ID
 */
export async function updateUserByID(
    id: string,
    update: Partial<DBAuthType>,
): Promise<WithId<DBAuthType> | null> {
    try {
        // Match permissions to edit other user or edit self
        // If this user has the permission to edit other user, then return the user
        const t = await matchPermissions(["user_edit", "user_edit_others"]);
        if (!t) return null;
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can only edit their own profile
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("user_edit_others")
            && (session?.user?.id !== id
                || !matches.includes("user_edit")))
            return null;

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return null;

        const client = await clientPromise;

        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        const user = await user_collection.findOneAndUpdate({ id }, { $set: update }, { returnDocument: "after" });

        return user;
    } catch (error) {
        console.error(error);
        return null;
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
    user: Partial<DBAuthType>,
    isCreatedFromOperator: boolean = false,
): Promise<WithId<DBAuthType> | null | {
    error: string;
    status: number;
    data: WithId<DBAuthType> | null;
}> {
    try {
        const client = await clientPromise;
        const db = client.db(config.db.auth_name);
        const user_collection = db.collection<DBAuthType>("users");

        if (!user.email || user.email === "") return {
            error: "Email is required",
            status: 400,
            data: null,
        };

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

        return created_user;

    } catch (error) {
        console.error(error);
        return {
            error: "Internal server error",
            status: 500,
            data: null,
        };
    }
}
