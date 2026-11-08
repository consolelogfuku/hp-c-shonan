import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/news/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const [auth, store, { CmsError }] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server"), import("@/lib/cms/model")]);
        try {
          await auth.requireAdminRequest(request);
          const article = await store.getAdminArticle(params.slug);
          if (!article) throw new CmsError("記事が見つかりません。", 404);
          return Response.json(article, { headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
      PUT: async ({ request, params }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const input = await auth.readJson(request);
          return Response.json(await store.saveArticle(params.slug, input?.version, input?.action, input?.article), { headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
      DELETE: async ({ request, params }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const input = await auth.readJson(request);
          await store.deleteArticle(params.slug, input?.version);
          return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
    },
  },
});
