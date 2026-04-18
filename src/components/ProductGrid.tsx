import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatPrice } from "@/lib/cart";
import { Plus, Minus, ImageOff } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Enums"]["product_category"];

export function ProductGrid({ category }: { category: Category }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("sort_order", { ascending: true });
      if (cancel) return;
      if (error) setErr(error.message);
      else setProducts(data ?? []);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [category]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-3xl border border-border bg-card" />
        ))}
      </div>
    );
  }

  if (err) {
    return <p className="text-destructive">Could not load products: {err}</p>;
  }

  if (!products.length) {
    return <p className="text-muted-foreground">No products yet — check back soon!</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add, items, setQty } = useCart();
  const inCart = items.find((i) => i.productId === product.id);
  const isComingSoon = !product.available;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1">
      {isComingSoon && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
          Coming soon
        </span>
      )}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-accent/40">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/40">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl text-primary">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price_cents)}
          </span>

          {isComingSoon ? (
            <span className="text-xs font-medium text-muted-foreground">Not yet available</span>
          ) : inCart ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-2 py-1">
              <button
                aria-label={`Decrease ${product.name}`}
                onClick={() => setQty(product.id, inCart.quantity - 1)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-primary hover:bg-primary/10"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-6 text-center text-sm font-semibold">{inCart.quantity}</span>
              <button
                aria-label={`Increase ${product.name}`}
                onClick={() => setQty(product.id, inCart.quantity + 1)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-primary hover:bg-primary/10"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                add({
                  productId: product.id,
                  name: product.name,
                  unitPriceCents: product.price_cents,
                  imageUrl: product.image_url,
                })
              }
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
