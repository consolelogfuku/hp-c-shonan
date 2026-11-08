import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [{ env }, auth, store] = await Promise.all([
          import("cloudflare:workers"),
          import("@/lib/cms/cloudflare-auth.server"),
          import("@/lib/cms/cloudflare-store.server"),
        ]);
        try {
          auth.sameOrigin(request);
          if (!(await store.allowLoginAttempt())) throw new (await import("@/lib/cms/model")).CmsError("ログインを繰り返し試行したため、15分ほど待ってから再度お試しください。", 429);
          const input = await auth.readJson(request);
          if (!(await auth.passwordMatches(input?.password))) throw new (await import("@/lib/cms/model")).CmsError("パスワードが正しくありません。", 401);
          const token = await store.createSession(env.CMS_ADMIN_PASSWORD);
          const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
          return Response.json({ ok: true }, {
            headers: {
              "Cache-Control": "no-store",
              "Set-Cookie": `${auth.SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${8 * 60 * 60}${secure}`,
            },
          });
        } catch (error) {
          return auth.apiError(error);
        }
      },
    },
  },
});
