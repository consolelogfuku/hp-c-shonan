import { createFileRoute } from "@tanstack/react-router";
import homeCss from "../app/home.css?url";
import { HomePage } from "@/components/home/HomePage";
import { getPublishedNews } from "@/lib/cms/functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ articles: await getPublishedNews() }),
  head: () => ({
    links: [
      // トップページだけで使う書体（本文の Noto Sans JP と、英字ラベルの Cormorant Garamond）
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Noto+Sans+JP:wght@300;400;500&display=swap",
      },
      { rel: "stylesheet", href: homeCss },
      { rel: "preload", as: "image", href: "/images/top/works/kagawa/11.jpg" },
    ],
  }),
  component: Home,
});

function Home() {
  const { articles } = Route.useLoaderData();
  return <HomePage articles={articles} />;
}
