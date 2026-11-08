import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/$name")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        if (!/^[a-f0-9-]{36}\.webp$/.test(params.name)) return new Response(null, { status: 404 });
        const [auth, store] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server")]);
        const isPublic = await store.isPublicMedia(params.name);
        if (!isPublic && !(await auth.isAdminRequest(request))) return new Response(null, { status: 404 });
        const image = await store.getMedia(params.name);
        if (!image) return new Response(null, { status: 404 });
        return new Response(image.body, {
          headers: {
            "Content-Type": image.httpMetadata?.contentType || "image/webp",
            "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
            "X-Content-Type-Options": "nosniff",
            "Content-Disposition": `inline; filename="${params.name}"`,
            ETag: image.httpEtag,
          },
        });
      },
    },
  },
});
