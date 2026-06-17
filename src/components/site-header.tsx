"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

type NavItem = (typeof site.nav)[number];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

// Desktop dropdown for nav items that have children.
function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const children = "children" in item ? item.children : undefined;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 border-b-2 py-2 transition-colors hover:text-white",
          isActive(pathname, item.href)
            ? "border-primary text-white"
            : "border-transparent text-white/75",
        )}
      >
        {item.label}
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>
      {open && children ? (
        <ul className="absolute left-0 top-full z-40 min-w-56 rounded-lg border border-white/10 bg-black py-2 text-white shadow-lg">
          {children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  "block px-4 py-2 text-sm hover:bg-white/10",
                  pathname === child.href ? "text-white" : "text-white/75",
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

// Mobile drawer entry: plain link, or expandable group with children.
function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const children = "children" in item ? item.children : undefined;

  if (!children) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "block py-3 text-base",
          isActive(pathname, item.href) ? "font-medium text-brand" : "text-foreground",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-base text-foreground"
      >
        {item.label}
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <ul className="pb-2 pl-4">
          {children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block py-2 text-sm text-muted"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer + lock scroll while open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black text-white">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="brand-script text-2xl text-white sm:text-2xl">
          {site.name}
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm">
              {site.nav.map((item) =>
                "children" in item ? (
                  <NavDropdown key={item.href} item={item} pathname={pathname} />
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "border-b-2 py-2 transition-colors hover:text-white",
                        isActive(pathname, item.href)
                          ? "border-primary text-white"
                          : "border-transparent text-white/75",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <UserMenu />

          <ThemeToggle />

          {/* Mobile toggle */}
          <button
            type="button"
            className="rounded p-2 text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Toggle navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span aria-hidden className="text-xl">
              {drawerOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-16 z-30 bg-black/30"
            aria-hidden
            onClick={() => setDrawerOpen(false)}
          />
          <nav
            id="mobile-drawer"
            aria-label="Mobile"
            className="relative z-40 border-t border-border bg-background"
          >
            <Container className="py-2">
              {site.nav.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setDrawerOpen(false)}
                />
              ))}

              <div className="mt-4 border-t border-border pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="pb-1">
                      <p className="font-medium text-brand">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <Link
                      href="/account/profile"
                      onClick={() => setDrawerOpen(false)}
                      className="block text-base text-foreground"
                    >
                      My Profile
                    </Link>
                    {user.role === "ADMIN" ? (
                      <Link
                        href="/admin"
                        onClick={() => setDrawerOpen(false)}
                        className="block text-base text-foreground"
                      >
                        Admin Panel
                      </Link>
                    ) : null}
                    <Link
                      href="/account/articles"
                      onClick={() => setDrawerOpen(false)}
                      className="block text-base text-foreground"
                    >
                      My Articles
                    </Link>
                    <Link
                      href="/account/password"
                      onClick={() => setDrawerOpen(false)}
                      className="block text-base text-foreground"
                    >
                      Change Password
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setDrawerOpen(false);
                        await logout();
                        router.push("/");
                        router.refresh();
                      }}
                      className="text-base font-medium text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="block rounded bg-ink px-4 py-2 text-center text-sm font-medium text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </Container>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
