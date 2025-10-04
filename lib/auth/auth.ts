// src/auth.ts (yoki mos joyingiz)
// NextAuth v5 (App Router) uchun

import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User as NextAuthUser, Account, Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

import { connectToDb } from "@/lib/db";
import User from "@/models/User";

// (ixtiyoriy) bir marta ulab qo'yish; callbacks ichida ham chaqiramiz
connectToDb();

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: { params: { scope: "read:user user:email" } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDb();

        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;

        await User.findOneAndUpdate(
          { email: user.email },
          { $set: { lastLogin: new Date() } }
        );

        // NOTE: credentials provider qaytargan id keyin JWT da token.id bo'lib kelishi mumkin,
        // lekin biz baribir callbacks'da Mongo `_id`ni yozib qo'yamiz.
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        } as NextAuthUser;
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/error",
  },

  callbacks: {
    // JWT ichiga Mongo `_id` ni `token.uid` sifatida yozamiz
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      // Birinchi kirishda `user` bo'ladi: email orqali DB'dan `_id` topamiz
      if (user?.email) {
        await connectToDb();
        const dbUser = await User.findOne({ email: user.email }).select("_id");
        if (dbUser) token.uid = dbUser._id.toString();
      }

      // Keyingi requestlarda `user` bo'lmaydi; `token.uid` bo'lmasa, token.email orqali topamiz
      if (!token.uid && token.email) {
        await connectToDb();
        const dbUser = await User.findOne({ email: token.email }).select("_id");
        if (dbUser) token.uid = dbUser._id.toString();
      }

      return token;
    },

    // Session'ga `session.user.id` = Mongo `_id`
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { uid?: string };
    }) {
      if (session.user) {
        session.user.id = (token.uid as string) || session.user.id;
      }
      return session;
    },

    // OAuth loginlarda user create/update oqimi
    async signIn({
      user,
      account,
      profile,
    }: {
      user: NextAuthUser;
      account: Account | null;
      profile?: Profile;
    }) {
      try {
        if (account?.provider === "credentials") return true;

        await connectToDb();

        // Ba'zi OAuth providerlar email bermasligi mumkin — placeholder bilan to'ldiramiz
        if (!user.email) {
          if (account?.provider === "github" && profile && "login" in profile) {
            const gh = profile as { login: string };
            user.email = `${gh.login}@github.placeholder.com`;
          } else {
            user.email = `user-${Date.now()}@placeholder.com`;
          }
        }

        const existingUser = await User.findOne({
          $or: [
            { email: user.email },
            account?.providerAccountId
              ? {
                  providerAccountId: account.providerAccountId,
                  provider: account.provider,
                }
              : {},
          ],
        });

        if (!existingUser) {
          const newUser = new User({
            name: user.name || "Anonymous User",
            email: user.email,
            image: user.image,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            createdAt: new Date(),
          });
          await newUser.save();
        } else {
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                lastLogin: new Date(),
              },
            }
          );
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// App Router uchun helperlar
export const { auth, signIn, signOut } = NextAuth(authOptions);
export default NextAuth(authOptions);
