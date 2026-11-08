import { createFileRoute, notFound } from "@tanstack/react-router";
import { NewsPage } from "@/components/subpages/NewsPage";
import { NewsNotFoundPage } from "@/components/subpages/NewsNotFoundPage";
import { getPublishedNews } from "@/lib/cms/functions";
import { getNewsPage } from "@/lib/news";
import { site } from "@/lib/site";

export const Route = createFileRoute("/news/")({
  validateSearch: (search: Record<string, unknown>) => ({ page: typeof search.page === "string" ? search.page : undefined }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ deps }) => {
    const result = getNewsPage(deps.page, await getPublishedNews());
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `お知らせ${loaderData && loaderData.page > 1 ? `（${loaderData.page}ページ目）` : ""} | ${site.name}` }] }),
  notFoundComponent: NewsNotFoundPage,
  component: NewsIndex,
});

function NewsIndex() {
  return <NewsPage {...Route.useLoaderData()} />;
}
