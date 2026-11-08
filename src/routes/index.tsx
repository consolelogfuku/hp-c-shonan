import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { getPublishedNews } from "@/lib/cms/functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ articles: await getPublishedNews() }),
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: "/images/top/works/kagawa/11.jpg" },
    ],
  }),
  component: Home,
});

function Home() {
  const { articles } = Route.useLoaderData();
  return <HomePage articles={articles} />;
}
