import { createFileRoute, redirect } from "@tanstack/react-router";
import { PropertyManager } from "@/components/admin/PropertyManager";
import { getAdminProperties, getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/sale/")({
  loader: async () => {
    if (!(await getAdminState()).loggedIn) throw redirect({ to: "/admin/login" });
    return getAdminProperties({ data: "sale" });
  },
  component: () => <PropertyManager records={Route.useLoaderData()} section="sale" />,
});
