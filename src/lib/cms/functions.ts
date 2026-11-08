import { createServerFn } from "@tanstack/react-start";
import type { PropertySection } from "./property-model";

export const getPublishedNews = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublishedArticles } = await import("./cloudflare-store.server");
  return listPublishedArticles();
});

export const getAdminState = createServerFn({ method: "GET" }).handler(async () => {
  const [{ env }, { isAdminRequest }] = await Promise.all([
    import("cloudflare:workers"),
    import("./cloudflare-auth.server"),
  ]);
  return { loggedIn: await isAdminRequest(), configured: Boolean(env.CMS_ADMIN_PASSWORD) };
});

export const getAdminNews = createServerFn({ method: "GET" }).handler(async () => {
  const [{ requireAdminRequest }, { listAdminArticles }] = await Promise.all([
    import("./cloudflare-auth.server"),
    import("./cloudflare-store.server"),
  ]);
  await requireAdminRequest();
  return listAdminArticles();
});

export const getAdminNewsArticle = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    const [{ requireAdminRequest }, { getAdminArticle }] = await Promise.all([
      import("./cloudflare-auth.server"),
      import("./cloudflare-store.server"),
    ]);
    await requireAdminRequest();
    return getAdminArticle(data);
  });

export const getPublishedProperties = createServerFn({ method: "GET" })
  .validator((section: "sale" | "rent") => section)
  .handler(async ({ data }) => {
    const { listPublishedProperties } = await import("./cloudflare-store.server");
    return listPublishedProperties(data);
  });

export const getPublishedProperty = createServerFn({ method: "GET" })
  .validator((input: { section: PropertySection; slug: string }) => input)
  .handler(async ({ data }) => {
    const { getPublishedProperty: findProperty } = await import("./cloudflare-store.server");
    return findProperty(data.section, data.slug);
  });

export const getAdminProperties = createServerFn({ method: "GET" })
  .validator((section: "sale" | "rent") => section)
  .handler(async ({ data }) => {
    const [{ requireAdminRequest }, { listAdminProperties }] = await Promise.all([
      import("./cloudflare-auth.server"),
      import("./cloudflare-store.server"),
    ]);
    await requireAdminRequest();
    return listAdminProperties(data);
  });

export const getAdminProperty = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    const [{ requireAdminRequest }, store] = await Promise.all([
      import("./cloudflare-auth.server"),
      import("./cloudflare-store.server"),
    ]);
    await requireAdminRequest();
    return store.getAdminProperty(data);
  });
