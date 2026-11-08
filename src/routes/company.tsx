import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage } from "@/components/subpages/CompanyPage";
import { site } from "@/lib/site";
export const Route = createFileRoute("/company")({ head: () => ({ meta: [{ title: `会社案内 | ${site.name}` }] }), component: CompanyPage });
