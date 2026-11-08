import { createFileRoute, redirect } from "@tanstack/react-router";
import { NewsManager } from "@/components/admin/NewsManager";
import { getAdminNews, getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/news/")({
  loader: async () => {
    if (!(await getAdminState()).loggedIn) throw redirect({ to: "/admin/login" });
    return getAdminNews();
  },
  component: AdminNewsPage,
});

function AdminNewsPage() {
  return <NewsManager articles={Route.useLoaderData()} />;
}
