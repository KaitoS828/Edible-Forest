import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { adminAuth } from "@/lib/firebase-admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "メールアドレス", type: "email" },
        password: { label: "パスワード",     type: "password" },
      },
      async authorize(credentials) {
        const email    = credentials?.email    as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Firebase Auth REST API でメアド＋パスワード検証
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
          }
        );
        if (!res.ok) return null;

        const { idToken, localId } = await res.json();

        // Custom Claim { admin: true } を確認
        const decoded = await adminAuth.verifyIdToken(idToken);
        if (!decoded.admin) return null;

        return { id: localId, email, name: decoded.name ?? "管理者" };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
});
