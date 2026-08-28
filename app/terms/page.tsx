import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms of Service — PrintBolt",
  description: "Terms governing the use of PrintBolt for print shop owners and their customers.",
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

export default function TermsPage() {
  return (
    <div style={{ background: "var(--pb-paper)", minHeight: "100vh" }}>
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

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 100px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pb-accent)", marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--pb-ink)", lineHeight: 1.1, marginBottom: 16 }}>Terms of Service</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--pb-ink-soft)" }}>Last updated: {UPDATED}</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By installing PrintBolt, creating a shopkeeper account, or using any part of the PrintBolt platform, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</p>
          <p style={{ marginTop: 12 }}>These terms apply primarily to <strong>print shop owners (shopkeepers)</strong> who use PrintBolt to manage their print operations.</p>
        </Section>

        <Section title="2. What PrintBolt Is">
          <p>PrintBolt is a software platform that enables print shop owners to offer customers a digital, self-service print job submission experience. The platform consists of:</p>
          <ul style={{ paddingLeft: 24, marginTop: 12 }}>
            <Li>A desktop agent application installed on the shopkeeper&apos;s Windows PC</Li>
            <Li>A web portal (printbolt.store) used by customers to submit print jobs</Li>
            <Li>A cloud backend (Supabase) for data storage and authentication</Li>
            <Li>Payment processing via Razorpay</Li>
          </ul>
        </Section>

        <Section title="3. Shopkeeper Responsibilities">
          <p style={{ marginBottom: 12 }}>As a shopkeeper using PrintBolt, you agree to:</p>
          <ul style={{ paddingLeft: 24 }}>
            <Li>Provide accurate shop information during setup</Li>
            <Li>Set fair and legal pricing for print services</Li>
            <Li>Ensure your PC and printer are in proper working condition</Li>
            <Li>Review and approve print jobs before printing (PrintBolt does not auto-print without your action)</Li>
            <Li>Comply with all applicable Indian laws regarding document printing and copyright</Li>
            <Li>Not use PrintBolt to print illegal, unlawful, or infringing content</Li>
            <Li>Maintain the security of your PrintBolt account credentials</Li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p style={{ marginBottom: 12 }}>You may not use PrintBolt to:</p>
          <ul style={{ paddingLeft: 24 }}>
            <Li>Print or distribute content that violates Indian copyright laws</Li>
            <Li>Process fraudulent payments or misrepresent pricing to customers</Li>
            <Li>Collect or misuse customer data obtained through the platform</Li>
            <Li>Attempt to reverse-engineer, bypass, or tamper with the PrintBolt software or infrastructure</Li>
            <Li>Resell or redistribute PrintBolt software without written authorisation</Li>
          </ul>
        </Section>

        <Section title="5. Payments and Fees">
          <p style={{ marginBottom: 12 }}>Payments made by customers for print jobs are processed by <strong>Razorpay</strong>. By using the payment features, you agree to Razorpay&apos;s terms of service.</p>
          <p style={{ marginBottom: 12 }}>PrintBolt is not a payment processor and is not responsible for payment failures, disputes, or refunds beyond what is technically supported by the platform. Shopkeepers are responsible for their own refund and cancellation policies with customers.</p>
          <p>PrintBolt may charge shopkeepers a platform fee in the future. Any such changes will be communicated in advance.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>The PrintBolt software, branding, design, and underlying systems are the intellectual property of PrintBolt. You are granted a limited, non-exclusive, non-transferable licence to use the software for the purpose of operating your print shop.</p>
          <p style={{ marginTop: 12 }}>Customer-submitted print files remain the property of the respective customers. PrintBolt does not claim any rights over content submitted for printing.</p>
        </Section>

        <Section title="7. Service Availability">
          <p>PrintBolt is provided on an &quot;as available&quot; basis. We aim to maintain high uptime but do not guarantee uninterrupted access. Scheduled maintenance or unforeseen outages may temporarily affect availability. We are not liable for losses resulting from downtime.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>To the maximum extent permitted by applicable law, PrintBolt shall not be liable for:</p>
          <ul style={{ paddingLeft: 24, marginTop: 12 }}>
            <Li>Loss of revenue or profit due to service interruptions</Li>
            <Li>Data loss resulting from hardware failure on the shopkeeper&apos;s premises</Li>
            <Li>Disputes between shopkeepers and their customers</Li>
            <Li>Misuse of the platform by the shopkeeper or their customers</Li>
          </ul>
        </Section>

        <Section title="9. Termination">
          <p>PrintBolt reserves the right to suspend or terminate any shopkeeper account that violates these terms, engages in fraudulent activity, or misuses the platform. Shopkeepers may delete their account at any time by contacting us.</p>
        </Section>

        <Section title="10. Governing Law">
          <p>These Terms of Service are governed by the laws of India. Any disputes arising from the use of PrintBolt shall be subject to the jurisdiction of courts in India.</p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>We may update these Terms of Service from time to time. Continued use of PrintBolt after changes are posted constitutes acceptance of the revised terms. Material changes will be communicated to registered shopkeepers.</p>
        </Section>

        <Section title="12. Contact">
          <p>For questions about these terms, contact us:</p>
          <ul style={{ paddingLeft: 24, marginTop: 12 }}>
            <Li>WhatsApp: <a href="https://wa.me/916000061991" style={{ color: "var(--pb-accent)" }}>+91 60000 61991</a></Li>
            <Li>Phone: <a href="tel:+916000061991" style={{ color: "var(--pb-accent)" }}>+91 60000 61991</a></Li>
            <Li>Website: <a href="https://printbolt.store" style={{ color: "var(--pb-accent)" }}>printbolt.store</a></Li>
          </ul>
        </Section>
      </main>

      <footer style={{ borderTop: "1px solid var(--pb-border)", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--pb-ink-faint)" }}>
          &copy; 2026 PrintBolt &mdash; <Link href="/privacy" style={{ color: "var(--pb-ink-faint)", textDecoration: "none" }}>Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
