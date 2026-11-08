import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PropertyEditor } from "@/components/admin/PropertyEditor";
import { getAdminProperty, getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/rent/$slug")({
  loader: async ({ params }) => {
    if (!(await getAdminState()).loggedIn) throw redirect({ to: "/admin/login" });
    const record = await getAdminProperty({ data: params.slug });
    if (!record || record.property.kind === "sale") throw notFound();
    return record;
  },
  notFoundComponent: () => <section className="cms-card cms-empty"><h1>物件が見つかりません</h1><a href="/admin/rent" className="cms-button">賃貸・駐車場一覧へ戻る</a></section>,
  component: () => <PropertyEditor initial={Route.useLoaderData()} section="rent" />,
});
