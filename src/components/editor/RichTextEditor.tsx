"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1800;
const IMAGE_QUALITY = 0.86;

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type UploadState = {
  active: boolean;
  message: string;
};

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function safeFileName(name: string) {
  return name.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
}

async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  if (scale === 1 && file.size <= MAX_UPLOAD_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", IMAGE_QUALITY);
  });
  if (!blob || blob.size >= file.size) return file;

  const base = safeFileName(file.name.replace(/\.[^.]+$/, ""));
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}

async function uploadViaAdminApi(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: data });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(typeof body?.error === "string" ? body.error : "内部APIアップロードに失敗しました");
  }
  const body = (await res.json()) as { url?: string };
  if (!body.url) throw new Error("アップロードURLを取得できませんでした");
  return body.url;
}

async function uploadViaFirebaseClient(file: File): Promise<string> {
  const storageRef = ref(storage, `editor/${Date.now()}_${safeFileName(file.name)}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください");
  }

  const prepared = await compressImage(file);
  if (prepared.size > MAX_UPLOAD_BYTES) {
    throw new Error(`画像サイズは${formatBytes(MAX_UPLOAD_BYTES)}までです。現在: ${formatBytes(prepared.size)}`);
  }

  try {
    return await uploadViaAdminApi(prepared);
  } catch (adminErr) {
    try {
      return await uploadViaFirebaseClient(prepared);
    } catch {
      throw adminErr instanceof Error ? adminErr : new Error("画像のアップロードに失敗しました");
    }
  }
}

function insertImage(editor: Editor, src: string) {
  const alt = window.prompt("画像の説明（alt）を入力できます。空欄でもOKです。") ?? "";
  editor.chain().focus().setImage({ src, alt }).run();
}

function ToolbarButton({
  active = false,
  disabled = false,
  children,
  title,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45"
      style={{
        borderColor: active ? "#0F172A" : "#CBD5E1",
        backgroundColor: active ? "#0F172A" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#334155",
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  uploading,
  onUploadFiles,
}: {
  editor: Editor;
  uploading: boolean;
  onUploadFiles: (files: FileList | File[]) => void;
}) {
  const imgInputRef = useRef<HTMLInputElement>(null);

  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("リンクURL", previousUrl ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function insertImageUrl() {
    const url = window.prompt("画像URL", "https://");
    if (!url?.trim()) return;
    insertImage(editor, url.trim());
  }

  return (
    <div className="border-b" style={{ borderColor: "#E5EAF0", backgroundColor: "#F8FAFC" }}>
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2">
        <ToolbarButton title="元に戻す" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </ToolbarButton>
        <ToolbarButton title="やり直す" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </ToolbarButton>

        <Separator />

        <ToolbarButton title="通常テキスト" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </ToolbarButton>
        <ToolbarButton title="見出し2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title="見出し3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>

        <Separator />

        <ToolbarButton title="太字" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="斜体" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton title="取り消し線" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </ToolbarButton>
        <ToolbarButton title="コード" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          Code
        </ToolbarButton>

        <Separator />

        <ToolbarButton title="箇条書き" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </ToolbarButton>
        <ToolbarButton title="番号付きリスト" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </ToolbarButton>
        <ToolbarButton title="引用" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </ToolbarButton>

        <Separator />

        <ToolbarButton title="リンク" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <ToolbarButton title="画像をアップロード" disabled={uploading} onClick={() => imgInputRef.current?.click()}>
          {uploading ? "Uploading" : "Image"}
        </ToolbarButton>
        <ToolbarButton title="画像URLで挿入" onClick={insertImageUrl}>
          URL
        </ToolbarButton>
        <ToolbarButton title="区切り線" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          HR
        </ToolbarButton>
      </div>

      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onUploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Separator() {
  return <div className="mx-1 h-6 w-px" style={{ backgroundColor: "#CBD5E1" }} />;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "本文を入力してください。見出し、画像、引用、リスト、リンク、Markdown貼り付けに対応しています。",
}: RichTextEditorProps) {
  const [dragging, setDragging] = useState(false);
  const [upload, setUpload] = useState<UploadState>({ active: false, message: "" });
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "cms-editor-image" },
      }),
      Markdown.configure({ html: true, transformPastedText: true }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[380px] prose prose-sm max-w-none p-5 focus:outline-none",
      },
      handlePaste(view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((file) => file.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        void handleUploadFiles(files);
        return true;
      },
      handleDrop(_view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) => file.type.startsWith("image/"));
        if (files.length === 0) return false;
        event.preventDefault();
        setDragging(false);
        void handleUploadFiles(files);
        return true;
      },
    },
  });

  async function handleUploadFiles(files: FileList | File[]) {
    if (!editor) return;
    const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;

    setError(null);
    setUpload({ active: true, message: images.length === 1 ? "画像をアップロードしています" : `${images.length}枚の画像をアップロードしています` });

    try {
      for (const file of images) {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "画像のアップロードに失敗しました");
    } finally {
      setUpload({ active: false, message: "" });
    }
  }

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <div className="space-y-2">
      <div
        className="relative overflow-hidden rounded-md border bg-white shadow-sm"
        style={{ borderColor: dragging ? "#0F172A" : "#DCE3EA" }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={() => setDragging(false)}
      >
        {editor && <Toolbar editor={editor} uploading={upload.active} onUploadFiles={handleUploadFiles} />}
        <EditorContent editor={editor} />

        {(dragging || upload.active) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm">
            <div className="rounded-md border bg-white px-5 py-4 text-center shadow-sm" style={{ borderColor: "#CBD5E1" }}>
              <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>
                {upload.active ? upload.message : "ここに画像をドロップ"}
              </p>
              <p className="mt-1 text-xs" style={{ color: "#64748B" }}>
                自動で軽量化して本文へ挿入します
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 border-t px-4 py-2 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "#E5EAF0", color: "#64748B", backgroundColor: "#F8FAFC" }}>
          <span>画像ドラッグ&ドロップ、貼り付け、URL挿入、Markdown貼り付けに対応</span>
          <span>画像は最大{formatBytes(MAX_UPLOAD_BYTES)}、自動圧縮</span>
        </div>
      </div>

      {error && (
        <div className="rounded-md border px-3 py-2 text-xs" style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2", color: "#B42318" }}>
          {error}
        </div>
      )}
    </div>
  );
}
