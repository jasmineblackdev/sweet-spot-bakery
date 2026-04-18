import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart, formatPrice } from "@/lib/cart";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, ShieldCheck } from "lucide-react";

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

const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];
const DAILY_CAP = 3;
const MIN_NOTICE_HOURS = 48;

function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<"schedule" | "details">("schedule");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [blackouts, setBlackouts] = useState<string[]>([]);
  const [bookedByDate, setBookedByDate] = useState<Record<string, string[]>>({});

  const minPickupDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + MIN_NOTICE_HOURS);
    return d.toISOString().slice(0, 10);
  }, []);

  // Load blackout dates + already-booked slots for the next 60 days
  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const future = new Date();
      future.setDate(future.getDate() + 60);
      const futureStr = future.toISOString().slice(0, 10);

      const [blk, ord] = await Promise.all([
        supabase.from("blackout_dates").select("blackout_date").gte("blackout_date", today),
        supabase
          .from("orders")
          .select("pickup_at, status")
          .gte("pickup_at", today)
          .lte("pickup_at", futureStr + "T23:59:59")
          .neq("status", "cancelled"),
      ]);

      setBlackouts((blk.data ?? []).map((b) => b.blackout_date));

      const map: Record<string, string[]> = {};
      for (const o of ord.data ?? []) {
        if (!o.pickup_at) continue;
        const dt = new Date(o.pickup_at);
        const day = dt.toISOString().slice(0, 10);
        const time = dt.toISOString().slice(11, 16);
        (map[day] ??= []).push(time);
      }
      setBookedByDate(map);
    })();
  }, []);

  const dateBooked = pickupDate ? bookedByDate[pickupDate] ?? [] : [];
  const dateFull = dateBooked.length >= DAILY_CAP;
  const dateBlacked = pickupDate ? blackouts.includes(pickupDate) : false;

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

  function continueToDetails() {
    setErr(null);
    if (!pickupDate) return setErr("Please pick a date");
    if (dateBlacked) return setErr("That date is unavailable");
    if (dateFull) return setErr("That date is fully booked — choose another");
    if (!pickupTime) return setErr("Please pick a time slot");
    if (dateBooked.includes(pickupTime)) return setErr("That time slot is taken — choose another");
    setStep("details");
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
    const pickupSlot = `${parsed.data.pickupDate}T${parsed.data.pickupTime}`;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_name: parsed.data.name,
        customer_email: parsed.data.email,
        customer_phone: parsed.data.phone,
        pickup_at: pickupAt,
        pickup_slot: pickupSlot,
        subtotal_cents: subtotalCents,
        total_cents: subtotalCents,
        status: "pending",
        notes: parsed.data.notes || null,
      })
      .select()
      .single();

    if (orderErr || !order) {
      setSubmitting(false);
      setErr(
        orderErr?.message?.includes("orders_pickup_slot_unique")
          ? "That time slot was just taken — please pick another."
          : orderErr?.message ?? "Could not create order",
      );
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
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-4xl text-primary md:text-5xl">Checkout</h1>
            <ol className="mt-3 flex items-center gap-3 text-xs">
              <li
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                  step === "schedule" ? "bg-primary text-primary-foreground" : "bg-accent"
                }`}
              >
                <Calendar className="h-3 w-3" /> 1. Pickup time
              </li>
              <li className="text-muted-foreground">→</li>
              <li
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                  step === "details" ? "bg-primary text-primary-foreground" : "bg-accent"
                }`}
              >
                <ShieldCheck className="h-3 w-3" /> 2. Your details
              </li>
            </ol>
          </div>

          {step === "schedule" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl text-primary">Select a pickup date</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  48-hour minimum notice. Up to 3 orders per day.
                </p>
                <input
                  required
                  type="date"
                  min={minPickupDate}
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    setPickupTime("");
                    setErr(null);
                  }}
                  className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {pickupDate && dateBlacked && (
                  <p className="mt-3 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                    Sorry — we're closed on this day. Please choose another.
                  </p>
                )}
                {pickupDate && !dateBlacked && dateFull && (
                  <p className="mt-3 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                    This day is fully booked ({DAILY_CAP} orders max). Try another date.
                  </p>
                )}
              </div>

              {pickupDate && !dateBlacked && !dateFull && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                  <h2 className="font-display text-xl text-primary">
                    <Clock className="mr-2 inline h-5 w-5" />
                    Pick a time slot
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {DAILY_CAP - dateBooked.length} of {DAILY_CAP} slots remaining today.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((slot) => {
                      const taken = dateBooked.includes(slot);
                      const selected = pickupTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() => {
                            setPickupTime(slot);
                            setErr(null);
                          }}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                            taken
                              ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                              : selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:border-primary"
                          }`}
                        >
                          {formatTime(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {err && <p role="alert" className="text-sm text-destructive">{err}</p>}

              <button
                type="button"
                onClick={continueToDetails}
                disabled={!pickupDate || !pickupTime || dateBlacked || dateFull}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-50"
              >
                Continue to your details →
              </button>
            </div>
          )}

          {step === "details" && (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="rounded-3xl border border-primary/20 bg-accent/30 p-4 text-sm">
                <p className="font-semibold text-primary">
                  Pickup booked for {new Date(pickupDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at {formatTime(pickupTime)}
                </p>
                <button
                  type="button"
                  onClick={() => setStep("schedule")}
                  className="mt-1 text-xs text-primary underline hover:opacity-70"
                >
                  Change pickup time
                </button>
              </div>

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
                  <textarea
                    maxLength={1000}
                    placeholder="Any notes? (allergies, preferences, occasion)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--primary)]"
                />
                <span className="text-foreground/80">
                  I have read and agree to the pickup policies (48-hour notice, $50 minimum, cancellation
                  forfeitures, and no-refund-after-pickup).
                </span>
              </label>

              {err && <p role="alert" className="text-sm text-destructive">{err}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Placing order…" : "Place pickup order (Pay at pickup)"}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Online card payments coming soon — for now your order is reserved as <em>Pay at pickup</em>.
              </p>
            </form>
          )}
        </div>

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

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}
