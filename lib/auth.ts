import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { User } from "next-auth";

// Diagnostic logging
console.log("[Auth] NEXTAUTH_SECRET configured:", process.env.NEXTAUTH_SECRET ? "Yes" : "No");
console.log("[Auth] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("[Auth] Database URL configured:", process.env.DATABASE_URL ? "Yes" : "No");

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth] Attempting login for:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: String(credentials.email) },
          });
          
          console.log("[Auth] User found in database:", user ? "Yes" : "No");
          if (user) {
            console.log("[Auth] User ID:", user.id);
            console.log("[Auth] User email:", user.email);
            console.log("[Auth] User role:", user.role);
            console.log("[Auth] User has password:", user.password ? "Yes" : "No");
          }

          if (!user || !user.password) {
            console.log("[Auth] User not found or no password");
            return null;
          }

          const isValid = await bcrypt.compare(
            String(credentials.password),
            user.password
          );
          
          console.log("[Auth] Password valid:", isValid ? "Yes" : "No");

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Database error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
