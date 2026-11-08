import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import globalCss from "../app/globals.css?url";
import adminCss from "../app/admin/admin.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "茅ヶ崎の土地・注文住宅 | 株式会社コミュニティ湘南" },
      { name: "description", content: "茅ヶ崎の不動産会社コミュニティ湘南。建築家とともに創る注文住宅、売主の建築条件付き売地、近隣の賃貸物件・月極駐車場をご案内しています。" },
      { property: "og:title", content: "茅ヶ崎の土地・注文住宅 | 株式会社コミュニティ湘南" },
      { property: "og:description", content: "建築家とともに創る、湘南の憩いのわが家。土地探しから設計、完成後まで一貫してお手伝いします。" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { property: "og:site_name", content: "株式会社コミュニティ湘南" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;700&display=swap",
      },
      { rel: "stylesheet", href: globalCss },
      { rel: "stylesheet", href: adminCss },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body className="min-h-screen text-fg" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
