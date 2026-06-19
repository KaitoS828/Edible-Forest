import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteSpot, updateSpot, type SpotDoc } from "@/lib/firestore";

interface Ctx {
  params: Promise<{ id: string }>;
}

function getOptionalString(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value : undefined;
}

function getOptionalBoolean(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "boolean" ? value : undefined;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return Boolean((session.user as Record<string, unknown>).isAdmin);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;
  const locale = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";
  const status: SpotDoc["status"] = body.status === "published" ? "published" : "draft";

  // lang=en の場合は translations.en にのみ保存
  const updateData = locale === "en"
    ? {
        translations: {
          en: {
            name: getOptionalString(body, "name") ?? "",
            sub: getOptionalString(body, "sub") ?? "",
            desc: getOptionalString(body, "desc") ?? "",
            content: getOptionalString(body, "content") ?? "",
            address: getOptionalString(body, "address") ?? "",
            capacity: getOptionalString(body, "capacity") ?? "",
            price: getOptionalString(body, "price") ?? "",
            access: getOptionalString(body, "access") ?? "",
          },
        },
        active: getOptionalBoolean(body, "active") ?? false,
        status,
        isOfficial: getOptionalBoolean(body, "isOfficial") ?? false,
      }
    : {
        name: getOptionalString(body, "name") ?? "",
        sub: getOptionalString(body, "sub") ?? "",
        region: getOptionalString(body, "region") ?? "",
        regionColor: getOptionalString(body, "regionColor") ?? "#3C6B4F",
        forestType: getOptionalString(body, "forestType") ?? "",
        desc: getOptionalString(body, "desc") ?? "",
        content: getOptionalString(body, "content") ?? "",
        img: getOptionalString(body, "img") ?? "",
        address: getOptionalString(body, "address") ?? "",
        capacity: getOptionalString(body, "capacity") ?? "",
        price: getOptionalString(body, "price") ?? "",
        access: getOptionalString(body, "access") ?? "",
        bookingUrl: getOptionalString(body, "bookingUrl") ?? "",
        active: getOptionalBoolean(body, "active") ?? false,
        status,
        isOfficial: getOptionalBoolean(body, "isOfficial") ?? false,
      };

  await updateSpot(id, updateData);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await deleteSpot(id);
  return NextResponse.json({ ok: true });
}
