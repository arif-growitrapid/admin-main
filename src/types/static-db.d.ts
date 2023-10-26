

export type StaticDBCollectionType = {
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
    tables: StaticDBTableType[];
};

const types = [
    "number",
    "string",
    "long-string",
    "boolean",
    "time",
    "date",
    "datetime",
    "user",
    "reference",
    "reference-list",
    "file",
    "file-list",
    "select",
    "multiselect"
] as const;

export type StaticDBSchemaType = {
    [key: string]: typeof types[number] | StaticDBSchemaType | StaticDBSchemaType[];
};

export type StaticDBDataType = {
    [key: string]: string | number | boolean | Date
    // Reference
    | { ref: string; }
    // Reference List
    | { ref: string; }[]
    // File
    | { url: string; }
    // File List
    | { url: string; }[]
    // Select
    | {
        options: string[];
        selected: string;
    }
    // Multi Select
    | {
        options: string[];
        selected: string[];
    }
    | StaticDBDataType | StaticDBDataType[];
};

export type StaticDBTableType = {
    _id: string;
    _createdAt: string;
    _updatedAt: string;
    _createdBy: string;
    _updatedBy: string;

    data: StaticDBDataType;
    draft: StaticDBDataType;
};

