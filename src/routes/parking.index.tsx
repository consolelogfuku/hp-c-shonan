import { createFileRoute } from "@tanstack/react-router";
import { ParkingPage } from "@/components/subpages/ParkingPage";
import { getPublishedProperties } from "@/lib/cms/functions";
import { site } from "@/lib/site";

export const Route = createFileRoute("/parking/")({
  loader: () => getPublishedProperties({ data: "rent" }),
  head: () => ({ meta: [{ title: `貸駐車場 | ${site.name}` }] }),
  component: () => <ParkingPage properties={Route.useLoaderData()} />,
});
