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
    name: string;
    description: string;
    icon: string;
    _version: number;
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
    }
] as const;

export const schemaTypes = [
    "number",
    "string",
    "long-string",
    "boolean",
    "time",
    "date",
    "datetime",
    ...otherTypes.map((v) => v.type),
] as const;

export type StaticDBSchemaType = {
    // For All
    type: typeof schemaTypes[number];
    default?: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | null;
    required?: boolean;
    unique?: boolean;

    // For Number, Time, Date, DateTime
    min?: number;
    max?: number;

    // For String, Long String
    min_length?: number;
    max_length?: number;

    // For File
    default_url?: string;
    file_types?: string[];
    max_size?: number;

    // For Select, Multi Select
    options?: string[];

    // For User
    // For Reference
    collection_id?: string;

    // For Object
    schema?: StaticDBSchemaType;

    // For Array
    of?: StaticDBSchemaType;
};

export type StaticDBDataType = {

};
