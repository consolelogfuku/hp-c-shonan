import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/properties/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const input = await auth.readJson(request);
          const property = await store.saveProperty(input?.section, undefined, undefined, input?.action, input?.property);
          return Response.json(property, { status: 201, headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
    },
  },
});
