import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authentication";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user?: {
            id?: string;
            email?: string;
        };
    }

    interface User {
        id: string;
        email: string;
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
    }
}


const handler = NextAuth(authOptions);

console.log(process.env.NEXTAUTH_SECRET);

export { handler as POST, handler as GET };
