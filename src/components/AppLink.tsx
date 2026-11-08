import type { AnchorHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export default function AppLink({ href, children, ...props }: AppLinkProps) {
  if (href.startsWith("/") && !props.target) {
    return <Link to={href} {...props}>{children}</Link>;
  }
  return <a href={href} {...props}>{children}</a>;
}
