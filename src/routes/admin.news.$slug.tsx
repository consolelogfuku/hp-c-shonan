import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { getAdminNewsArticle, getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/news/$slug")({
  loader: async ({ params }) => {
    if (!(await getAdminState()).loggedIn) throw redirect({ to: "/admin/login" });
    const article = await getAdminNewsArticle({ data: params.slug });
    if (!article) throw notFound();
    return article;
  },
  notFoundComponent: () => <section className="cms-card cms-empty"><h1>記事が見つかりません</h1><p className="cms-muted">削除された可能性があります。</p><a href="/admin/news" className="cms-button cms-button-primary">お知らせ一覧へ戻る</a></section>,
  component: EditNewsPage,
});

function EditNewsPage() {
  const article = Route.useLoaderData();
  return <NewsEditor initial={article} today={article.article.date} />;
}
