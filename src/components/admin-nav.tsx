"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Approvals", href: "/admin/approvals" },
  { label: "All Articles", href: "/admin/articles" },
  { label: "Quotes", href: "/admin/quotes" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Open Roles", href: "/admin/roles" },
  { label: "Applications", href: "/admin/careers" },
  { label: "Users", href: "/admin/users" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(href + "/");
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <>
      {adminNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded px-2 py-1 transition-colors",
              active ? "bg-primary/15 font-semibold text-brand" : "text-muted hover:text-brand",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
