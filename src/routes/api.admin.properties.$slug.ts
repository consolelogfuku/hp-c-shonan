import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/properties/$slug")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const input = await auth.readJson(request);
          return Response.json(await store.saveProperty(input?.section, params.slug, input?.version, input?.action, input?.property), { headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
      DELETE: async ({ request, params }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const input = await auth.readJson(request);
          await store.deleteProperty(params.slug, input?.version);
          return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
    },
  },
});
