import type { Metadata } from "next";
import "@fontsource/shippori-mincho-b1/400.css";
import "@fontsource/shippori-mincho-b1/500.css";
import "@fontsource/shippori-mincho-b1/700.css";
import "@fontsource/klee-one/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "茅ヶ崎の土地・注文住宅 | 株式会社コミュニティ湘南",
  description:
    "茅ヶ崎の不動産会社コミュニティ湘南。建築家とともに創る注文住宅、売主の建築条件付き売地、近隣の賃貸物件・月極駐車場をご案内しています。",
  openGraph: {
    title: "茅ヶ崎の土地・注文住宅 | 株式会社コミュニティ湘南",
    description: "建築家とともに創る、湘南の憩いのわが家。土地探しから設計、完成後まで一貫してお手伝いします。",
    type: "website",
    locale: "ja_JP",
    siteName: "株式会社コミュニティ湘南",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-dvh text-fg" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
