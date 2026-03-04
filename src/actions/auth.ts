"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginWithCredentials(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn("credentials", {
      email:       formData.get("email")    as string,
      password:    formData.get("password") as string,
      redirectTo:  "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "メールアドレスまたはパスワードが正しくありません";
    }
    throw error; // リダイレクトはそのまま投げ直す
  }
  return null;
}
