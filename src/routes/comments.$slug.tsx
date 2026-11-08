import { createFileRoute, notFound } from "@tanstack/react-router";
import { VoiceDetailPage } from "@/components/subpages/VoiceDetailPage";
import { getVoice } from "@/lib/voices";
import { site } from "@/lib/site";

export const Route = createFileRoute("/comments/$slug")({
  loader: ({ params }) => {
    const voice = getVoice(params.slug);
    if (!voice) throw notFound();
    return voice;
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.name} | お客様の声 | ${site.name}` },
    { name: "description", content: loaderData.body.replace(/\n/g, "").slice(0, 120) },
  ] : [] }),
  component: () => <VoiceDetailPage voice={Route.useLoaderData()} />,
});
