import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart, formatPrice } from "@/lib/cart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Frosted Remedies" },
      { name: "description", content: "Review your Frosted Remedies cart and checkout for pickup." },
    ],
  }),
  component: CartPage,
});

const PICKUP_MIN_CENTS = 5000;

function CartPage() {
  const { items, setQty, remove, subtotalCents } = useCart();
  const belowMin = subtotalCents < PICKUP_MIN_CENTS;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-5xl text-primary md:text-6xl">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-primary/60" />
            <p className="text-foreground/80">Your cart is empty — let's fix that.</p>
            <Link
              to="/menu"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Browse Sweet Treats
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="h-16 w-16 flex-none overflow-hidden rounded-xl bg-accent/40">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.unitPriceCents)} each
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
                    <button
                      aria-label="Decrease"
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-primary hover:bg-primary/10"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Increase"
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="w-20 text-right font-semibold">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </p>
                  <button
                    onClick={() => remove(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-2xl text-primary">Order Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatPrice(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pickup minimum</dt>
                  <dd className="text-muted-foreground">{formatPrice(PICKUP_MIN_CENTS)}</dd>
                </div>
              </dl>

              {belowMin && (
                <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                  Add {formatPrice(PICKUP_MIN_CENTS - subtotalCents)} more to reach the $50 pickup
                  minimum.
                </p>
              )}

              {belowMin ? (
                <button
                  disabled
                  className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-muted px-6 py-3 text-sm font-semibold text-muted-foreground"
                >
                  Proceed to checkout
                </button>
              ) : (
                <Link
                  to="/checkout"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
                >
                  Proceed to checkout →
                </Link>
              )}

              <Link
                to="/menu"
                className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary"
              >
                ← Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
