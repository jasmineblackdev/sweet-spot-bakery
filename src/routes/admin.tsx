import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatPrice } from "@/lib/cart";
import type { Database } from "@/integrations/supabase/types";
import { Plus, Save, Trash2, Upload, LogOut, ShieldAlert } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Frosted Remedies" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        if (mounted) navigate({ to: "/login" });
        return;
      }
      const userId = sess.session.user.id;
      setUserEmail(sess.session.user.email ?? null);
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) {
        setIsAdmin(Boolean(roleRow));
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 font-display text-4xl text-primary">Not an admin</h1>
          <p className="mt-3 text-foreground/80">
            You're signed in as <strong>{userEmail}</strong>, but this account doesn't have admin
            access.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask the owner to add an <code>admin</code> role to your account in the Cloud dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={signOut}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm"
            >
              Sign out
            </button>
            <Link
              to="/"
              className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
            >
              Back home
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl text-primary md:text-5xl">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Signed in as {userEmail}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>

        <div className="mt-10 grid gap-10">
          <ProductsManager />
          <OrdersList />
          <BestiesList />
        </div>
      </section>
    </SiteLayout>
  );
}

// --------- Products ---------

function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState<Product["category"]>("sweet_treat");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("category")
      .order("sort_order");
    setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function update(p: Product, patch: Partial<Product>) {
    setSavingId(p.id);
    await supabase.from("products").update(patch).eq("id", p.id);
    setSavingId(null);
    void load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    void load();
  }

  async function uploadImage(p: Product, file: File) {
    const path = `${p.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (upErr) {
      alert("Upload failed: " + upErr.message);
      return;
    }
    const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
    await update(p, { image_url: pub.publicUrl });
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const cents = Math.round(parseFloat(newPrice) * 100);
    if (!Number.isFinite(cents) || cents < 0 || !newName.trim()) {
      setCreating(false);
      return;
    }
    await supabase.from("products").insert({
      name: newName.trim(),
      price_cents: cents,
      category: newCat,
    });
    setNewName("");
    setNewPrice("");
    setCreating(false);
    void load();
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-primary">Products & Pricing</h2>

      <form
        onSubmit={createProduct}
        className="mt-4 grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_120px_160px_auto]"
      >
        <input
          required maxLength={120} placeholder="Product name" value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          required type="number" step="0.01" min="0" placeholder="Price ($)" value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={newCat}
          onChange={(e) => setNewCat(e.target.value as Product["category"])}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="sweet_treat">Sweet Treat</option>
          <option value="shop">Shop</option>
          <option value="on_site_only">On-site Only</option>
        </select>
        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Available</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  saving={savingId === p.id}
                  onSave={update}
                  onDelete={remove}
                  onUpload={uploadImage}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductRow({
  product,
  saving,
  onSave,
  onDelete,
  onUpload,
}: {
  product: Product;
  saving: boolean;
  onSave: (p: Product, patch: Partial<Product>) => void;
  onDelete: (id: string) => void;
  onUpload: (p: Product, file: File) => void;
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState((product.price_cents / 100).toFixed(2));
  const dirty = name !== product.name || price !== (product.price_cents / 100).toFixed(2);

  return (
    <tr className="border-t border-border">
      <td className="p-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-accent/40">
          {product.image_url && (
            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
          )}
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 text-transparent hover:bg-black/40 hover:text-white">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(product, f);
              }}
            />
          </label>
        </div>
      </td>
      <td className="p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
        />
      </td>
      <td className="p-3">
        <input
          type="number" step="0.01" min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-sm"
        />
      </td>
      <td className="p-3">
        <select
          value={product.category}
          onChange={(e) =>
            onSave(product, { category: e.target.value as Product["category"] })
          }
          className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
        >
          <option value="sweet_treat">Sweet Treat</option>
          <option value="shop">Shop</option>
          <option value="on_site_only">On-site Only</option>
        </select>
      </td>
      <td className="p-3">
        <input
          type="checkbox"
          checked={product.available}
          onChange={(e) => onSave(product, { available: e.target.checked })}
          className="h-4 w-4 accent-[var(--primary)]"
        />
      </td>
      <td className="p-3">
        <div className="flex justify-end gap-2">
          {dirty && (
            <button
              onClick={() =>
                onSave(product, {
                  name,
                  price_cents: Math.round(parseFloat(price) * 100),
                })
              }
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
            >
              <Save className="h-3 w-3" /> Save
            </button>
          )}
          <button
            onClick={() => onDelete(product.id)}
            aria-label="Delete"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// --------- Orders ---------

function OrdersList() {
  const [orders, setOrders] = useState<(Order & { items?: { product_name: string; quantity: number }[] })[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(product_name, quantity)")
        .order("created_at", { ascending: false })
        .limit(50);
      setOrders((data as never) ?? []);
    })();
  }, []);

  async function setStatus(id: string, status: Order["status"]) {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-primary">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer_email} · {o.customer_phone}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pickup: {o.pickup_at ? new Date(o.pickup_at).toLocaleString() : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(o.total_cents)}</p>
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}
                    className="mt-1 rounded-lg border border-border bg-background px-2 py-1 text-xs"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="ready">ready</option>
                    <option value="picked_up">picked up</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
              {o.items && o.items.length > 0 && (
                <ul className="mt-2 text-xs text-foreground/80">
                  {o.items.map((it, idx) => (
                    <li key={idx}>
                      • {it.product_name} × {it.quantity}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------- Besties ---------

type Bestie = Database["public"]["Tables"]["besties"]["Row"];

function BestiesList() {
  const [list, setList] = useState<Bestie[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("besties")
        .select("*")
        .order("created_at", { ascending: false });
      setList(data ?? []);
    })();
  }, []);
  return (
    <div>
      <h2 className="font-display text-2xl text-primary">Besties Club</h2>
      <p className="text-sm text-muted-foreground">
        Members signed up for SMS rewards. SMS sending will be wired up via Twilio next.
      </p>
      {list.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No signups yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Birthday</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">{b.birthday ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
