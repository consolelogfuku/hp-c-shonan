import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/news/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          await auth.requireAdminRequest(request);
          return Response.json(await store.listAdminArticles(), { headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
      POST: async ({ request }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const input = await auth.readJson(request);
          const article = await store.saveArticle(undefined, undefined, input?.action, input?.article);
          return Response.json(article, { status: 201, headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
    },
  },
});
