import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Heart, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Frosted Remedies" },
      {
        name: "description",
        content:
          "Frosted Remedies is a small whimsical bakery offering fresh-baked treats with $50 minimum pickup orders and a 72-hour notice policy.",
      },
      { property: "og:title", content: "About — Frosted Remedies" },
      {
        property: "og:description",
        content: "Meet the bakers behind Frosted Remedies and learn about our pickup policies.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-5xl text-primary md:text-6xl">About Frosted Remedies</h1>
        <p className="mt-4 text-lg text-foreground/80">
          A whimsical, sparkly little bakery — born from a love of sweet treats, friendship, and
          making people smile. Everything is fresh-baked in small batches, with a side of glitter.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl text-primary">Our Bakers</h2>
            </div>
            <p className="mt-3 text-foreground/80">
              We're a tiny team with big hearts, baking out of love for our community. Bios coming
              soon — for now, just know every treat is made with care.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl text-primary">Fresh-Baked Items</h2>
            </div>
            <p className="mt-3 text-foreground/80">
              Available on-site daily while supplies last, or pre-order for pickup with a 72-hour
              notice.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-primary/30 bg-accent/40 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 text-primary" />
            <div>
              <h2 className="font-display text-2xl text-primary">Pickup Policies</h2>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80 md:text-base">
                <li>• <strong>$50 minimum</strong> for pickup orders (mix and match welcome).</li>
                <li>• <strong>72-hour notice</strong> required for all pre-orders.</li>
                <li>
                  • Cancel less than 24 hours before pickup → you forfeit <strong>20%</strong>.
                </li>
                <li>
                  • Don't like the order at pickup → you forfeit <strong>20%</strong>.
                </li>
                <li>
                  • No-show within 1 hour of scheduled pickup → no refund; order will be sold at a
                  discount or discarded.
                </li>
                <li>• <strong>No refunds once an order is picked up.</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
