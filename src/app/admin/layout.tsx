import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { Container } from "@/components/ui/container";
import { AdminNav } from "@/components/admin-nav";

// Authoritative guard for the admin area — requires an active ADMIN user.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/account/articles");

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm">
          <span className="font-semibold text-brand">Admin</span>
          <AdminNav />
        </Container>
      </div>
      {children}
    </div>
  );
}
