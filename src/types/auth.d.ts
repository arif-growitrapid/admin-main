import { PermissionsArrayType } from "./permissions";

export interface DBAuthType {
    id: string;
    roles: string[];
    status: "active" | "inactive" | "blocked" | "pending";
    createdAt: Date;

    name: string | null;
    email: string;
    image: string | null;
    emailVerified: Date | boolean | null;

    dob: Date | null;
    gender?: 'male' | 'female' | 'other' | 'not-specified';
    phone?: PhoneType;
    extraEmails?: string[];
    extraPhones?: PhoneType[];
    addresses?: AddressType[];
    socialProfiles?: SocialProfileType[];
}

export interface AuthType {
    id: string;
    roles: string[] & defaultRoles[];
    status: "active" | "inactive" | "blocked";
    createdAt: Date;

    name: string | null;
    email: string;
    image: string | null;
    emailVerified: Date | boolean | null;

    dob: Date | null;
    gender?: 'male' | 'female' | 'other' | 'not-specified';
    phone?: PhoneType;
    extraEmails?: string[];
    extraPhones?: PhoneType[];
    addresses?: AddressType[];
    socialProfiles?: SocialProfileType[];

    permissions?: PermissionsType;
}

export interface MinAuthType {
    id: string;
    roles: string[] & defaultRoles[];
    status: "active" | "inactive" | "blocked";
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
    _id: string | defaultRoles;
    name: string;
    description: string;
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
