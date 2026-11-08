import { useEffect, useRef, useState } from "react";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import Link from "@/components/AppLink";
import { site } from "@/lib/site";

const LOGO = "/images/top/logo.png";

const houseLinks = [
  { label: "施工事例", href: "/works/" },
  { label: "設計コンセプト", href: "/concept/" },
  { label: "お客様の声", href: "/comments/" },
  { label: "会社案内", href: "/company/" },
  { label: "お知らせ", href: "/news/" },
] as const;

const propertyLinks = [
  { label: "売買物件", href: "/sale/" },
  { label: "賃貸物件", href: "/rent/" },
  { label: "貸駐車場", href: "/parking/" },
] as const;

/** トップページ専用のヘッダー。ナビはすべて左から出るメニューに集約する。 */
export function HomeHeader() {
  const [open, setOpen] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeButton.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    openButton.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <header className="home-header">
        <button
          ref={openButton}
          type="button"
          className="home-menu-btn"
          aria-label="メニューを開く"
          aria-controls="home-menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <svg aria-hidden width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 1h26M0 7h26M0 13h26" />
          </svg>
          <span className="label">MENU</span>
        </button>
        <Link href="/" className="home-logo" aria-label={site.name}>
          <img src={LOGO} alt={site.name} width={310} height={52} />
        </Link>
        <div className="home-header-cta">
          <a className="home-tel" href={site.telHref}>
            <Phone aria-hidden size={20} weight="light" />
            <span className="text">{site.tel}</span>
          </a>
          <Link className="home-form" href="/contact/">
            <EnvelopeSimple aria-hidden size={20} weight="light" />
            <span className="text">お問い合わせ</span>
          </Link>
        </div>
      </header>

      <div id="home-menu" className={`home-drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <button type="button" className="home-drawer-backdrop" aria-label="メニューを閉じる" tabIndex={-1} onClick={close} />
        <div className="home-drawer-panel" role="dialog" aria-modal="true" aria-label="メニュー">
          <div className="home-drawer-top">
            <button ref={closeButton} type="button" className="home-menu-close" aria-label="メニューを閉じる" onClick={close} tabIndex={open ? 0 : -1}>
              <span className="home-x" aria-hidden />
              CLOSE
            </button>
          </div>
          <nav className="home-drawer-body" aria-label="メニュー">
            <div className="home-drawer-group">
              <p>家づくり</p>
              {houseLinks.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="home-drawer-group">
              <p>物件を探す</p>
              {propertyLinks.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="home-drawer-foot">
            <a className="tel" href={site.telHref} tabIndex={open ? 0 : -1}>
              <Phone aria-hidden size={22} weight="light" />
              {site.tel}
            </a>
            <Link className="home-black" href="/contact/" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              お問い合わせ
            </Link>
            <p>営業時間 {site.hours}<br />※ 定休日 {site.closed}</p>
          </div>
        </div>
      </div>
    </>
  );
}
