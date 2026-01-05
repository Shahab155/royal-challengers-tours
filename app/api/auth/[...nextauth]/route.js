import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [rows] = await db.query(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [credentials.email]
        );

        const admin = rows[0];
        if (!admin) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],

  // 🔑 THESE TWO LINES ARE REQUIRED
  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;
