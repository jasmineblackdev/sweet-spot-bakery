import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Instagram, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Frosted Remedies" },
      {
        name: "description",
        content: "Get in touch with Frosted Remedies — message us with questions or order requests.",
      },
      { property: "og:title", content: "Contact — Frosted Remedies" },
      {
        property: "og:description",
        content: "Send us a message — we'd love to hear from you.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = schema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    // For v1 send via mailto so it works without an SMTP backend.
    const subject = encodeURIComponent(`Frosted Remedies inquiry — ${parsed.data.name}`);
    const body = encodeURIComponent(
      `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || "—"}\n\n${parsed.data.message}`,
    );
    window.location.href = `mailto:hello@frostedremedies.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl text-primary md:text-6xl">Contact</h1>
          <p className="mt-3 text-foreground/80">
            Questions, custom orders, or just want to say hi? We'd love to hear from you.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a className="text-foreground hover:text-primary" href="mailto:hello@frostedremedies.com">
                hello@frostedremedies.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-primary" />
              <a
                className="text-foreground hover:text-primary"
                href="https://instagram.com/frostedremedies"
                target="_blank"
                rel="noreferrer noopener"
              >
                @frostedremedies
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-foreground/80">Text us via the form (no number shared)</span>
            </li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <h2 className="font-display text-2xl text-primary">Send a message</h2>

          {sent && (
            <p className="mt-4 rounded-2xl bg-primary/10 p-3 text-sm text-primary">
              Opening your email app — thanks! 💜
            </p>
          )}

          <div className="mt-4 grid gap-3">
            <input
              required
              maxLength={100}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              required
              type="email"
              maxLength={255}
              placeholder="Email (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              maxLength={20}
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              required
              maxLength={2000}
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
            >
              Send message
            </button>
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}
