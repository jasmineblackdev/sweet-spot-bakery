import { Link, useLocation } from "@tanstack/react-router";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpg";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/menu", label: "Sweet Treats" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  return (
    <header className="relative z-30 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 md:py-5">
        {/* Logo (centered) */}
        <Link to="/" className="group flex flex-col items-center" aria-label="Frosted Remedies home">
          <img
            src={logo}
            alt="Frosted Remedies"
            className="h-16 w-16 rounded-full object-cover shadow-[var(--shadow-soft)] transition-transform group-hover:scale-105 md:h-20 md:w-20"
          />
          <span className="mt-1 font-display text-xl text-primary md:text-2xl">Frosted Remedies</span>
        </Link>

        {/* Desktop nav under logo */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/cart"
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-primary hover:text-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile burger */}
        <div className="flex w-full items-center justify-between md:hidden">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>

        {open && (
          <nav
            className="flex w-full flex-col gap-1 md:hidden"
            aria-label="Mobile primary"
            onClick={() => setOpen(false)}
          >
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground/80 hover:bg-accent",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
