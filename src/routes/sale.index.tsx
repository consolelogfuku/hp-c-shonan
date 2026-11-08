import { createFileRoute } from "@tanstack/react-router";
import { SalePage } from "@/components/subpages/SalePage";
import { getPublishedProperties } from "@/lib/cms/functions";
import { site } from "@/lib/site";
export const Route = createFileRoute("/sale/")({ loader: () => getPublishedProperties({ data: "sale" }), head: () => ({ meta: [{ title: `売買物件 | ${site.name}` }] }), component: () => <SalePage properties={Route.useLoaderData()} /> });
