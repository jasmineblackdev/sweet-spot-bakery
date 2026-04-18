import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Sprinkles } from "@/components/Sprinkles";
import { BestiesSignup } from "@/components/BestiesSignup";
import logo from "@/assets/logo.jpg";
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
            className="h-44 w-44 animate-float rounded-full object-cover shadow-[var(--shadow-glow)] md:h-56 md:w-56"
          />
          <h1 className="font-display text-5xl text-primary drop-shadow-sm md:text-7xl">
            Sweet treats, made with love
          </h1>
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

      {/* GALLERY */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
          <img
            src={bakeryGrid}
            alt="Selection of Frosted Remedies treats and behind-the-scenes moments"
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
