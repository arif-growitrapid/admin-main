"use server";

import clientPromise from "@/db/db";
import { matchPermissions } from "./auth";
import { Response } from "./functions";
import config from "@/config";
import { StaticDBSchemaType, getEmptyDocumentFromSchema, schemaTypes, validateSchema } from "@/types/static-db";
import { revalidatePath } from "next/cache";

export async function createStaticDB(
    data: {
        name: string; // Name of the collection
        description: string; // Description of the collection
        icon: string; // Icon of the collection
        version: number; // Version of the collection
        isCollection: boolean; // Is the collection a collection or a document
        is_active: boolean; // Is the collection active
        schema: StaticDBSchemaType[]; // Schema of the collection
    },
    path?: string // Revalidation path
) {
    try {
        // Match permissions to get if the user has the permission to edit user
        // If the user has the permission to edit user, then edit the user
        const t = await matchPermissions(["static_database_view", "static_database_manage", "static_database_configuration_edit"]);
        if (!t) return Response("error", false, 401, "You don't have the permission to edit users");
        const { session, isMatched, matches } = t;

        // If the user is not an operator, then they can not promote/demote any user including self.
        // If the user is an operator, then they can edit any user's profile
        if (!matches.includes("static_database_configuration_edit"))
            return Response("error", false, 401, "You don't have the permission to edit users");

        // If there is no match, then the user doesn't have the permission to edit any user including self.
        if (!isMatched) return Response("error", false, 401, "You don't have the permission to edit users");

        // Validate the schema
        if (!Array.isArray(data.schema)) return Response("error", null, 400, "Schema must be an array");
        if (data.schema.length === 0) return Response("error", null, 400, "Schema must have at least one item");
        for (const schema of data.schema) {
            if (!validateSchema(schema)) return Response("error", null, 400, "Invalid schema");
        }

        const client = await clientPromise;
        const db = client.db(config.db.static_db_name);

        if (data.isCollection) {
            // Check if the collection already exists
            const do_collection_exists = await db.collection(data.name).findOne({});

            // If the collection already exists, then return error
            if (do_collection_exists) return Response("error", null, 400, "Collection already exists");

            const collection_id = data.name.replace(/ /g, "_").toLowerCase();

            // Create the collection
            const collection = await db.createCollection(collection_id);

            // Create a document in the collection to store the collection's information
            await collection.insertOne({
                id: "collection_info",
                collection_id: collection_id,
                name: data.name,
                description: data.description,
                icon: data.icon,
                _version: data.version,
                _isCollection: true,
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
        } else {
            // Get default document collection
            const default_document_collection = db.collection(config.db.default_document_collection_name);

            const collection_id = data.name.replace(/ /g, "_").toLowerCase();

            // Check if the collection already exists
            const do_collection_exists = await default_document_collection.findOne({ collection_id: collection_id });

            // If the collection already exists, then return error
            if (do_collection_exists) return Response("error", null, 400, "Collection already exists");

            // Add the document to the default document collection
            await default_document_collection.insertOne({
                collection_id: collection_id,
                name: data.name,
                description: data.description,
                icon: data.icon,
                _version: data.version,
                _isCollection: false,
                _is_active: data.is_active,
                _createdAt: new Date().toISOString(),
                _updatedAt: new Date().toISOString(),
                _createdBy: session.user.id,
                _updatedBy: session.user.id,
                _schema: data.schema,
                data: getEmptyDocumentFromSchema(data.schema)
            });

            // If the path is provided, then revalidate the path
            if (path) revalidatePath(path);

            // Return success
            return Response("success", null, 200, "Document created successfully");
        }
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getCollectionsInfo() {
    try {
        const client = await clientPromise;
        const db = client.db(config.db.static_db_name);

        // Get all the collections from static database
        const collections = (await db.listCollections().toArray()).filter((collection) => collection.name !== config.db.default_document_collection_name);

        // Get all documents from default document collection
        const default_document_collection = db.collection(config.db.default_document_collection_name);
        const documents = await default_document_collection.find({}).toArray();

        // Get the collections info
        const collections_info = await Promise.all(
            collections.map(async (collection) => {
                // Get the collection info
                const collection_info = await db.collection(collection.name).findOne({ id: "collection_info" });
                // Return the collection info
                return collection_info;
            })
        );

        // Get the documents info
        const documents_info = await Promise.all(
            documents.map(async (document) => ({
                id: document.collection_id,
                collection_id: document.collection_id,
                name: document.name,
                description: document.description,
                icon: document.icon,
                _version: document._version,
                _isCollection: document._isCollection,
                _is_active: document._is_active,
                _createdAt: document._createdAt,
                _updatedAt: document._updatedAt,
                _createdBy: document._createdBy,
                _updatedBy: document._updatedBy,
                _schema: document._schema,
            }))
        );

        // Return success
        return Response("success", [
            ...collections_info,
            ...documents_info
        ], 200, "Collections info fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}

export async function getCollectionInfo(name: string) {
    try {
        const client = await clientPromise;
        const db = client.db(config.db.static_db_name);

        // Check if asking for default document collection
        if (name === config.db.default_document_collection_name) return Response("error", null, 400, "Invalid collection name");

        // Get the collection info
        const collection_info = await db.collection(name).findOne({ id: "collection_info" });

        // If the collection doesn't exists, then return error
        if (!collection_info) return Response("error", null, 400, "Collection doesn't exists");

        // Return success
        return Response("success", collection_info, 200, "Collection info fetched successfully");
    } catch (error) {
        console.error(error);
        return Response("error", null, 500, "Internal server error");
    }
}
