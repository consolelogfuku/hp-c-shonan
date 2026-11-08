import { createFileRoute } from "@tanstack/react-router";
import { RentPage } from "@/components/subpages/RentPage";
import { getPublishedProperties } from "@/lib/cms/functions";
import { site } from "@/lib/site";
export const Route = createFileRoute("/rent/")({ loader: () => getPublishedProperties({ data: "rent" }), head: () => ({ meta: [{ title: `賃貸物件 | ${site.name}` }] }), component: () => <RentPage properties={Route.useLoaderData()} /> });
