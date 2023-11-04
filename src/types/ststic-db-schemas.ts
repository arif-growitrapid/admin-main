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

export const schemaTypesAvailable = [
    "number",
    "string",
    "long-string",
    "rich-text",
    "boolean",
    "time",
    "date",
    "datetime",
    ...otherTypes.map((v) => v.type),
] as const;

// export type StaticDBSchemaType = {
//     // For All
//     id: string;
//     name: string;
//     type: typeof schemaTypesAvailable[number];
//     default?: string | number | boolean | Date | string[] | number[] | boolean[] | Date[] | null;
//     required?: boolean;
//     unique?: boolean;

//     // For Number, Time, Date, DateTime
//     min?: number;
//     max?: number;

//     // For String, Long String, Rich Text
//     min_length?: number;
//     max_length?: number;

//     // For File
//     file_types?: string[];
//     max_size?: number;

//     // For Select, Multi Select
//     options?: {
//         id: string;
//         name: string;
//     }[];

//     // For User
//     // For Reference
//     collection_id?: string;

//     // For Object
//     schema?: StaticDBSchemaType;

//     // For Array
//     of?: StaticDBSchemaType;
// };

const schemaTypes = [
    { // Number
        type: 'number' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: 0,
        required: true,
        unique: true,

        // Optional Fields
        min: 0,
        max: 100,
    },
    { // String
        type: 'string' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,

        // Optional Fields
        min_length: 0,
        max_length: 100,
    },
    { // Long String
        type: 'long-string' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,

        // Optional Fields
        min_length: 0,
        max_length: 100,
    },
    { // Rich Text
        type: 'rich-text' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,

        // Optional Fields
        min_length: 0,
        max_length: 100,
    },
    { // Boolean
        type: 'boolean' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: false,
        required: true,
        unique: true,
    },
    { // Time
        type: 'time' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: new Date(),
        required: true,
        unique: true,

        // Optional Fields
        min: new Date().getTime(),
        max: new Date().getTime() + 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    { // Date
        type: 'date' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: new Date(),
        required: true,
        unique: true,

        // Optional Fields
        min: new Date().getDate(),
        max: new Date().getDate() + 30, // 30 days
    },
    { // DateTime
        type: 'datetime' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: new Date(),
        required: true,
        unique: true,

        // Optional Fields
        min: new Date().getTime(),
        max: new Date().getTime() + 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    { // User
        type: 'user' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,
    },
    { // Reference
        type: 'reference' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,

        // Optional Fields
        collection_id: 'string',
    },
    { // File
        type: 'file' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,

        // Optional Fields
        default_url: 'string',
        file_types: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
        max_size: 1000000, // 1 MB
    },
    { // Select
        type: 'select' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: '',
        required: true,
        unique: true,

        // Optional Fields
        options: [
            {
                id: 'string',
                name: 'string',
            }
        ],
    },
    { // Multi Select
        type: 'multiselect' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: [{ id: 'string', name: 'string' }],
        required: true,
        unique: true,

        // Optional Fields
        options: [
            {
                id: 'string',
                name: 'string',
            }
        ],
    },
    { // Object
        type: 'object' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: {},
        required: true,
        unique: true,

        // Optional Fields
        // schema: {} as StaticDBSchemaType,
    },
    { // Array
        type: 'array' as const,

        // Required Fields for all schemas
        id: 'string',
        name: 'string',
        default: [],
        required: true,
        unique: true,

        // Optional Fields
        of: {},
    },
];

type schemaTypesType = typeof schemaTypes[number] & {
    of?: typeof schemaTypes[number];
}

const S: typeof schemaTypes = [
    {
        type: "array",

        // Required Fields for all schemas
        id: "string",
        name: "string",
        default: [],
        required: true,
        unique: true,

        // Optional Fields
        of: {}
    }
]

export type StaticDBSchemaType = typeof schemaTypes[number];

export default schemaTypes;
