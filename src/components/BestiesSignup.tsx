import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Valid phone required")
    .max(20)
    .regex(/^[+0-9 ()\-]+$/, "Digits, spaces, +, -, () only"),
  birthday: z.string().optional().or(z.literal("")),
});

export function BestiesSignup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ name, phone, birthday });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setStatus("loading");
    const { error: insertError } = await supabase.from("besties").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      birthday: parsed.data.birthday ? parsed.data.birthday : null,
    });
    if (insertError) {
      setStatus("error");
      if (insertError.code === "23505") {
        setError("That phone number is already a Bestie 💜");
      } else {
        setError("Could not sign you up. Try again.");
      }
      return;
    }
    setStatus("success");
    setName("");
    setPhone("");
    setBirthday("");
  }

  return (
    <section
      aria-labelledby="besties-heading"
      className="rounded-3xl border border-primary/20 bg-gradient-to-br from-accent/60 to-secondary/60 p-6 shadow-[var(--shadow-soft)] md:p-10"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-1 h-6 w-6 text-primary" aria-hidden="true" />
        <div>
          <h2 id="besties-heading" className="font-display text-3xl text-primary md:text-4xl">
            Join the Besties
          </h2>
          <p className="mt-1 text-sm text-foreground/70 md:text-base">
            Stay up to date on promos and get an extra <strong>10% off</strong> your next order. Birthday
            month? <strong>50% off + a free cookie 🍪</strong>
          </p>
        </div>
      </div>

      {status === "success" ? (
        <p className="mt-6 rounded-2xl bg-primary/10 p-4 text-primary">
          You're in! 💜 Welcome to the Besties.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            aria-label="Name"
            className="rounded-full border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            required
            aria-label="Phone number"
            className="rounded-full border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            aria-label="Birthday (optional)"
            className="rounded-full border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? "Joining…" : "Join 💜"}
          </button>
          {error && (
            <p role="alert" className="md:col-span-4 text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
