"use client";

import { useRouter } from "next/navigation";

// A table row that navigates to `href` on click — except when an interactive
// element (button / link) inside it is clicked.
export function ClickableRow({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <tr
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, a")) return;
        router.push(href);
      }}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {children}
    </tr>
  );
}
