import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [auth, store] = await Promise.all([
          import("@/lib/cms/cloudflare-auth.server"),
          import("@/lib/cms/cloudflare-store.server"),
        ]);
        try {
          auth.sameOrigin(request);
          const token = auth.readCookie(request, auth.SESSION_COOKIE);
          if (token) await store.revokeSession(token);
          return Response.json({ ok: true }, {
            headers: { "Cache-Control": "no-store", "Set-Cookie": `${auth.SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0` },
          });
        } catch (error) {
          return auth.apiError(error);
        }
      },
    },
  },
});
