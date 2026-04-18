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
