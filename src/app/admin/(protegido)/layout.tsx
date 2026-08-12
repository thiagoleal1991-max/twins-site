import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE_NAME, validarSessionToken } from "@/lib/admin-auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminProtegidoLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;

  if (!validarSessionToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: "1px solid var(--line)",
          background: "var(--purple-deep)",
        }}
      >
        <nav style={{ display: "flex", gap: 20, fontSize: 14 }}>
          <Link href="/admin">Produtos</Link>
          <Link href="/admin/banners">Banners</Link>
        </nav>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
