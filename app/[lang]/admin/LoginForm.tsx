"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export default function LoginForm({ lang }: { lang: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, { error: "" });

  return (
    <section className="page-wrap admin-login">
      <span className="eyebrow">FRENCH FOR CAR RENTAL CO. · ADMIN</span>
      <h1>Connexion</h1>
      <form action={action} className="stacked-form admin-login-form">
        <input type="hidden" name="lang" value={lang} />
        <label>
          <span>E-mail</span>
          <input name="email" type="email" autoComplete="username" required maxLength={254} />
        </label>
        <label>
          <span>Mot de passe</span>
          <input name="password" type="password" autoComplete="current-password" required maxLength={200} />
        </label>
        {state.error && (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        )}
        <button className="button button-red button-full" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </section>
  );
}
