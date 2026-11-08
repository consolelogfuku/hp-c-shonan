import { createFileRoute } from "@tanstack/react-router";
import { VoicesPage } from "@/components/subpages/VoicesPage";
import { site } from "@/lib/site";
export const Route = createFileRoute("/voices")({ head: () => ({ meta: [{ title: `お客様の声 | ${site.name}` }] }), component: VoicesPage });
