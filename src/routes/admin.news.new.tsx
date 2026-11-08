import { createFileRoute, redirect } from "@tanstack/react-router";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/news/new")({
  loader: async () => {
    if (!(await getAdminState()).loggedIn) throw redirect({ to: "/admin/login" });
    return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  },
  component: NewNewsPage,
});

function NewNewsPage() {
  return <NewsEditor initial={null} today={Route.useLoaderData()} />;
}
