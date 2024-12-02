import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Credenciais recebidas:", credentials);
                const res = await fetch(`${process.env.NEXT_BACKEND_URL}/authentication/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                });
                const data = await res.json();
                console.log("RESPOSTAS");
                console.log(data);
                if (res.ok && data.token) {
                    const decodedToken = jwt.decode(data.token) as {
                        exp: number;
                        id: string;
                        email: string;
                        role: string;
                    };
                    return {
                        id: decodedToken.id,
                        email: decodedToken.email,
                        role: decodedToken.role,
                        accessToken: data.token,
                        expires: decodedToken.exp * 1000,
                    };
                }

                return null;
            },
        })
    ],
    pages: {
        signIn: '/account/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.expires = user.expires;
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
            }

            if (token.expires && Date.now() > token.expires) {
                const res = await fetch(`${process.env.NEXT_BACKEND_URL}/authentication/refresh-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: token.accessToken,
                    }),
                });

                const data = await res.json();
                if (res.ok && data.token) {
                    const decodedToken = jwt.decode(data.token) as { id: string; email: string; exp: number };
                    token.accessToken = data.token;
                    token.expires = decodedToken.exp * 1000;
                    token.id = decodedToken.id;
                    token.role = user.role;
                    token.email = decodedToken.email;
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user = {
                id: token.id as string,
                email: token.email as string,
                role: token.role as string,
            };
            return session;
        }
    }
};