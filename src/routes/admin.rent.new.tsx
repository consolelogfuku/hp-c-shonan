import { createFileRoute, redirect } from "@tanstack/react-router";
import { PropertyEditor } from "@/components/admin/PropertyEditor";
import { getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/rent/new")({
  loader: async () => { if (!(await getAdminState()).loggedIn) throw redirect({ to: "/admin/login" }); },
  component: () => <PropertyEditor initial={null} section="rent" />,
});
