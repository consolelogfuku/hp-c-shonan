import { createFileRoute } from "@tanstack/react-router";
import { ConceptPage } from "@/components/subpages/ConceptPage";
import { site } from "@/lib/site";
export const Route = createFileRoute("/concept")({ head: () => ({ meta: [{ title: `設計コンセプト | ${site.name}` }] }), component: ConceptPage });
