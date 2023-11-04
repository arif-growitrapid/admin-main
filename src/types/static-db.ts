/**
 * Static DB Types
 * All necessory settings for Static DB with types.
 * 
 * @development
 * 
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */

import { ObjectId } from "mongodb";

/**
 * A Static DB Schema is a JSON object that defines the structure of the data.
 * It is used to create a new Static DB Collection and to validate the data.
 * 
 * @example An example of a Static DB Schema for testimonials
 * {
 *      "name": "string",
 *      "description": "long-string",
 *      "designation": "string",
 *      "image": "file",
 *      "user": "user",
 *      "rating": "number",
 *      "createdAt": "date",
 *      "updatedAt": "datetime",
 *      "isFeatured": "boolean",
 *      "isPublished": "boolean",
 * }
 */

export type StaticDBCollectionType = {
    _id: string | ObjectId;
    collection_id: string;
    name: string;
    description: string;
    icon: string;
    _version: number;
    isCollection: boolean;
    _is_active: boolean;

    _createdAt: string;
    _updatedAt: string;
    _createdBy: string;
    _updatedBy: string;

    _schema: StaticDBSchemaType;
    documents: StaticDBDocumentType[];
};

export type StaticDBDocumentType = {
    _id: string;
    _createdAt: string;
    _updatedAt: string;
    _createdBy: string;
    _updatedBy: string;

    data: StaticDBDataType;
    draft: StaticDBDataType;
};

const otherTypes = [
    {
        type: "user",
    },
    {
        type: "reference",
        collection_id: "string",
    },
    {
        type: "file",
        default_url: "string",
        file_types: [] as string[],
        max_size: "number",
    },
    {
        type: "select",
        options: [] as string[],
        default: "string",
    },
    {
        type: "multiselect",
        options: [] as string[],
        default: [] as string[],
    },
    {
        type: "array",
        of: {} as StaticDBSchemaType,
    }
] as const;

export const schemaTypes = [
    "number",
    "string",
    "long-string",
    "rich-text",
    "boolean",
    // "time",
    "date",
    // "datetime",
    ...otherTypes.map((v) => v.type),
] as const;

export type StaticDBSchemaType = {
    // For All
    id: string;
    name: string;
    type: typeof schemaTypes[number];
    default?: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | null;
    required?: boolean;
    unique?: boolean;

    // For Number, Time, Date, DateTime
    min?: number;
    max?: number;

    // For String, Long String, Rich Text
    min_length?: number;
    max_length?: number;

    // For File
    file_types?: string[];
    max_size?: number;

    // For Select, Multi Select
    options?: {
        id: string;
        name: string;
    }[];

    // For User
    // For Reference
    collection_id?: string;

    // For Object
    schema?: StaticDBSchemaType;

    // For Array
    of?: StaticDBSchemaType;
};

export type StaticDBDataType = {
    id: string;
    name: string;
    type: typeof schemaTypes[number];
    value: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | null;
};

export function createDefaultSchemaFromType(type: typeof schemaTypes[number], name: string): StaticDBSchemaType {
    const id = name.toLowerCase().replace(/ /g, "-");

    switch (type) {
        case "number":
            return {
                id: id,
                name: name,
                type: "number",
                default: 0,
                required: false,
                unique: false,
                min: 0,
                max: 100,
            };

        case "string":
            return {
                id: id,
                name: name,
                type: "string",
                default: "",
                required: false,
                unique: false,
                min_length: 0,
                max_length: 100,
            };

        case "long-string":
            return {
                id: id,
                name: name,
                type: "long-string",
                default: "",
                required: false,
                unique: false,
                min_length: 0,
                max_length: 1000,
            };

        case "rich-text":
            return {
                id: id,
                name: name,
                type: "rich-text",
                default: "",
                required: false,
                unique: false,
                min_length: 0,
                max_length: 1000,
            };

        case "boolean":
            return {
                id: id,
                name: name,
                type: "boolean",
                default: false,
                required: false,
                unique: false,
            };

        // case "time":
        //     return {
        //         id: id,
        //         name: name,
        //         type: "time",
        //         default: new Date(),
        //         required: false,
        //         unique: false,
        //         min: 0,
        //         max: 100,
        //     };

        case "date":
            return {
                id: id,
                name: name,
                type: "date",
                default: new Date(),
                required: false,
                unique: false,
                min: new Date().getTime(),
                max: new Date().getTime() + 100 * 24 * 60 * 60 * 1000, // 100 days
            };

        // case "datetime":
        //     return {
        //         id: id,
        //         name: name,
        //         type: "datetime",
        //         default: new Date(),
        //         required: false,
        //         unique: false,
        //         min: 0,
        //         max: 100,
        //     };

        case "reference":
            return {
                id: id,
                name: name,
                type: "reference",
                default: "",
                required: false,
                unique: false,
                collection_id: "",
            };

        case "user":
            return {
                id: id,
                name: name,
                type: "user",
                default: "",
                required: false,
                unique: false,
            };

        case "file":
            return {
                id: id,
                name: name,
                type: "file",
                default: "",
                required: false,
                unique: false,
                file_types: [],
                max_size: 10 * 1024, // 10 MB
            };

        case "select":
            return {
                id: id,
                name: name,
                type: "select",
                default: "",
                options: [],
                required: false,
                unique: false,
            };

        case "multiselect":
            return {
                id: id,
                name: name,
                type: "multiselect",
                default: [],
                options: [],
                required: false,
                unique: false,
            };

        case "array":
            return {
                id: id,
                name: name,
                type: "array",
                of: {
                    id: "",
                    name: "",
                    type: "string",
                },
                required: false,
                unique: false,
            };
    }
}

export function validateSchema(schema: StaticDBSchemaType): boolean {
    // schema must be an object
    if (typeof schema !== "object") return false;

    // schema must have a type & have a valid type
    if (!schema.type || typeof schema.type !== "string") return false;
    if (!schemaTypes.includes(schema.type)) return false;

    switch (schema.type) {
        case "reference":
            // schema must have a collection_id & have a valid collection_id
            if (!schema.collection_id || typeof schema.collection_id !== "string") return false;
            break;

        case "file":
            if (!schema.default || typeof schema.default !== "string") return false;
            if (!schema.file_types || !Array.isArray(schema.file_types)) return false;
            if (schema.file_types.length === 0) return false;
            if (schema.max_size && typeof schema.max_size !== "number") return false;
            break;

        case "select":
            if (!schema.options || !Array.isArray(schema.options)) return false;
            if (schema.options.length < 2) return false;
            if (schema.default && typeof schema.default !== "string") return false;
            break;

        case "multiselect":
            if (!schema.options || !Array.isArray(schema.options)) return false;
            if (schema.options.length < 2) return false;
            if (schema.default && !Array.isArray(schema.default)) return false;
            break;

        case "array":
            if (!schema.of || typeof schema.of !== "object") return false;
            if (!validateSchema(schema.of)) return false;
            break;
    }

    return true;
}

export function getEmptyFieldFromSchema(schema: StaticDBSchemaType): StaticDBDataType {
    switch (schema.type) {
        case "number":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || 0,
            };

        case "string":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "long-string":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "rich-text":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "boolean":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || false,
            };

        // case "time":
        //     return {
        //         id: schema.id,
        //         name: schema.name,
        //         type: schema.type,
        //         value: schema.default || new Date(),
        //     };

        case "date":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || new Date(),
            };

        // case "datetime":
        //     return {
        //         id: schema.id,
        //         name: schema.name,
        //         type: schema.type,
        //         value: schema.default || new Date(),
        //     };

        case "reference":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "user":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "file":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "select":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || "",
            };

        case "multiselect":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: schema.default || [],
            };

        case "array":
            return {
                id: schema.id,
                name: schema.name,
                type: schema.type,
                value: [],
            };
    }
}

export function getEmptyDocumentFromSchema(schema: StaticDBSchemaType[]): StaticDBDataType[] {
    return schema.map((schema) => getEmptyFieldFromSchema(schema));
}
