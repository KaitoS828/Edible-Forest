"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TITLE = "食べられる森".split("");
const SUB   = "アンサンブル倶楽部".split("");

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow]       = useState(false);
  const bgRef    = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subRef   = useRef<HTMLDivElement>(null);

  // 初回訪問判定（SSR 後に実行）
  useEffect(() => {
    setMounted(true);
    if (!sessionStorage.getItem("_ef_loaded")) {
      sessionStorage.setItem("_ef_loaded", "1");
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    const titleChars = titleRef.current?.querySelectorAll<HTMLElement>(".lc") ?? [];
    const subChars   = subRef.current?.querySelectorAll<HTMLElement>(".lc") ?? [];
    const bg         = bgRef.current;

    gsap.set([titleChars, subChars], { autoAlpha: 0, y: 18 });

    const tl = gsap.timeline({
      onComplete: () => setShow(false),
    });

    tl
      // タイトル文字を1文字ずつ表示
      .to(titleChars, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out",
      })
      // サブタイトル
      .to(subChars, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.15")
      // 少し見せてから消去
      .to(titleChars, {
        autoAlpha: 0,
        y: -12,
        stagger: 0.04,
        duration: 0.18,
        ease: "power3.inOut",
      }, "+=0.55")
      .to(subChars, {
        autoAlpha: 0,
        y: -8,
        stagger: 0.03,
        duration: 0.18,
        ease: "power3.inOut",
      }, "<")
      // 画面全体がスライドアップ
      .to(bg, {
        yPercent: -100,
        duration: 0.78,
        ease: "power3.inOut",
      }, "-=0.15");

    return () => { tl.kill(); };
  }, [show]);

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ backgroundColor: "#3C6B4F", gap: "14px" }}
      >
        {/* メインタイトル */}
        <div ref={titleRef} className="flex items-center">
          {TITLE.map((char, i) => (
            <span
              key={i}
              className="lc"
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                fontWeight: 700,
                color: "white",
                display: "inline-block",
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* サブタイトル */}
        <div ref={subRef} className="flex items-center">
          {SUB.map((char, i) => (
            <span
              key={i}
              className="lc"
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: "clamp(0.6rem, 1.4vw, 0.82rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.65)",
                display: "inline-block",
                letterSpacing: "0.22em",
                lineHeight: 1,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
