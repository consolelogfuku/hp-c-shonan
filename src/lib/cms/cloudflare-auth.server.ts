import { env } from "cloudflare:workers";
import { getCookie, getRequest } from "@tanstack/react-start/server";
import { CmsError } from "./model";
import { sessionValid } from "./cloudflare-store.server";

export const SESSION_COOKIE = "shonan-admin";

export async function isAdminRequest(request?: Request) {
  const password = env.CMS_ADMIN_PASSWORD;
  const token = request ? readCookie(request, SESSION_COOKIE) : getCookie(SESSION_COOKIE);
  return Boolean(password && token && await sessionValid(token, password));
}

export async function requireAdminRequest(request?: Request) {
  if (!(await isAdminRequest(request))) throw new CmsError("ログインし直してください。入力内容はこの画面に残っています。", 401);
}

export function sameOrigin(request = getRequest()) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).origin !== new URL(request.url).origin) throw new CmsError("この操作は管理画面から実行してください。", 403);
}

export async function passwordMatches(value: unknown) {
  const expected = env.CMS_ADMIN_PASSWORD;
  if (!expected) throw new CmsError("管理画面の初期設定が必要です。", 503);
  if (typeof value !== "string" || value.length > 512) return false;
  const encode = (text: string) => new TextEncoder().encode(text);
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encode(value)),
    crypto.subtle.digest("SHA-256", encode(expected)),
  ]);
  const actual = new Uint8Array(actualHash);
  const wanted = new Uint8Array(expectedHash);
  let difference = actual.byteLength ^ wanted.byteLength;
  for (let index = 0; index < Math.min(actual.byteLength, wanted.byteLength); index += 1) difference |= actual[index] ^ wanted[index];
  return difference === 0;
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(/;\s*/)) {
    const equals = part.indexOf("=");
    if (equals !== -1 && part.slice(0, equals) === name) return part.slice(equals + 1);
  }
  return undefined;
}

export async function readLimitedBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new CmsError("送信データが大きすぎます。", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new CmsError("入力内容がありません。");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new CmsError("送信データが大きすぎます。", 413);
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readJson(request: Request) {
  try {
    return JSON.parse(new TextDecoder().decode(await readLimitedBody(request, 512_000)));
  } catch (error) {
    if (error instanceof CmsError) throw error;
    throw new CmsError("入力内容を確認してください。");
  }
}

export function apiError(error: unknown) {
  if (!(error instanceof CmsError)) console.error(JSON.stringify({ event: "cms_request_failed", error: String(error) }));
  return Response.json(
    { error: error instanceof CmsError ? error.message : "保存できませんでした。時間をおいて再度お試しください。" },
    { status: error instanceof CmsError ? error.status : 500, headers: { "Cache-Control": "no-store" } },
  );
}
