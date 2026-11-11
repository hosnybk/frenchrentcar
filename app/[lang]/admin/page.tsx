import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdmin } from "@/lib/admin/session";
import { getLocale } from "@/lib/translations";
import AdminDashboard from "./AdminDashboard";
import LoginForm from "./LoginForm";

// The admin area reads the session cookie on every request: never prerendered, never cached.
export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ status?: string; notice?: string }>;

export default async function Admin({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: SearchParams;
}) {
  const { lang } = await params;
  return (
    <Suspense fallback={<section className="page-wrap admin-login" />}>
      <AdminArea lang={getLocale(lang)} searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminArea({ lang, searchParams }: { lang: string; searchParams: SearchParams }) {
  const admin = await getAdmin();
  if (!admin) return <LoginForm lang={lang} />;
  const { status, notice } = await searchParams;
  return <AdminDashboard lang={lang} admin={admin} status={status} notice={notice} />;
}
