import { createFileRoute, notFound } from "@tanstack/react-router";
import { PropertyDetailPage, PropertyNotFoundPage } from "@/components/subpages/PropertyDetailPage";
import { getPublishedProperty } from "@/lib/cms/functions";
import { site } from "@/lib/site";

export const Route = createFileRoute("/rent/$slug")({
  loader: async ({ params }) => {
    const property = await getPublishedProperty({ data: { section: "rent", slug: params.slug } });
    if (!property) throw notFound();
    return property;
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.property.title} | ${site.name}` },
    { name: "description", content: loaderData.property.description || `${loaderData.property.title}の物件情報です。` },
  ] : [] }),
  notFoundComponent: () => <PropertyNotFoundPage section="rent" />,
  component: () => <PropertyDetailPage record={Route.useLoaderData()} />,
});
