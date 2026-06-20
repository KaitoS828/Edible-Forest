import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { getUser, getApprovedOwnerFacilities } from "@/lib/firestore";
import { can } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value ?? "";

  let uid = "";
  let userDoc: Awaited<ReturnType<typeof getUser>> = null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
    userDoc = await getUser(uid);
  } catch {
    /* 未ログイン */
  }

  if (!uid) return <Gate message="イベントの登録にはログインが必要です。" cta={{ href: "/login?callbackUrl=/member/new-event", label: "ログイン" }} />;
  if (!can(userDoc?.memberType, "create_event")) {
    return <Gate message="イベントの登録は開催会員以上の方のみご利用いただけます。" cta={{ href: "/member/dashboard", label: "マイページへ" }} />;
  }

  const facilities = (await getApprovedOwnerFacilities(uid)).map((f) => ({ id: f.id, name: f.name }));

  const EventForm = (await import("./EventForm")).default;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7FAF7" }}>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <a href="/member/dashboard" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#1A2B1E" }}>← マイページに戻る</a>
        </div>
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          イベントの開催を申請
        </h1>
        <EventForm
          user={{ displayName: userDoc?.displayName ?? "メンバー", operatingBodyName: userDoc?.operatingBodyName }}
          facilities={facilities}
        />
      </main>
    </div>
  );
}

function Gate({ message, cta }: { message: string; cta: { href: string; label: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F7FAF7" }}>
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
        <h1 className="text-xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          イベント登録
        </h1>
        <p className="text-sm mb-6" style={{ color: "#1A2B1E", lineHeight: "1.9" }}>{message}</p>
        <a
          href={cta.href}
          className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#3C6B4F" }}
        >
          {cta.label}
        </a>
      </div>
    </div>
  );
}
