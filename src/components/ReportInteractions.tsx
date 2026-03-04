"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection, doc,
  setDoc, deleteDoc, addDoc,
  onSnapshot, query, orderBy, where, serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

interface Props {
  reportId: string;
}

export function ReportInteractions({ reportId }: Props) {
  const { user, loading } = useAuth();

  // ── いいね ──
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // ── コメント ──
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentError, setCommentError] = useState("");

  // いいね数・自分のいいね状態を取得（auth解決後のみ購読）
  useEffect(() => {
    if (loading || !user) return;
    const likeCol = collection(db, "reportLikes", reportId, "users");
    const unsub = onSnapshot(likeCol, (snap) => {
      setLikeCount(snap.size);
      setLiked(snap.docs.some((d) => d.id === user.uid));
    });
    return () => unsub();
  }, [reportId, user, loading]);

  // コメント一覧をリアルタイム購読（auth解決後のみ購読）
  useEffect(() => {
    if (loading || !user) return;
    const q = query(
      collection(db, "reportComments"),
      where("reportId", "==", reportId),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          userName: data.userName,
          content: data.content,
          createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
        } as Comment;
      });
      setComments(all);
    });
    return () => unsub();
  }, [reportId, user, loading]);

  const handleLike = useCallback(async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    const likeRef = doc(db, "reportLikes", reportId, "users", user.uid);
    try {
      if (liked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, { uid: user.uid, createdAt: serverTimestamp() });
      }
    } finally {
      setLikeLoading(false);
    }
  }, [user, liked, likeLoading, reportId]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    setPosting(true);
    setCommentError("");
    try {
      await addDoc(collection(db, "reportComments"), {
        reportId,
        userId: user.uid,
        userName: user.displayName ?? user.email?.split("@")[0] ?? "メンバー",
        content: commentText.trim(),
        createdAt: serverTimestamp(),
      });
      setCommentText("");
    } catch {
      setCommentError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-5 lg:px-10">

      {/* ── いいねバー ── */}
      <div className="flex items-center gap-4 py-6 border-t border-b" style={{ borderColor: "rgba(0,95,2,0.12)" }}>
        <button
          onClick={handleLike}
          disabled={!user || likeLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all disabled:opacity-40"
          style={{
            backgroundColor: liked ? "#005F02" : "transparent",
            color: liked ? "white" : "#005F02",
            border: `1.5px solid #005F02`,
          }}
        >
          <HeartIcon filled={liked} />
          <span>{liked ? "いいね済み" : "いいね"}</span>
          {likeCount > 0 && (
            <span
              className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: liked ? "rgba(255,255,255,0.25)" : "rgba(0,95,2,0.1)" }}
            >
              {likeCount}
            </span>
          )}
        </button>

        {!user && !loading && (
          <p className="text-xs" style={{ color: "#000000", opacity: 0.5 }}>
            いいねするには
            <a href="/login" className="underline ml-1" style={{ color: "#005F02" }}>ログイン</a>
            が必要です
          </p>
        )}
      </div>

      {/* ── コメントセクション ── */}
      <div className="pt-10 pb-16">
        <h3
          className="text-base font-bold mb-6"
          style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
        >
          コメント {comments.length > 0 && <span className="text-sm font-normal opacity-60">({comments.length})</span>}
        </h3>

        {/* コメント一覧 */}
        {comments.length > 0 ? (
          <div className="space-y-5 mb-8">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                {/* アバター */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: "#005F02" }}
                >
                  {c.userName.slice(0, 1)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: "#005F02" }}>{c.userName}</span>
                    <span className="text-[11px]" style={{ color: "#000000", opacity: 0.4 }}>
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap rounded-2xl px-4 py-3"
                    style={{ backgroundColor: "rgba(0,95,2,0.04)", color: "#000000" }}
                  >
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm mb-8" style={{ color: "#000000", opacity: 0.4 }}>
            まだコメントはありません。最初のコメントを投稿しましょう。
          </p>
        )}

        {/* コメント投稿フォーム */}
        {user ? (
          <form onSubmit={handleComment} className="flex gap-3 items-start">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: "#005F02" }}
            >
              {(user.displayName ?? user.email ?? "M").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="コメントを入力..."
                rows={3}
                className="w-full text-sm rounded-2xl px-4 py-3 resize-none outline-none transition-all"
                style={{
                  border: "1.5px solid rgba(0,95,2,0.2)",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#005F02")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,95,2,0.2)")}
              />
              {commentError && (
                <p className="text-xs text-red-500 mt-1">{commentError}</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={posting || !commentText.trim()}
                  className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#005F02" }}
                >
                  {posting ? "投稿中..." : "投稿する"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div
            className="rounded-2xl px-5 py-4 text-sm text-center"
            style={{ backgroundColor: "rgba(0,95,2,0.04)", border: "1px dashed rgba(0,95,2,0.2)" }}
          >
            <span style={{ color: "#000000" }}>コメントするには </span>
            <a href="/login" className="font-medium underline" style={{ color: "#005F02" }}>ログイン</a>
            <span style={{ color: "#000000" }}> が必要です</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function formatDate(d: Date): string {
  if (!d || isNaN(d.getTime())) return "";
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
