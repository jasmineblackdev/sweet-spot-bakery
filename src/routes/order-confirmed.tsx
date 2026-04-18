import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : "",
  }),
  head: () => ({
    meta: [{ title: "Order confirmed — Frosted Remedies" }],
  }),
  component: OrderConfirmedPage,
});

function OrderConfirmedPage() {
  const { id } = Route.useSearch();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 font-display text-4xl text-primary md:text-5xl">Order received! 💜</h1>
        <p className="mt-4 text-foreground/80">
          We'll start prepping your order. You'll get a text/email confirmation when it's ready for
          pickup.
        </p>
        {id && (
          <p className="mt-2 text-xs text-muted-foreground">
            Reference: <code>{id.slice(0, 8)}</code>
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Back to home
          </Link>
          <Link to="/menu" className="rounded-full border border-primary/30 bg-card px-6 py-3 text-sm font-semibold text-primary">
            Order more
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
