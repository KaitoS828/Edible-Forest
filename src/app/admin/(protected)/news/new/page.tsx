import NewsForm from "../NewsForm";

export default function AdminNewNewsPage() {
  return (
    <div>
      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          New news
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          ニュースを作成
        </h1>
      </div>

      <NewsForm
        mode="new"
        initialData={{
          title: "",
          date: new Date().toISOString().slice(0, 10),
          label: "",
          href: "",
          category: "ニュース",
          imageUrl: "",
          body: "",
          status: "draft",
          active: true,
        }}
      />
    </div>
  );
}
