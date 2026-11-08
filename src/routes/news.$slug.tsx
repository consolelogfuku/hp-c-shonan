import { createFileRoute, notFound } from "@tanstack/react-router";
import { NewsDetailPage } from "@/components/subpages/NewsDetailPage";
import { NewsNotFoundPage } from "@/components/subpages/NewsNotFoundPage";
import { getPublishedNews } from "@/lib/cms/functions";
import { getNewsArticle } from "@/lib/news";
import { site } from "@/lib/site";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const articles = await getPublishedNews();
    const article = getNewsArticle(params.slug, articles);
    if (!article) throw notFound();
    return { article, articles };
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.article.title} | ${site.name}` },
    { name: "description", content: loaderData.article.body[0] ?? "" },
  ] : [] }),
  notFoundComponent: NewsNotFoundPage,
  component: NewsDetail,
});

function NewsDetail() {
  const { article, articles } = Route.useLoaderData();
  return <NewsDetailPage article={article} articles={articles} />;
}
