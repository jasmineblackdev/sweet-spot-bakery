// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: Vercel.
// The Lovable config only runs the Nitro deploy plugin when `nitro` is set
// explicitly (or inside a Lovable sandbox); on Vercel it would otherwise be
// skipped, producing a client-only build that 404s on every route.
// We enable Nitro's `vercel` preset and point the output at `.vercel/output`
// (the Build Output API dir Vercel auto-detects), overriding the wrapper's
// hardcoded `dist/` output paths.
export default defineConfig({
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      serverDir: ".vercel/output/functions/__server.func",
      publicDir: ".vercel/output/static",
    },
  },
});
