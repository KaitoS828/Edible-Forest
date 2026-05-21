import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json() as {
    name: string; email: string; subject: string; message: string;
  };

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  try {
    await createInquiry({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
