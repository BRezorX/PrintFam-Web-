# PrintBolt Web Portal (`customer-web`) — Project Memory & AI Context

## 1. Project Overview & Identity
- **Product Name:** PrintBolt
- **Domain:** `https://printbolt.store`
- **Hosting / Platform:** Cloudflare Pages (`printfam-web.pages.dev`)
- **GitHub Repository:** `https://github.com/BRezorX/PrintFam-Web-.git` (branch: `main`)
- **Purpose:** Public marketing homepage, customer QR-based print kiosk, and Edge API payment & version infrastructure.

---

## 2. Technology Stack
- **Framework:** Next.js 14.2.5 (App Router)
- **Styling:** Tailwind CSS + CSS keyframe animations (in `globals.css`)
- **Icons:** `lucide-react`
- **Database & Storage:** Supabase (`@supabase/supabase-js`)
- **Payment Gateway:** Razorpay Standard Checkout (`checkout.razorpay.com/v1/checkout.js`)
- **Runtime:** Cloudflare Edge Network (via `@cloudflare/next-on-pages@1.13.16`)

---

## 3. Routing & Page Directory

| Route | Type | Description | Critical Notes |
|---|---|---|---|
| `/` | Static | Premium marketing homepage (Swiss/Typographic dark mode). | Standalone layout with custom nav and footer. |
| `/p` | Static / Dynamic | Customer Print Ordering Portal (`/p?shopId=UUID`). | **CRITICAL: NEVER MODIFY OR BREAK.** QR scan destination. |
| `/print` | Static | Document upload and print options selection. | Uses `AppShell.js` and `PrintOptions.js`. |
| `/status` | Static | Real-time order and print status tracker. | Polls job state from Supabase. |
| `/api/create-order` | Edge API | Creates Razorpay order using native `fetch` + `btoa`. | Edge runtime compatible. |
| `/api/verify-payment` | Edge API | Verifies HMAC-SHA256 signature using `crypto.subtle`. | Edge Web Crypto API (no Node `crypto`). |
| `/api/app-version` | Edge API | Returns latest desktop agent version & download URL. | Used by `PrintBolt-Agent` auto-updater. |

---

## 4. Cloudflare Pages Deployment & Build Rules (CRITICAL)

> [!IMPORTANT]
> **Do not modify the `package.json` build script to call `next-on-pages`!**
> Calling `next-on-pages` inside `npm run build` causes infinite recursion during Cloudflare Pages builds.

- **`package.json` build script:** `"build": "next build"`
- **Cloudflare Build Command:** `npx @cloudflare/next-on-pages`
- **Cloudflare Build Output Directory:** `.vercel/output/static`
- **Cloudflare Framework Preset:** `None`
- **Required Cloudflare Environment Variable:** `NPM_CONFIG_LEGACY_PEER_DEPS = true` (resolves peer dependency conflict between Next 14.2.5 and `@cloudflare/next-on-pages`).

---

## 5. Required Environment Variables
Configure in `.env.local` for local development and in **Cloudflare Pages -> Settings -> Variables and secrets**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vqlhbnrpthhtqgoayucf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
NPM_CONFIG_LEGACY_PEER_DEPS=true
```

---

## 6. Guidelines for Future AI Coding Sessions
1. **Preserve Customer Flow:** Never alter or remove `/p`, `/print`, or `AppShell.js` unless explicitly asked.
2. **Edge Compatibility:** All `/api/*` routes MUST run with `export const runtime = 'edge';` and use Web Standard APIs (`fetch`, `crypto.subtle`, `btoa`) — do not import Node.js core modules (`fs`, `path`, Node `crypto`).
3. **App Version Publishing:** To release an update for the desktop app, edit `app/api/app-version/route.ts` with the new version string and download link.
