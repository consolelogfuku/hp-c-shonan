import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [auth, store, { CmsError }] = await Promise.all([import("@/lib/cms/cloudflare-auth.server"), import("@/lib/cms/cloudflare-store.server"), import("@/lib/cms/model")]);
        try {
          auth.sameOrigin(request);
          await auth.requireAdminRequest(request);
          const bytes = await auth.readLimitedBody(request, 8 * 1024 * 1024 + 64 * 1024);
          const form = await new Response(bytes, { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
          const file = form.get("image");
          if (!(file instanceof File) || file.size > 8 * 1024 * 1024 || file.type !== "image/webp") throw new CmsError("8MB以下のJPEG・PNG・WebP画像を選んでください。");
          const image = await file.arrayBuffer();
          const header = new Uint8Array(image.slice(0, 12));
          if (new TextDecoder().decode(header.slice(0, 4)) !== "RIFF" || new TextDecoder().decode(header.slice(8, 12)) !== "WEBP") throw new CmsError("画像を読み込めませんでした。別の画像を選んでください。");
          return Response.json({ src: await store.addMedia(image) }, { status: 201, headers: { "Cache-Control": "no-store" } });
        } catch (error) { return auth.apiError(error); }
      },
    },
  },
});
