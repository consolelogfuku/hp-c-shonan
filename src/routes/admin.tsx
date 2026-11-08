import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminState(),
  head: () => ({ meta: [{ title: "管理画面 | コミュニティ湘南" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { loggedIn } = Route.useLoaderData();
  const pathname = useLocation({ select: (location) => location.pathname });
  const current = (base: string) => pathname === base || pathname.startsWith(`${base}/`);
  return <div className="cms">
    <a href="#admin-main" className="cms-skip">本文へ移動</a>
    <header className="cms-topbar">
      <a href="/admin" className="cms-brand"><span className="cms-brand-mark" aria-hidden>湘</span><span>コミュニティ湘南<small>管理画面</small></span></a>
      <div className="cms-actions"><a href="/news" target="_blank" rel="noreferrer" className="cms-button">公開サイトを確認 ↗</a>{loggedIn && <LogoutButton />}</div>
    </header>
    <div className={loggedIn ? "cms-shell" : "cms-login-shell"}>
      {loggedIn && <aside className="cms-sidebar"><p className="cms-eyebrow">コンテンツ管理</p><nav aria-label="管理メニュー"><a href="/admin/news" className={current("/admin/news") ? "cms-nav-current" : ""}>▤ お知らせ</a><a href="/admin/sale" className={current("/admin/sale") ? "cms-nav-current" : ""}>⌂ 売買物件</a><a href="/admin/rent" className={current("/admin/rent") ? "cms-nav-current" : ""}>▦ 賃貸・駐車場</a></nav></aside>}
      <main id="admin-main" className="cms-main"><Outlet /></main>
    </div>
  </div>;
}
