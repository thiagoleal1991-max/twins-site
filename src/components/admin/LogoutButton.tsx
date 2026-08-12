"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button className="btn-ghost" type="button" style={{ cursor: "pointer" }} onClick={handleLogout}>
      Sair
    </button>
  );
}
