"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminApiRequestError } from "@/lib/admin-api/client";
import { useAdminAuth } from "@/lib/admin-api/auth-context";

const messages: Record<string, string> = {
  authentication_failed: "نام کاربری یا گذرواژه نادرست است.",
  account_locked: "این حساب موقتاً قفل شده است.",
  login_throttled: "تعداد تلاش‌ها بیش از حد مجاز است. بعداً دوباره امتحان کنید.",
  admin_access_denied: "این حساب اجازه ورود به پنل مدیریت را ندارد.",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, status } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await login(username, password);
      router.replace(params.get("next")?.startsWith("/admin") ? params.get("next")! : "/admin");
    } catch (requestError) {
      setError(requestError instanceof AdminApiRequestError ? messages[requestError.code] ?? requestError.message : "ورود انجام نشد. دوباره تلاش کنید.");
    } finally { setSubmitting(false); }
  }

  return <main className="admin-login"><section className="admin-login-card" aria-labelledby="login-title"><span className="admin-eyebrow">ABRIT ADMIN</span><h1 id="login-title">ورود به پنل مدیریت</h1><p>برای ادامه، مشخصات حساب مدیریت خود را وارد کنید.</p><form onSubmit={onSubmit}><label htmlFor="admin-username">نام کاربری</label><input id="admin-username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /><label htmlFor="admin-password">گذرواژه</label><input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />{error && <p className="admin-form-error" role="alert">{error}</p>}<button type="submit" disabled={submitting || status === "loading"}>{submitting ? "در حال ورود…" : "ورود"}</button></form></section></main>;
}
