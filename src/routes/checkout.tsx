import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart, formatPrice } from "@/lib/cart";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Frosted Remedies" },
      { name: "description", content: "Schedule your pickup and place your order." },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  pickupDate: z.string().min(1, "Pick a date"),
  pickupTime: z.string().min(1, "Pick a time"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree to the policies" }) }),
});

function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const minPickupDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // 72-hour notice
    return d.toISOString().slice(0, 10);
  })();

  if (!items.length) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-4xl text-primary">Nothing to check out yet</h1>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Browse the menu
          </Link>
        </section>
      </SiteLayout>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const parsed = schema.safeParse({ name, email, phone, pickupDate, pickupTime, notes, agree });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);

    const pickupAt = new Date(`${parsed.data.pickupDate}T${parsed.data.pickupTime}:00`).toISOString();

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_name: parsed.data.name,
        customer_email: parsed.data.email,
        customer_phone: parsed.data.phone,
        pickup_at: pickupAt,
        subtotal_cents: subtotalCents,
        total_cents: subtotalCents,
        status: "pending",
        notes: parsed.data.notes || null,
      })
      .select()
      .single();

    if (orderErr || !order) {
      setSubmitting(false);
      setErr(orderErr?.message ?? "Could not create order");
      return;
    }

    const { error: itemsErr } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.name,
        unit_price_cents: i.unitPriceCents,
        quantity: i.quantity,
      })),
    );

    if (itemsErr) {
      setSubmitting(false);
      setErr(itemsErr.message);
      return;
    }

    clear();
    navigate({ to: "/order-confirmed", search: { id: order.id } });
  }

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-6">
          <h1 className="font-display text-4xl text-primary md:text-5xl">Checkout</h1>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-xl text-primary">Your details</h2>
            <div className="mt-4 grid gap-3">
              <input
                required maxLength={100} placeholder="Full name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                required type="email" maxLength={255} placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                required type="tel" maxLength={20} placeholder="Phone" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-xl text-primary">Pickup time</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              72-hour minimum notice. Earliest date: {minPickupDate}.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                required type="date" min={minPickupDate} value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                required type="time" value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <textarea
              maxLength={1000}
              placeholder="Any notes? (allergies, preferences, occasion)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-3 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--primary)]"
            />
            <span className="text-foreground/80">
              I have read and agree to the pickup policies (72-hour notice, $50 minimum, cancellation
              forfeitures, and no-refund-after-pickup).
            </span>
          </label>

          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place pickup order"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Online card payments coming soon — for now your order is reserved as <em>Pay at pickup</em>.
          </p>
        </form>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-xl text-primary">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="text-foreground/80">
                  {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
                </span>
                <span className="font-semibold">
                  {formatPrice(i.unitPriceCents * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-border" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
