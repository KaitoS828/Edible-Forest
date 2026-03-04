import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "食べられる森アンサンブル倶楽部",
  description: "自然界の仕組みを人間社会・テクノロジーに応用し、新しい生き方を実践・発信するコミュニティ。農業以前の自然（食べられる森）と最先端AIを融合した、インターローカルな暮らしの実験場。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
