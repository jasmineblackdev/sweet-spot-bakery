import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Heart, Sparkles, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Frosted Remedies | Charlotte, NC Bakery" },
      {
        name: "description",
        content:
          "Frosted Remedies is a Charlotte, NC bakery from co-founders Clare and Julie — premium ingredients, joyful service, and treats that feel like a little remedy.",
      },
      { property: "og:title", content: "About — Frosted Remedies" },
      {
        property: "og:description",
        content: "Meet Clare & Julie, the co-founders behind Frosted Remedies in Charlotte, NC.",
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
          Welcome to FROSTED REMEDIES, where every bite is crafted with love and the finest
          ingredients. Our passion is to create delicious and comforting baked goods and beverages
          that bring a little sweetness to your day. From classic favorites to unique creations, we
          pour our hearts into every recipe.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl text-primary">Our Mission</h2>
            </div>
            <p className="mt-3 text-foreground/80">
              To offer the Charlotte community delightful and comforting baked goods and beverages —
              our "frosted remedies" — fostering a welcoming and joyful experience that cultivates a
              loyal customer base and ultimately leads to a thriving permanent bakery.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl text-primary">Our Vision</h2>
            </div>
            <p className="mt-3 text-foreground/80">
              To become a beloved and established bakery in Charlotte, recognized for its
              exceptional quality, community connection, and dedication to female entrepreneurship,
              where every treat feels like a little remedy.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-2xl text-primary">Our Values</h2>
          <ul className="mt-3 grid gap-2 text-foreground/80 md:grid-cols-2">
            <li>• Premium ingredients</li>
            <li>• Delectable taste</li>
            <li>• Friendly and attentive service</li>
            <li>• Strong community ties</li>
            <li>• The empowerment of women in the culinary world</li>
          </ul>
        </div>

        <h2 className="mt-14 font-display text-4xl text-primary">Meet Our Chefs</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-2xl text-primary">Clare</h3>
            <p className="mt-1 text-sm font-semibold text-foreground/70">Head Baker &amp; Co-Founder</p>
            <p className="mt-3 text-foreground/80">
              Clare has been baking since she could reach the counter. With a background in culinary
              arts and a lifelong love for pastries, she brings a creative and meticulous approach
              to our baking. Her signature recipes are a delightful blend of tradition and
              innovation.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-2xl text-primary">Julie</h3>
            <p className="mt-1 text-sm font-semibold text-foreground/70">Co-Founder</p>
            <p className="mt-3 text-foreground/80">
              Co-Founder and seasoned professional with a rich history in both customer relations
              and the quick service restaurant (QSR) sector. Julie brings a deep-rooted passion for
              fostering exceptional customer experiences, building her career on a foundation of
              understanding customer needs, cultivating strong team performance, and driving
              operational efficiency to consistently exceed expectations.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-primary/30 bg-accent/40 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-6 w-6 text-primary" />
            <div>
              <h2 className="font-display text-2xl text-primary">Whole Cake &amp; Pickup Policies</h2>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80 md:text-base">
                <li>
                  • <strong>48-hour notice</strong> required for whole cakes (unless we have one
                  available in person).
                </li>
                <li>
                  • Payment is required in advance for orders of more than one whole cake.
                </li>
                <li>
                  • In the event of cancellation, you will receive a <strong>50% refund</strong>.
                </li>
                <li>• In-person items are sold while supplies last.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
