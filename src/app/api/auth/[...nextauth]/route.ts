import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authentication";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user?: {
            id?: string;
            email?: string;
            role?: string;
        };
    }

    interface User {
        id: string;
        email: string;
        role: string;
        accessToken?: string;
        expires?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        expires?: number;
        id?: string;
        email?: string;
        role?: string;
    }
}


const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
