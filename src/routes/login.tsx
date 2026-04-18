import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Owner Login — Frosted Remedies" },
      { name: "description", content: "Owner login to manage products, prices, and orders." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
    }
    navigate({ to: "/admin" });
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-4xl text-primary">Owner Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage products, prices and orders.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-3 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <input
            required type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} maxLength={255}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            required type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={128}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-xs text-muted-foreground hover:text-primary"
          >
            {mode === "signin" ? "Need an owner account? Sign up" : "Have an account? Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          New accounts start as <em>customer</em>. Ask the owner to grant admin access.
        </p>
      </section>
    </SiteLayout>
  );
}
