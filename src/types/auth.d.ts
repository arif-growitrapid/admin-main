
export interface AuthType {
    id: string;
    role: number;
    status: number;
    createdAt: Date;

    name: string | null;
    email: string;
    image: string | null;
    emailVerified: Date | null;

    phoneNumber?: string;
}
