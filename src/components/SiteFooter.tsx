import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/50 bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-display text-2xl text-primary">Frosted Remedies</p>
          <p className="mt-1 text-sm text-muted-foreground">Charlotte, NC • Sweet treats, made with love.</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link to="/about" className="text-foreground/70 hover:text-primary">About</Link>
          <Link to="/menu" className="text-foreground/70 hover:text-primary">Menu</Link>
          <Link to="/shop" className="text-foreground/70 hover:text-primary">Shop</Link>
          <Link to="/contact" className="text-foreground/70 hover:text-primary">Contact</Link>
          <Link to="/login" className="text-foreground/70 hover:text-primary">Owner Login</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/frostedremedies"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="mailto:frostedremedies@gmail.com"
            aria-label="Email"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Frosted Remedies. All rights reserved.
      </div>
    </footer>
  );
}
