
import NextAuth, { AuthOptions, ISODateString } from "next-auth"
import { nextAuthOptions } from "./authOptions";
import { AuthType } from "@/types/auth";

declare module "next-auth" {
    interface Session {
        user: AuthType;
        expires: ISODateString
    }
}

const handler = NextAuth(nextAuthOptions);
export {
    handler as GET,
    handler as POST,
}
