"use server";

import clientPromise from "@/db/db";
import { matchPermissions } from "./auth";
import { Response } from "./functions";
import config from "@/config";
import { StaticDBSchemaType } from "@/types/static-db";
import { revalidatePath } from "next/cache";


export async function createStaticDB(
    data: {
        name: string; // Name of the collection
        description: string; // Description of the collection
        icon: string; // Icon of the collection
        version: number; // Version of the collection
        is_active: boolean; // Is the collection active
        schema: StaticDBSchemaType; // Schema of the collection
    },
    path?: string // Revalidation path
) {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["manage_static_database"]);
        if (!t) return Response("error", false, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not promote/demote any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("manage_static_database"))
            return Response("error", false, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", false, 401, "You don't have the permission to edit users");

        const client = await clientPromise;
        const db = client.db(config.db.static_db_name);
        
        // Check if the collection already exists
        const do_collection_exists = await db.collection(data.name).findOne({});

        // If the collection already exists, then return error
        if (do_collection_exists) return Response("error", null, 400, "Collection already exists");

        // Create the collection
        const collection = await db.createCollection(data.name);

        // Create a document in the collection to store the collection's information
        await collection.insertOne({
            id: "collection_info",
            name: data.name,
            description: data.description,
            icon: data.icon,
            _version: data.version,
            _is_active: data.is_active,
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            _createdBy: session.user.id,
            _updatedBy: session.user.id,
            _schema: data.schema
        });

        // If the path is provided, then revalidate the path
        if (path) revalidatePath(path);
        // Return success
        return Response("success", null, 200, "Collection created successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}
