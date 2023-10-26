import { ObjectId } from "mongodb";
import { PermissionsArrayType } from "./permissions";

export interface DBAuthType {
    _id: ObjectId | string;
    id: string;
    roles: string[];
    is_employee: boolean;
    status: "active" | "inactive" | "blocked" | "pending";
    createdAt: Date;

    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    emailVerified: Date | boolean | null;

    dob: Date | null;
    gender?: 'male' | 'female' | 'other' | 'not-specified';
    phone?: PhoneType;
    extraEmails?: string[];
    extraPhones?: PhoneType[];
    addresses?: AddressType[];
    socialProfiles?: SocialProfileType[];
    savedContent?: SavedContentType[];
}

export interface AuthType {
    _id: ObjectId | string;
    id: string;
    roles: string[] & defaultRoles[];
    is_employee: boolean;
    status: "active" | "inactive" | "blocked" | "pending";
    createdAt: Date;

    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    emailVerified: Date | boolean | null;

    dob: Date | null;
    gender?: 'male' | 'female' | 'other' | 'not-specified';
    phone?: PhoneType;
    extraEmails?: string[];
    extraPhones?: PhoneType[];
    addresses?: AddressType[];
    socialProfiles?: SocialProfileType[];
    savedContent?: SavedContentType[];

    permissions?: PermissionsType;
}

export interface MinAuthType {
    id: string;
    roles: string[] & defaultRoles[];
    is_employee: boolean;
    status: "active" | "inactive" | "blocked" | "pending";
    createdAt: Date;

    name: string | null;
    email: string;
    image: string | null;
    emailVerified: Date | boolean | null;
};

export type defaultRoles = "user" | "operator";

export type PermissionsType = {
    [key in PermissionsArrayType]?: boolean;
}

export interface roleType {
    _id: ObjectId | string;
    name: string | defaultRoles;
    description: string;
    rank: number;
    permissions: PermissionsArrayType[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    status: "active" | "inactive";
}

export interface PhoneType {
    countryCode: string;
    number: string;
    verified: boolean;
}

export interface AddressType {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface SocialProfileType {
    name: string;
    url: string;
};

export interface SavedContentType {
    ref: string;
    type: "post" | "course" | "service" | string;
    createdAt: Date;
};
