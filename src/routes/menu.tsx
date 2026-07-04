import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductGrid } from "@/components/ProductGrid";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Sweet Treats — Frosted Remedies" },
      {
        name: "description",
        content:
          "Browse our menu of fresh-baked banana bread, cakes, muffins, cookies, brownies, lemonade and sweet tea. Order online for pickup.",
      },
      { property: "og:title", content: "Sweet Treats — Frosted Remedies" },
      {
        property: "og:description",
        content: "Fresh-baked treats available on-site or pre-order for pickup (72hr notice).",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl text-primary md:text-6xl">Our Delicious Menu</h1>
        <p className="mt-3 max-w-2xl text-foreground/80">
          In-person items sold while supplies last. Whole cakes require 48 hours notice — cookies
          are 2 for $5 (save $0.50). Cookies $2.75 each • Jumbo muffins $3.50 (= 2 regular).
        </p>

        {/* Gallery — free stock photos to show off the vibe. Swap in your own any time. */}
        <div className="mt-8">
          <h2 className="font-display text-2xl text-primary">Fresh from the oven</h2>
          <p className="mt-1 text-sm text-foreground/70">
            A little taste of what we bake — the real menu is just below.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { id: "1486427944299-d1955d23e34d", alt: "Pastel frosted cupcakes" },
              { id: "1551024601-bec78aea704b", alt: "Chocolate donuts with rainbow sprinkles" },
              { id: "1578985545062-69928b1d9587", alt: "Chocolate drip layer cake" },
              { id: "1499636136210-6f4ee915583e", alt: "Salted chocolate chunk cookies" },
              { id: "1565958011703-44f9829ba187", alt: "Raspberry cream layer cake slice" },
              { id: "1519869325930-281384150729", alt: "Cupcakes topped with sprinkles" },
            ].map(({ id, alt }) => (
              <img
                key={id}
                src={`https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`}
                alt={alt}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ProductGrid category="sweet_treat" />
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-3xl text-primary">Sold on-site only</h2>
          <ProductGrid category="on_site_only" />
        </div>
      </section>
    </SiteLayout>
  );
}
