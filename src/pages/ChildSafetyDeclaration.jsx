import { useState } from "react";

// ─── Replace these constants with your actual values ───────────────────────
const APP_NAME = "TWIMBOL";
const COMPANY_NAME = "TWIMBOL";
const CONTACT_EMAIL = "twimbol@gmail.com";
const APP_TARGET_AGE = "13+";
const LAST_UPDATED = "April 14, 2026";
const POLICY_VERSION = "2.0";
// ──────────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F5F2ED;
    --surface: #FFFFFF;
    --surface-2: #EDE9E2;
    --ink: #1A1814;
    --ink-muted: #6B6558;
    --accent: #FF6E42;
    --accent-light: #FCF3D4;
    --accent-dark: #1A3BAD;
    --green: #1A7A4A;
    --green-light: #E6F5ED;
    --border: #D8D3C8;
    --shadow: 0 1px 3px rgba(26,24,20,0.08), 0 4px 16px rgba(26,24,20,0.06);
    --shadow-lg: 0 8px 32px rgba(26,24,20,0.12);
    --radius: 12px;
    --radius-lg: 20px;
  }

  body { background: var(--bg); color: var(--ink); font-family: 'DM Sans', sans-serif; }

  .page-wrap {
    min-height: 100vh;
    background: var(--bg);
    padding: 0 0 80px;
  }

  /* ── Hero Banner ── */
  .hero {
    background: linear-gradient(135deg, #1A3BAD 0%, #2B5BE0 55%, #1A7A4A 100%);
    padding: 64px 24px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 30px;
    margin-bottom: 24px;
  }
  .logo {
  border-radius: 15px;
  width: 10rem;}

  .hero-badge svg { width: 14px; height: 14px; }
  .hero h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(32px, 5vw, 52px);
    color: #fff;
    line-height: 1.1;
    margin-bottom: 16px;
    position: relative;
  }
  .hero h1 em {
    font-style: italic;
    color: rgba(255,255,255,0.75);
  }
  .hero-sub {
    font-size: 17px;
    color: rgba(255,255,255,0.8);
    max-width: 560px;
    margin: 0 auto 32px;
    line-height: 1.6;
    font-weight: 300;
  }
  .hero-meta {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }
  .hero-meta-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(255,255,255,0.9);
  }
  .hero-meta-item span:first-child {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.65;
    margin-bottom: 2px;
  }
  .hero-meta-item span:last-child {
    font-size: 15px;
    font-weight: 600;
  }

  /* ── Layout ── */
  .content {
    max-width: 860px;
    margin: -32px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 1;
  }

  /* ── Status Card ── */
  .status-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 28px 32px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-left: 4px solid var(--green);
  }
  .status-icon {
    width: 52px;
    height: 52px;
    background: var(--green-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--green);
  }
  .status-icon svg { width: 26px; height: 26px; }
  .status-text h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: var(--green);
    margin-bottom: 4px;
  }
  .status-text p {
    font-size: 14px;
    color: var(--ink-muted);
    line-height: 1.5;
  }

  /* ── Section Card ── */
  .section-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    margin-bottom: 20px;
    overflow: hidden;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 28px;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  .section-header:hover { background: var(--surface-2); }
  .section-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .section-icon svg { width: 20px; height: 20px; }
  .section-title {
    flex: 1;
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    color: var(--ink);
  }
  .section-chevron {
    color: var(--ink-muted);
    transition: transform 0.25s ease;
    flex-shrink: 0;
  }
  .section-chevron.open { transform: rotate(180deg); }
  .section-body {
    padding: 0 28px 24px;
    animation: fadeDown 0.2s ease;
    border-top: 1px solid var(--border);
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .section-body p {
    font-size: 15px;
    color: var(--ink-muted);
    line-height: 1.7;
    margin-top: 16px;
  }
  .section-body p + p { margin-top: 12px; }

  /* ── Checklist ── */
  .checklist {
    list-style: none;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .checklist li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 15px;
    color: var(--ink-muted);
    line-height: 1.5;
  }
  .check-icon {
    width: 20px;
    height: 20px;
    background: var(--green-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--green);
  }
  .check-icon svg { width: 11px; height: 11px; }

  .privacy-policy-link{
  color: var(--accent);
  }

  /* ── Info Grid ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 16px;
  }
  @media (max-width: 540px) {
    .info-grid { grid-template-columns: 1fr; }
    .hero { padding: 40px 16px 48px !important; }
    .content { padding: 0 14px !important; }
    .status-card { padding: 20px 18px !important; }
    .section-header { padding: 18px !important; }
    .section-body { padding: 0 18px 20px !important; }
    .contact-card { padding: 24px 18px !important; }
  }
  .info-item {
    background: var(--surface-2);
    border-radius: var(--radius);
    padding: 14px 16px;
  }
  .info-item .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-muted);
    margin-bottom: 4px;
  }
  .info-item .value {
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
  }

  /* ── Highlight Box ── */
  .highlight-box {
    background: var(--accent-light);
    border: 1px solid rgba(43,91,224,0.2);
    border-radius: var(--radius);
    padding: 16px 18px;
    margin-top: 16px;
    font-size: 14px;
    color: var(--accent-dark);
    line-height: 1.6;
  }

  /* ── Warning Box ── */
  .warning-box {
    background: #FFF8E6;
    border: 1px solid #F0C040;
    border-radius: var(--radius);
    padding: 16px 18px;
    margin-top: 16px;
    font-size: 14px;
    color: #7A5A00;
    line-height: 1.6;
  }

  /* ── Contact Card ── */
  .contact-card {
    background: linear-gradient(135deg, var(--ink) 0%, #2B2820 100%);
    border-radius: var(--radius-lg);
    padding: 36px 32px;
    text-align: center;
    margin-top: 12px;
  }
  .contact-card h3 {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: #fff;
    margin-bottom: 10px;
  }
  .contact-card p {
    font-size: 15px;
    color: rgba(255,255,255,0.65);
    max-width: 440px;
    margin: 0 auto 24px;
    line-height: 1.6;
  }
  .contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    padding: 12px 28px;
    border-radius: 100px;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .contact-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .contact-btn svg { width: 16px; height: 16px; }

  /* ── Footer Note ── */
  .footer-note {
    text-align: center;
    margin-top: 40px;
    font-size: 13px;
    color: var(--ink-muted);
    line-height: 1.7;
  }
  .footer-note a {
    color: var(--accent);
    text-decoration: none;
  }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const ChevronDown = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function Section({ icon, iconBg, iconColor, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="section-card">
      <button className="section-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className="section-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        <span className="section-title">{title}</span>
        <ChevronDown className={`section-chevron${open ? " open" : ""}`} />
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

function CheckItem({ children }) {
  return (
    <li>
      <span className="check-icon"><CheckIcon /></span>
      <span>{children}</span>
    </li>
  );
}

export default function ChildSafetyDeclaration() {
  return (
    <>
      <style>{styles}</style>
      <div className="page-wrap">

        {/* ── Hero ── */}
        <div className="hero">
          <div className="hero-badge">
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px" }}>
  
              <div className="flex items-center gap-1 border-radius-full">
                <img className="logo" src="/logo.png" alt="Twimbol Logo"/>
              </div>
  
            </div>
            {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Official Declaration */}
          </div>
          <h1>Child Safety Standards<br /><em>Compliance Declaration</em></h1>
          <p className="hero-sub">
            {COMPANY_NAME} is committed to protecting the safety, privacy, and wellbeing
            of minors who interact with {APP_NAME}.
          </p>
          <div className="hero-meta">
            {/* <div className="hero-meta-item">
              <span>App Name</span>
              <span>{APP_NAME}</span>
            </div> */}
            <div className="hero-meta-item">
              <span>Target Age</span>
              <span>{APP_TARGET_AGE}</span>
            </div>
            <div className="hero-meta-item">
              <span>Last Updated</span>
              <span>{LAST_UPDATED}</span>
            </div>
            <div className="hero-meta-item">
              <span>Version</span>
              <span>{POLICY_VERSION}</span>
            </div>
          </div>
        </div>

        <div className="content">

          {/* ── Compliance Status ── */}
          <div className="status-card">
            <div className="status-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="status-text">
              <h2>Compliant with Google Play Child Safety Standards</h2>
              <p>
                {APP_NAME} adheres to Google Play's Families Policy, COPPA, and applicable child
                protection regulations. This page serves as our public-facing compliance declaration.
              </p>
            </div>
          </div>

          {/* ── Section 1: App Overview ── */}
          <Section
            title="1. App Overview & Intended Audience"
            iconBg="#EBF0FF"
            iconColor="#2B5BE0"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
          >
            <div className="info-grid">
              <div className="info-item"><div className="label">Application Name</div><div className="value">{APP_NAME}</div></div>
              <div className="info-item"><div className="label">Developer / Publisher</div><div className="value">{COMPANY_NAME}</div></div>
              <div className="info-item"><div className="label">Target Age Group</div><div className="value">{APP_TARGET_AGE}</div></div>
              <div className="info-item"><div className="label">Platform</div><div className="value">Android (Google Play)</div></div>
            </div>
            <p>
              {APP_NAME} is designed for users aged {APP_TARGET_AGE}. The app's features, content, and
              interactions are structured and moderated to be appropriate for the target audience.
              We do not knowingly allow access to users below the minimum age threshold.
            </p>
          </Section>

          {/* ── Section 2: Prohibited Content ── */}
          <Section
            title="2. Prohibited Content Policy"
            iconBg="#FDE8E8"
            iconColor="#C0392B"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            }
          >
            <p>
              {APP_NAME} strictly prohibits all forms of content that could harm, exploit, or endanger
              minors. The following content categories are expressly forbidden on our platform:
            </p>
            <ul className="checklist">
              <CheckItem>Child Sexual Abuse Material (CSAM) — zero tolerance, immediately reported to NCMEC and relevant authorities</CheckItem>
              <CheckItem>Content that sexualizes, exploits, or endangers minors in any form</CheckItem>
              <CheckItem>Grooming behaviors, predatory conduct, or attempts to solicit personal information from minors</CheckItem>
              <CheckItem>Violent, threatening, or abusive content directed at or involving children</CheckItem>
              <CheckItem>Content promoting self-harm, eating disorders, or dangerous activities to minors</CheckItem>
              <CheckItem>Sharing of minors' personal information (name, address, school, photos) without parental consent</CheckItem>
            </ul>
            <div className="warning-box">
              ⚠️ Any user found posting, distributing, or facilitating prohibited child safety content will be permanently banned and reported to law enforcement and the National Center for Missing & Exploited Children (NCMEC).
            </div>
          </Section>

          {/* ── Section 3: Data Collection & Privacy ── */}
          <Section
            title="3. Data Collection & Children's Privacy"
            iconBg="#E6F5ED"
            iconColor="#1A7A4A"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          >
            <p>
              We comply with the Children's Online Privacy Protection Act (COPPA) and applicable
              international privacy laws for minors. Our data practices for young users include:
            </p>
            <ul className="checklist">
              <CheckItem>No collection of personal data from children under 13 without verifiable parental consent</CheckItem>
              <CheckItem>Minimal data collection principle — only data essential to app functionality is collected</CheckItem>
              <CheckItem>No behavioral advertising or targeted ads directed at users under 13</CheckItem>
              <CheckItem>No sharing or sale of children's personal information to third parties</CheckItem>
              <CheckItem>Parental access rights: parents may review, modify, or delete their child's data at any time</CheckItem>
              <CheckItem>All data is encrypted in transit and at rest using industry-standard protocols</CheckItem>
            </ul>
            <div className="highlight-box">
              📋 For full details on data handling, please review our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="privacy-policy-link">Privacy Policy</a> which includes a dedicated section on children's data rights and parental controls.
            </div>
          </Section>

          {/* ── Section 4: Safety Features ── */}
          <Section
            title="4. In-App Safety Features"
            iconBg="#FFF3E6"
            iconColor="#E07B00"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          >
            <p>
              {APP_NAME} implements multiple layers of technical and policy safeguards to protect
              young users within the app:
            </p>
            <ul className="checklist">
              <CheckItem>Age verification or parental consent flow during account registration</CheckItem>
              <CheckItem>Content moderation system (automated + human review) for user-generated content</CheckItem>
              <CheckItem>In-app reporting tool allowing users to flag inappropriate content or behavior</CheckItem>
              <CheckItem>Block and mute features to empower users to manage their interactions</CheckItem>
              <CheckItem>Restricted direct messaging settings for minor accounts</CheckItem>
              <CheckItem>Parental control dashboard for accounts identified as belonging to minors</CheckItem>
              <CheckItem>Regular safety audits and penetration testing of child-related data flows</CheckItem>
            </ul>
          </Section>

          {/* ── Section 5: Enforcement & Moderation ── */}
          <Section
            title="5. Enforcement & Content Moderation"
            iconBg="#F0EBF8"
            iconColor="#7B3FBE"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          >
            <p>
              Our Trust & Safety team actively monitors the platform for child safety violations.
              Our enforcement process includes:
            </p>
            <ul className="checklist">
              <CheckItem>24/7 automated scanning for known CSAM using PhotoDNA or equivalent hash-matching technology</CheckItem>
              <CheckItem>Dedicated human review team for escalated child safety reports</CheckItem>
              <CheckItem>Clear escalation path: report submitted → triaged within 24 hours → action taken within 48 hours</CheckItem>
              <CheckItem>Mandatory reporting to NCMEC CyberTipline for any detected CSAM</CheckItem>
              <CheckItem>Cooperation with law enforcement investigations involving child safety</CheckItem>
              <CheckItem>Transparent appeals process for users who believe action was taken in error</CheckItem>
            </ul>
          </Section>

          {/* ── Section 6: Regulatory Compliance ── */}
          <Section
            title="6. Regulatory Compliance"
            iconBg="#E6F0FF"
            iconColor="#1A3BAD"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
            }
          >
            <p>
              {APP_NAME} is designed to comply with all applicable child safety regulations, including:
            </p>
            <ul className="checklist">
              <CheckItem><strong>COPPA</strong> (Children's Online Privacy Protection Act) — USA</CheckItem>
              <CheckItem><strong>GDPR-K</strong> (General Data Protection Regulation, minors provisions) — EU</CheckItem>
              <CheckItem><strong>Google Play Families Policy</strong> — all applicable sections</CheckItem>
              <CheckItem><strong>KOSA</strong> (Kids Online Safety Act) — where applicable</CheckItem>
              <CheckItem><strong>PIPA / PDPA</strong> — applicable regional privacy laws</CheckItem>
              <CheckItem><strong>PROTECT Our Children Act</strong> — mandatory NCMEC reporting</CheckItem>
            </ul>
            <div className="highlight-box">
              🔄 This declaration is reviewed and updated at least annually, or whenever significant regulatory changes occur. Current version: <strong>{POLICY_VERSION}</strong> (Last updated: {LAST_UPDATED})
            </div>
          </Section>

          {/* ── Contact ── */}
          <div className="contact-card">
            <h3>Report a Child Safety Concern</h3>
            <p>
              If you encounter content that violates our child safety standards or need to
              reach our Trust & Safety team, please contact us immediately.
            </p>
            <a className="contact-btn" href={`mailto:${CONTACT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* ── Footer Note ── */}
          <div className="footer-note">
            <p>
              This declaration is published by <strong>{COMPANY_NAME}</strong> in accordance with
              Google Play's developer policies on child safety.
            </p>
            <p style={{ marginTop: 6 }}>
              For legal correspondence, refer to our{" "}
              <a href="/privacy-policy">Privacy Policy</a> and{" "}
              <a href="/terms-of-service">Terms of Service</a>.
              &nbsp;·&nbsp; © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
