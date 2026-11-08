import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminState } from "@/lib/cms/functions";

export const Route = createFileRoute("/admin/login")({
  loader: async () => {
    const state = await getAdminState();
    if (state.loggedIn) throw redirect({ to: "/admin/news" });
    return state;
  },
  component: LoginPage,
});

function LoginPage() {
  const { configured } = Route.useLoaderData();
  return <section className="cms-card cms-login"><p className="cms-eyebrow">Welcome back</p><h1>管理画面にログイン</h1><p className="cms-muted">お知らせを作成・編集して、サイトに公開できます。</p>{configured ? <LoginForm /> : <p role="status" className="cms-notice">管理パスワードの初期設定が必要です。サイトの管理担当者にご確認ください。</p>}</section>;
}
