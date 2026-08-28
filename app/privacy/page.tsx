import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy — PrintBolt",
  description: "How PrintBolt collects, uses, and protects data for print shop owners and their customers.",
};

const UPDATED = "28 August 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--pb-ink)", letterSpacing: "-0.01em", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--pb-border)" }}>{title}</h2>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.75, color: "var(--pb-ink-mid)" }}>{children}</div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ marginBottom: 8 }}>{children}</li>;
}

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--pb-paper)", minHeight: "100vh" }}>
      {/* Nav strip */}
      <header style={{ borderBottom: "1px solid var(--pb-border)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/logo.jpg" alt="PrintBolt" width={30} height={30} style={{ borderRadius: 7, objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--pb-ink)", letterSpacing: "-0.02em" }}>PrintBolt</span>
          </Link>
          <Link href="/" style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, color: "var(--pb-ink-mid)", textDecoration: "none" }}>
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 100px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pb-accent)", marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--pb-ink)", lineHeight: 1.1, marginBottom: 16 }}>Privacy Policy</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--pb-ink-soft)" }}>Last updated: {UPDATED}</p>
        </div>

        <Section title="1. Overview">
          <p>PrintBolt (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) operates the software and services available at printbolt.store. This Privacy Policy explains how we collect, use, store, and protect personal data when print shop owners and their customers use PrintBolt.</p>
          <p style={{ marginTop: 12 }}>PrintBolt is a B2B platform. The primary users of our platform are <strong>print shop owners (shopkeepers)</strong> who install and operate PrintBolt at their premises. Customers who use a shopkeeper&apos;s PrintBolt portal are indirect users of the platform.</p>
        </Section>

        <Section title="2. Data We Collect">
          <p style={{ marginBottom: 12 }}><strong>From Print Shop Owners (Shopkeepers):</strong></p>
          <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
            <Li>Email address and password (used for account creation and authentication via Supabase Auth)</Li>
            <Li>Shop name and configuration details (pricing, print preferences)</Li>
            <Li>Print job history and revenue data (stored in your shop audit ledger)</Li>
            <Li>QR code and shop link data</Li>
          </ul>
          <p style={{ marginBottom: 12 }}><strong>From Customers (when using a shopkeeper&apos;s print portal):</strong></p>
          <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
            <Li>PDF or document files uploaded for printing (temporarily stored during job processing)</Li>
            <Li>Print job configuration (number of copies, colour mode, duplex preference)</Li>
            <Li>Payment amount and Razorpay order/payment IDs (we do not store card or UPI details)</Li>
          </ul>
          <p style={{ marginBottom: 12 }}><strong>Automatically Collected:</strong></p>
          <ul style={{ paddingLeft: 24 }}>
            <Li>IP addresses and browser information (collected by Cloudflare, our hosting provider)</Li>
            <Li>Page access logs and performance metrics (via Cloudflare Pages analytics)</Li>
          </ul>
        </Section>

        <Section title="3. How We Use Data">
          <ul style={{ paddingLeft: 24 }}>
            <Li>To authenticate and manage shopkeeper accounts</Li>
            <Li>To route customer print jobs to the correct shop printer</Li>
            <Li>To process payments via Razorpay</Li>
            <Li>To maintain a print job audit ledger for shopkeeper reference</Li>
            <Li>To operate and improve the PrintBolt platform</Li>
            <Li>To respond to support or onboarding enquiries</Li>
          </ul>
        </Section>

        <Section title="4. Data Storage and Retention">
          <p style={{ marginBottom: 12 }}>Shopkeeper account data and print audit records are stored securely in <strong>Supabase</strong> (our database provider). Access to this data is controlled by row-level security policies — each shopkeeper can only access their own records.</p>
          <p style={{ marginBottom: 12 }}>Customer-uploaded print files are handled transiently. Files are processed locally by the PrintBolt desktop agent installed on the shopkeeper&apos;s PC. Files are not permanently retained by PrintBolt&apos;s servers after the job is complete.</p>
          <p>Payment data (order IDs, verification tokens) is stored only to confirm payment status. Sensitive payment details (card numbers, UPI IDs) are handled exclusively by <strong>Razorpay</strong> and are never transmitted to or stored by PrintBolt.</p>
        </Section>

        <Section title="5. Third-Party Services">
          <p style={{ marginBottom: 12 }}>PrintBolt uses the following third-party services:</p>
          <ul style={{ paddingLeft: 24 }}>
            <Li><strong>Supabase</strong> — Database and authentication. Data is governed by Supabase&apos;s Privacy Policy.</Li>
            <Li><strong>Razorpay</strong> — Payment processing. Razorpay is a PCI-DSS compliant payment gateway. PrintBolt does not store payment credentials. Governed by Razorpay&apos;s Privacy Policy.</Li>
            <Li><strong>Cloudflare</strong> — Web hosting, CDN, and DDoS protection. Cloudflare may collect IP addresses and browser metadata per their Privacy Policy.</Li>
          </ul>
        </Section>

        <Section title="6. Data Security">
          <p>We use industry-standard security practices including HTTPS encryption for all data in transit, Supabase row-level security for database isolation per shopkeeper, and Cloudflare&apos;s security infrastructure at the network level. No system can guarantee absolute security, but we take reasonable precautions to protect your data.</p>
        </Section>

        <Section title="7. Your Rights">
          <p style={{ marginBottom: 12 }}>If you are a registered shopkeeper, you may:</p>
          <ul style={{ paddingLeft: 24 }}>
            <Li>Request access to your stored account data</Li>
            <Li>Request deletion of your account and associated data</Li>
            <Li>Contact us to correct inaccurate information</Li>
          </ul>
          <p style={{ marginTop: 12 }}>To exercise these rights, contact us via WhatsApp at <a href="https://wa.me/916000061991" style={{ color: "var(--pb-accent)" }}>+91 60000 61991</a> or call us directly.</p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>We may update this Privacy Policy as the platform evolves. Significant changes will be communicated to registered shopkeepers. Continued use of PrintBolt after any update constitutes acceptance of the revised policy.</p>
        </Section>

        <Section title="9. Contact">
          <p>For any privacy-related questions, contact the PrintBolt team:</p>
          <ul style={{ paddingLeft: 24, marginTop: 12 }}>
            <Li>WhatsApp: <a href="https://wa.me/916000061991" style={{ color: "var(--pb-accent)" }}>+91 60000 61991</a></Li>
            <Li>Phone: <a href="tel:+916000061991" style={{ color: "var(--pb-accent)" }}>+91 60000 61991</a></Li>
            <Li>Website: <a href="https://printbolt.store" style={{ color: "var(--pb-accent)" }}>printbolt.store</a></Li>
          </ul>
        </Section>
      </main>

      <footer style={{ borderTop: "1px solid var(--pb-border)", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--pb-ink-faint)" }}>
          &copy; 2026 PrintBolt &mdash; <Link href="/terms" style={{ color: "var(--pb-ink-faint)", textDecoration: "none" }}>Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
}
