import { createFileRoute } from "@tanstack/react-router";
import { WorksPage } from "@/components/subpages/WorksPage";
import { site } from "@/lib/site";
export const Route = createFileRoute("/works")({ head: () => ({ meta: [{ title: `施工事例 | ${site.name}` }] }), component: WorksPage });
