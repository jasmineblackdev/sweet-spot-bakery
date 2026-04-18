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
        <h1 className="font-display text-5xl text-primary md:text-6xl">Sweet Treats</h1>
        <p className="mt-3 max-w-2xl text-foreground/80">
          Sold on-site while supplies last, or pre-order for pickup (72 hours in advance, $50
          minimum).
        </p>

        <div className="mt-10">
          <ProductGrid category="sweet_treat" />
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-3xl text-primary">Sold on-site only</h2>
          <ul className="mt-4 grid gap-2 text-foreground/80 md:grid-cols-2">
            <li>• Coffee (with liquid sugar &amp; half/half)</li>
            <li>• Bottled water</li>
            <li>• ZOLLIPOP lollipops</li>
            <li>• Plantlings (whatever's on hand 🌱)</li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
