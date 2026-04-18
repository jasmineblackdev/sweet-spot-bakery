import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductGrid } from "@/components/ProductGrid";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Frosted Remedies" },
      {
        name: "description",
        content:
          "Hand-poured candles, branded tumblers and more — shop the Frosted Remedies non-food collection.",
      },
      { property: "og:title", content: "Shop — Frosted Remedies" },
      {
        property: "og:description",
        content: "Candles, tumblers, and limited-edition pieces from Frosted Remedies.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-5xl text-primary md:text-6xl">The Shop</h1>
        <p className="mt-3 max-w-2xl text-foreground/80">
          Candles, tumblers, and a few limited treasures. More coming soon — stickers, enamel pins,
          t-shirts, stuffies and one-of-a-kind paintings.
        </p>

        <div className="mt-10">
          <ProductGrid category="shop" />
        </div>
      </section>
    </SiteLayout>
  );
}
