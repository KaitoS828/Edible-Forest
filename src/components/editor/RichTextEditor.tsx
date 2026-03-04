"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const imgInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
      active ? "bg-[#005F02] text-white" : "text-[#005F02] hover:bg-[#005F02]"
    }`;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `editor/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      alert("画像のアップロードに失敗しました");
    }
    e.target.value = "";
  }

  return (
    <div
      className="flex flex-wrap gap-1 px-3 py-2 border-b"
      style={{ borderColor: "rgba(0,95,2,0.15)", backgroundColor: "#FAFAF8" }}
    >
      {/* 見出し */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}>H3</button>

      <div className="w-px self-stretch mx-1" style={{ backgroundColor: "#005F02" }} />

      {/* テキスト装飾 */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn(editor.isActive("italic"))} italic`}>I</button>

      <div className="w-px self-stretch mx-1" style={{ backgroundColor: "#005F02" }} />

      {/* リスト */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>• リスト</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>1. リスト</button>

      <div className="w-px self-stretch mx-1" style={{ backgroundColor: "#005F02" }} />

      {/* 引用 */}
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}>
        " 引用
      </button>

      {/* リンク */}
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={btn(editor.isActive("link"))}
      >
        🔗 リンク
      </button>

      <div className="w-px self-stretch mx-1" style={{ backgroundColor: "#005F02" }} />

      {/* 画像挿入 */}
      <button
        type="button"
        onClick={() => imgInputRef.current?.click()}
        className={btn(false)}
        title="画像を挿入"
      >
        🖼 画像
      </button>
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* 水平線 */}
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>― 区切り</button>
    </div>
  );
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "ここに内容を入力してください…\n\nMarkdownも使えます：**太字** *斜体* # 見出し",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: false }),
      Markdown.configure({ html: true, transformPastedText: true }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[320px] prose prose-sm max-w-none p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: "rgba(0,95,2,0.15)", backgroundColor: "white" }}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <div
        className="px-4 py-2 text-[11px] border-t"
        style={{ borderColor: "#F0F0F0", color: "#000000", backgroundColor: "#FAFAF8" }}
      >
        Markdownショートカット対応：**太字** *斜体* # 見出し &gt; 引用 - リスト
      </div>
    </div>
  );
}
