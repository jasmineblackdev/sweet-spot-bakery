import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Sprinkles } from "@/components/Sprinkles";
import { BestiesSignup } from "@/components/BestiesSignup";
import logo from "@/assets/logo.png";
import bakeryGrid from "@/assets/bakery-grid.jpg";
import { ArrowRight, Cookie, Cake, Coffee } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Frosted Remedies — Whimsical purple bakery" },
      {
        name: "description",
        content:
          "Whimsical, sparkly, purple bakery serving fresh-baked banana bread, cookies, brownies, cakes and more. Pickup orders welcome.",
      },
      { property: "og:title", content: "Frosted Remedies — Whimsical purple bakery" },
      {
        property: "og:description",
        content: "Sweet treats made with love — order online for pickup.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        <Sprinkles count={70} />

        <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
          <img
            src={logo}
            alt="Frosted Remedies logo"
            className="h-auto w-[min(90%,520px)] animate-float object-contain drop-shadow-[var(--shadow-glow)]"
          />
          <h1 className="sr-only">Frosted Remedies — Sweet treats, made with love</h1>
          <p className="font-display text-3xl text-primary drop-shadow-sm md:text-5xl">
            Sweet treats, made with love
          </p>
          <p className="max-w-2xl text-base text-foreground/80 md:text-lg">
            Whimsical, sparkly, purple — fresh-baked banana bread, cookies, brownies, cakes, and a
            cozy little shop full of candles and tumblers.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
            >
              Order Sweet Treats <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-card"
            >
              Visit the Shop
            </Link>
          </div>
        </div>
      </section>

      {/* BESTIES */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <BestiesSignup />
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-3 md:py-12">
        {[
          {
            icon: Cake,
            title: "Fresh-baked daily",
            text: "Banana bread, cakes, muffins, brownies, cookies — limited supply on-site.",
          },
          {
            icon: Cookie,
            title: "Pre-order for pickup",
            text: "$50 minimum, 72-hour notice. Pickup only — no delivery.",
          },
          {
            icon: Coffee,
            title: "Cozy little shop",
            text: "Hand-poured candles, branded tumblers, and limited-edition treasures.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
          >
            <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-display text-2xl text-primary">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      {/* GALLERY — From Our Kitchen */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-4xl text-primary md:text-5xl">From Our Kitchen</h2>
        <p className="mt-2 text-foreground/70">
          A peek into the bakes, the moments, and the magic. (Placeholder media — swap in your own
          photos and videos any time.)
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80"
            alt="Freshly baked muffins on a cooling rack"
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
          />
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80"
            alt="Decorated cupcakes with frosting swirls"
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
          />
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
            alt="Chocolate chip cookies stacked on parchment"
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
          />
          <video
            src="https://cdn.pixabay.com/video/2020/04/30/38732-415054249_large.mp4"
            poster="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80"
            muted
            loop
            playsInline
            autoPlay
            className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
          />
          <img
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"
            alt="Slice of layered chocolate cake"
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
          />
          <video
            src="https://cdn.pixabay.com/video/2019/10/09/27725-365224679_large.mp4"
            poster="https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80"
            muted
            loop
            playsInline
            autoPlay
            className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
