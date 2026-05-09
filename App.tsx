import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  Globe2,
  Handshake,
  Landmark,
  Mail,
  PackageCheck,
  Phone,
  Rocket,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react';

type ViewKey = 'build' | 'portal' | 'signup' | 'submissions' | 'package' | 'guide';
type RaiseMode = 'startup' | 'local';
type LeadStatus = 'new' | 'reviewing' | 'package-sent' | 'approved' | 'declined' | 'funded';
type SupporterType = 'individual' | 'business' | 'entity' | 'lender' | 'other';

interface RaiseSettings {
  raiseMode: RaiseMode;
  businessName: string;
  legalName: string;
  founderName: string;
  founderTitle: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  location: string;
  logoDataUrl: string;
  portalHeadline: string;
  portalSubtitle: string;
  businessSummary: string;
  opportunitySummary: string;
  fundingGoal: string;
  minimumInterest: string;
  deadline: string;
  useOfFunds: string;
  proofPoints: string;
  offerLabel: string;
  termsSummary: string;
  processSummary: string;
  audienceSummary: string;
  packageSummary: string;
  riskNotice: string;
  wireNotice: string;
}

interface SupporterForm {
  supporterType: SupporterType;
  fullName: string;
  email: string;
  phone: string;
  cityState: string;
  organization: string;
  proposedAmount: string;
  timing: string;
  relationship: string;
  message: string;
  wantsPackage: boolean;
  understandsReview: boolean;
  typedName: string;
}

interface Lead extends SupporterForm {
  id: string;
  submittedAt: string;
  status: LeadStatus;
}

interface AppState {
  settings: RaiseSettings;
  leads: Lead[];
}

const STORAGE_KEY = 'moniezi-raise-v1-3-state';

const startupTemplate: RaiseSettings = {
  raiseMode: 'startup',
  businessName: 'Acme Growth Labs',
  legalName: 'Acme Growth Labs, Inc.',
  founderName: 'Alex Founder',
  founderTitle: 'Founder & CEO',
  contactEmail: 'founder@example.com',
  contactPhone: '(555) 014-2026',
  website: 'https://example.com',
  location: 'United States',
  logoDataUrl: '',
  portalHeadline: 'Private founder round for selected investors',
  portalSubtitle:
    'Review the company, use of funds, proposed terms, and next steps before submitting a non-binding indication of interest.',
  businessSummary:
    'Acme Growth Labs is building a focused software product for small business operators who need clearer records, better workflows, and a simpler path from daily operations to financing readiness.',
  opportunitySummary:
    'The company is opening a private early-stage round for people with an existing relationship, a warm introduction, or direct founder approval. The purpose is to support product completion, customer acquisition, and launch execution.',
  fundingGoal: '250000',
  minimumInterest: '5000',
  deadline: '2026-06-30',
  useOfFunds:
    'Product development, customer acquisition, launch marketing, support operations, working capital, and professional fees related to the financing process.',
  proofPoints:
    'Working product direction; founder-led execution; focused customer segment; early-access pricing path; planned direct sales through founder and small-business communities.',
  offerLabel: 'Startup / SAFE-style private raise',
  termsSummary:
    'Proposed participation may be structured through a SAFE, convertible note, or other advisor-approved private investment document. Final terms are subject to company review and legal documentation.',
  processSummary:
    'Submit interest, request the package, speak with the founder, review final documents, receive official payment instructions, and participate only after written company approval.',
  audienceSummary:
    'Friends, family, private investors, warm introductions, founder contacts, and selected business supporters who can review the opportunity privately.',
  packageSummary:
    'The investor package should include the business overview, founder note, use of funds, proposed terms, risk notice, process steps, and contact information.',
  riskNotice:
    'This page collects non-binding indications of interest only. It is not a public offering, does not guarantee acceptance, and does not complete any investment. Final participation requires company approval, final documents, payment confirmation, and compliance with applicable rules.',
  wireNotice:
    'Do not send funds until the company verifies your information and sends final payment instructions from the official company contact email.',
};

const localTemplate: RaiseSettings = {
  raiseMode: 'local',
  businessName: 'Northside Roofing & Repair',
  legalName: 'Northside Roofing & Repair LLC',
  founderName: 'Jordan Owner',
  founderTitle: 'Owner',
  contactEmail: 'owner@example.com',
  contactPhone: '(555) 015-7700',
  website: 'https://example.com',
  location: 'New Jersey',
  logoDataUrl: '',
  portalHeadline: 'Private expansion funding for a local business',
  portalSubtitle:
    'Review the business, what the money will be used for, the proposed support structure, and the next step for selected private contacts.',
  businessSummary:
    'Northside Roofing & Repair is a local service business serving residential and small commercial customers. The business is seeking funding to expand capacity and complete more scheduled work.',
  opportunitySummary:
    'The owner is organizing private interest from selected contacts to support equipment, materials, vehicle capacity, working capital, and crew expansion. This is designed for practical local-business growth, not a Silicon Valley startup pitch.',
  fundingGoal: '75000',
  minimumInterest: '2500',
  deadline: '2026-07-31',
  useOfFunds:
    'Work truck deposit or lease support, roofing tools, safety equipment, materials for signed jobs, short-term working capital, subcontractor support, and customer acquisition.',
  proofPoints:
    'Existing customer demand; repeat local work; signed or expected jobs; clear equipment needs; owner-operated execution; ability to increase revenue capacity with additional resources.',
  offerLabel: 'Local business expansion raise',
  termsSummary:
    'Support may be discussed as a private business loan, repayment plan, revenue-share, profit-share, equipment-financing support, or other advisor-approved structure. Final terms are agreed separately in writing.',
  processSummary:
    'Submit interest, request the expansion package, speak with the owner, review proposed terms, and proceed only after written approval and final documents.',
  audienceSummary:
    'Friends, family, customers, local supporters, private lenders, business contacts, suppliers, and people who already know or can evaluate the owner.',
  packageSummary:
    'The supporter package should explain the business, expansion plan, use of funds, repayment concept, owner contact information, and review process.',
  riskNotice:
    'This page collects non-binding indications of interest only. It is not a public offering, does not guarantee repayment or return, and does not complete any loan, investment, or revenue-share arrangement. Final participation requires owner approval, final documents, and advisor review where appropriate.',
  wireNotice:
    'Do not send funds until the owner verifies your information and sends final payment instructions directly from the official business contact email.',
};

const blankSupporter: SupporterForm = {
  supporterType: 'individual',
  fullName: '',
  email: '',
  phone: '',
  cityState: '',
  organization: '',
  proposedAmount: '',
  timing: 'Within 30 days after final documents are approved',
  relationship: '',
  message: '',
  wantsPackage: true,
  understandsReview: false,
  typedName: '',
};

const demoLeads: Lead[] = [
  {
    ...blankSupporter,
    id: 'demo-1',
    fullName: 'Jordan Miller',
    email: 'jordan@example.com',
    phone: '(555) 201-1400',
    cityState: 'Hoboken, NJ',
    proposedAmount: '10000',
    relationship: 'Family friend of the owner',
    message: 'Please send the package and next-step details.',
    understandsReview: true,
    typedName: 'Jordan Miller',
    submittedAt: '2026-05-01T15:30:00.000Z',
    status: 'reviewing',
  },
  {
    ...blankSupporter,
    id: 'demo-2',
    supporterType: 'business',
    fullName: 'Priya Shah',
    email: 'priya@example.com',
    phone: '(555) 812-4401',
    cityState: 'New York, NY',
    organization: 'Northstar Business Capital LLC',
    proposedAmount: '25000',
    relationship: 'Warm introduction',
    message: 'Interested in reviewing the terms summary and use of funds.',
    understandsReview: true,
    typedName: 'Priya Shah',
    submittedAt: '2026-05-02T18:05:00.000Z',
    status: 'package-sent',
  },
];

const inputBase =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:ring-blue-500/20';
const labelBase = 'mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300';

const money = (value: string | number) => {
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numeric)) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(numeric);
};

const formatDate = (value?: string) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const safeText = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'moniezi-raise';

const downloadTextFile = (filename: string, content: string, type = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { settings: startupTemplate, leads: demoLeads };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      settings: { ...startupTemplate, ...(parsed.settings || {}) },
      leads: Array.isArray(parsed.leads) ? parsed.leads : demoLeads,
    };
  } catch {
    return { settings: startupTemplate, leads: demoLeads };
  }
}

function LogoMark({ settings, size = 'md' }: { settings: RaiseSettings; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-16 w-16 rounded-[1.35rem]' : size === 'sm' ? 'h-10 w-10 rounded-2xl' : 'h-12 w-12 rounded-2xl';
  if (settings.logoDataUrl) {
    return <img src={settings.logoDataUrl} alt={`${settings.businessName} logo`} className={`${sizeClass} object-cover shadow-lg`} />;
  }
  return (
    <div className={`grid ${sizeClass} place-items-center bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg shadow-blue-950/20`}>
      <Landmark className={size === 'lg' ? 'h-9 w-9 text-white' : 'h-6 w-6 text-white'} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelBase}>{label}</span>
      {children}
    </label>
  );
}

function SectionCard({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-black/20 sm:p-7">
      {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">{eyebrow}</p>}
      <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PortalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="rounded-[1.65rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/20">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function TemplateButton({ active, title, subtitle, icon: Icon, onClick }: { active: boolean; title: string; subtitle: string; icon: React.ElementType; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl border p-5 text-left shadow-lg transition active:scale-[0.99] ${
        active
          ? 'border-blue-500 bg-blue-50 text-slate-950 shadow-blue-900/10 dark:border-blue-400 dark:bg-blue-500/15 dark:text-white'
          : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/60 hover:border-blue-300 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:shadow-black/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${active ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-100'}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-black">{title}</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}

function buildPortalHtml(settings: RaiseSettings) {
  const accent = settings.raiseMode === 'startup' ? '#2563eb' : '#0f766e';
  const subject = encodeURIComponent(`Interest in ${settings.businessName} funding page`);
  const body = encodeURIComponent(`Hello ${settings.founderName},\n\nI reviewed the ${settings.businessName} funding page and would like to request more information.\n\nName:\nEmail:\nPhone:\nProposed amount:\nRelationship to business:\nMessage:\n\nThank you.`);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeText(settings.businessName)} Private Funding Portal</title>
  <style>
    :root { color-scheme: light; --accent: ${accent}; --ink: #0f172a; --muted: #475569; --line: #e2e8f0; --soft: #f8fafc; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: linear-gradient(180deg, #eef5ff 0%, #f8fafc 46%, #ffffff 100%); color: var(--ink); }
    .wrap { max-width: 1120px; margin: 0 auto; padding: 28px 20px 56px; }
    .nav { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 36px; }
    .brand { display: flex; align-items: center; gap: 14px; font-weight: 900; }
    .mark { width: 46px; height: 46px; border-radius: 18px; display: grid; place-items: center; color: white; background: linear-gradient(135deg, #3b82f6, #4338ca); box-shadow: 0 18px 40px rgba(37, 99, 235, .25); }
    .pill { display: inline-flex; align-items: center; border: 1px solid rgba(37,99,235,.22); background: rgba(255,255,255,.72); padding: 9px 13px; border-radius: 999px; color: #1d4ed8; font-size: 12px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
    .hero { display: grid; grid-template-columns: 1.05fr .95fr; gap: 28px; align-items: stretch; }
    h1 { font-size: clamp(42px, 7vw, 78px); line-height: .94; margin: 22px 0 18px; letter-spacing: -.06em; }
    h2 { font-size: clamp(26px, 4vw, 42px); letter-spacing: -.04em; margin: 0 0 14px; }
    h3 { margin: 0 0 10px; font-size: 18px; }
    p { color: var(--muted); line-height: 1.65; font-weight: 650; }
    .lead { font-size: 20px; color: #334155; max-width: 760px; }
    .panel { background: rgba(255,255,255,.86); border: 1px solid rgba(226,232,240,.88); border-radius: 32px; padding: 28px; box-shadow: 0 30px 90px rgba(15, 23, 42, .10); }
    .dark-panel { background: #0f172a; color: white; border-radius: 32px; padding: 28px; box-shadow: 0 30px 90px rgba(15, 23, 42, .22); }
    .dark-panel p { color: #cbd5e1; }
    .metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 24px; }
    .metric { border: 1px solid rgba(226,232,240,.85); background: white; border-radius: 22px; padding: 18px; }
    .metric span { display:block; color:#64748b; font-size:11px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }
    .metric strong { display:block; margin-top:7px; font-size:24px; letter-spacing:-.03em; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { appearance: none; border: 0; border-radius: 18px; padding: 15px 20px; font-size: 15px; font-weight: 900; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
    .btn-primary { color: white; background: var(--accent); box-shadow: 0 18px 40px rgba(37,99,235,.25); }
    .btn-secondary { color: #0f172a; background: white; border: 1px solid #dbe3ef; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-top: 24px; }
    .card { border: 1px solid var(--line); background: white; border-radius: 26px; padding: 24px; box-shadow: 0 16px 44px rgba(15,23,42,.06); }
    .section { margin-top: 28px; }
    .notice { border: 1px solid #fed7aa; background: #fff7ed; color: #7c2d12; border-radius: 24px; padding: 20px; font-weight: 750; line-height: 1.6; }
    .contact { display:grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
    .contact a { color: var(--accent); font-weight: 900; }
    footer { margin-top: 40px; color: #64748b; font-size: 13px; font-weight: 700; }
    @media (max-width: 860px) { .hero, .grid, .contact { grid-template-columns: 1fr; } .wrap { padding-top: 18px; } .panel, .dark-panel { padding: 22px; border-radius: 26px; } }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="nav">
      <div class="brand"><div class="mark">$</div><div>${safeText(settings.businessName)}<br><span style="color:#64748b;font-size:13px;">Private funding portal</span></div></div>
      <span class="pill">${safeText(settings.offerLabel)}</span>
    </header>

    <section class="hero">
      <div class="panel">
        <span class="pill">Prepared for selected private contacts</span>
        <h1>${safeText(settings.portalHeadline)}</h1>
        <p class="lead">${safeText(settings.portalSubtitle)}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="mailto:${safeText(settings.contactEmail)}?subject=${subject}&body=${body}">Request package / submit interest</a>
          <a class="btn btn-secondary" href="#process">Review process</a>
        </div>
      </div>
      <aside class="dark-panel">
        <h2>Funding snapshot</h2>
        <p>${safeText(settings.opportunitySummary)}</p>
        <div class="metrics">
          <div class="metric"><span>Funding goal</span><strong>${money(settings.fundingGoal)}</strong></div>
          <div class="metric"><span>Minimum interest</span><strong>${money(settings.minimumInterest)}</strong></div>
          <div class="metric"><span>Deadline</span><strong>${formatDate(settings.deadline)}</strong></div>
          <div class="metric"><span>Mode</span><strong>${settings.raiseMode === 'startup' ? 'Startup' : 'Local'}</strong></div>
        </div>
      </aside>
    </section>

    <section class="section grid">
      <article class="card"><h3>Business</h3><p>${safeText(settings.businessSummary)}</p></article>
      <article class="card"><h3>Use of funds</h3><p>${safeText(settings.useOfFunds)}</p></article>
      <article class="card"><h3>Proof / readiness</h3><p>${safeText(settings.proofPoints)}</p></article>
    </section>

    <section class="section panel">
      <h2>Offer summary</h2>
      <p>${safeText(settings.termsSummary)}</p>
      <div class="grid">
        <div class="card"><h3>Who this is for</h3><p>${safeText(settings.audienceSummary)}</p></div>
        <div class="card"><h3>Package contents</h3><p>${safeText(settings.packageSummary)}</p></div>
        <div class="card" id="process"><h3>Next steps</h3><p>${safeText(settings.processSummary)}</p></div>
      </div>
    </section>

    <section class="section notice"><strong>Important notice:</strong> ${safeText(settings.riskNotice)} ${safeText(settings.wireNotice)}</section>

    <section class="section panel">
      <h2>Contact</h2>
      <p>Use the contact information below to request the private package or submit interest for owner review.</p>
      <div class="contact">
        <div><strong>${safeText(settings.founderName)}</strong><br>${safeText(settings.founderTitle)}</div>
        <div><a href="mailto:${safeText(settings.contactEmail)}">${safeText(settings.contactEmail)}</a><br>${safeText(settings.contactPhone)}<br>${safeText(settings.website)}</div>
      </div>
    </section>

    <footer>Generated with MONIEZI Raise V1.3. This static portal is a presentation and interest-intake page. It should be reviewed by appropriate advisors before use for any financing transaction.</footer>
  </main>
</body>
</html>`;
}

function buildPackageHtml(settings: RaiseSettings, lead?: SupporterForm | Lead) {
  const person = lead || blankSupporter;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeText(settings.businessName)} Funding Package</title>
  <style>
    body { margin:0; background:#f8fafc; color:#0f172a; font-family:Inter, Arial, sans-serif; }
    main { max-width:900px; margin:0 auto; padding:42px 22px; }
    section { background:white; border:1px solid #e2e8f0; border-radius:28px; padding:32px; box-shadow:0 24px 80px rgba(15,23,42,.10); }
    h1 { font-size:34px; line-height:1.05; margin:10px 0 10px; } h2 { margin-top:28px; padding-top:20px; border-top:1px solid #e2e8f0; }
    p { color:#334155; line-height:1.65; font-weight:650; } table { width:100%; border-collapse:collapse; margin-top:12px; }
    th,td { text-align:left; vertical-align:top; border-bottom:1px solid #e2e8f0; padding:12px 8px; }
    th { width:34%; color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:.10em; }
    .brand { color:#2563eb; font-size:12px; font-weight:900; letter-spacing:.22em; text-transform:uppercase; }
    .notice { background:#fff7ed; border:1px solid #fed7aa; color:#7c2d12; padding:16px; border-radius:18px; }
    @media print { body { background:white; } main { padding:0; } section { box-shadow:none; border:none; border-radius:0; } }
  </style>
</head>
<body>
<main><section>
  <div class="brand">MONIEZI Raise V1.3 · Private Funding Package</div>
  <h1>${safeText(settings.businessName)} Funding Package</h1>
  <p>${safeText(settings.portalSubtitle)}</p>
  <div class="notice"><strong>Important:</strong> ${safeText(settings.riskNotice)}</div>
  <h2>Business Summary</h2><p>${safeText(settings.businessSummary)}</p>
  <h2>Opportunity Summary</h2><p>${safeText(settings.opportunitySummary)}</p>
  <h2>Funding Details</h2>
  <table>
    <tr><th>Legal name</th><td>${safeText(settings.legalName)}</td></tr>
    <tr><th>Founder / Owner</th><td>${safeText(settings.founderName)} · ${safeText(settings.founderTitle)}</td></tr>
    <tr><th>Raise mode</th><td>${settings.raiseMode === 'startup' ? 'Startup / SAFE-style private raise' : 'Local business expansion raise'}</td></tr>
    <tr><th>Funding goal</th><td>${money(settings.fundingGoal)}</td></tr>
    <tr><th>Minimum interest</th><td>${money(settings.minimumInterest)}</td></tr>
    <tr><th>Deadline</th><td>${formatDate(settings.deadline)}</td></tr>
    <tr><th>Use of funds</th><td>${safeText(settings.useOfFunds)}</td></tr>
    <tr><th>Terms summary</th><td>${safeText(settings.termsSummary)}</td></tr>
    <tr><th>Process</th><td>${safeText(settings.processSummary)}</td></tr>
  </table>
  <h2>Supporter / Investor Interest</h2>
  <table>
    <tr><th>Name</th><td>${safeText(person.fullName || 'Not provided')}</td></tr>
    <tr><th>Email</th><td>${safeText(person.email || 'Not provided')}</td></tr>
    <tr><th>Phone</th><td>${safeText(person.phone || 'Not provided')}</td></tr>
    <tr><th>Organization</th><td>${safeText(person.organization || 'Not provided')}</td></tr>
    <tr><th>Proposed amount</th><td>${money(person.proposedAmount || '0')}</td></tr>
    <tr><th>Relationship</th><td>${safeText(person.relationship || 'Not provided')}</td></tr>
    <tr><th>Message</th><td>${safeText(person.message || 'Not provided')}</td></tr>
    <tr><th>Typed name</th><td>${safeText(person.typedName || 'Not signed')}</td></tr>
  </table>
  <h2>Wire / Payment Security</h2><p>${safeText(settings.wireNotice)}</p>
  <p style="font-size:12px;color:#64748b;">Generated by MONIEZI Raise V1.3. This is a business workflow document, not legal advice or a final financing agreement.</p>
</section></main>
</body>
</html>`;
}

function PortalPreview({ settings, onSignup }: { settings: RaiseSettings; onSignup: () => void }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-blue-50 via-white to-white shadow-2xl shadow-slate-200/80 dark:border-white/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:shadow-black/30">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-white/75 p-5 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark settings={settings} />
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">{settings.businessName}</p>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-300">Private funding portal</p>
          </div>
        </div>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-200">{settings.offerLabel}</span>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1.05fr_.95fr] lg:p-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Prepared for selected private contacts</p>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl">{settings.portalHeadline}</h1>
          <p className="mt-5 text-lg font-bold leading-8 text-slate-600 dark:text-slate-200">{settings.portalSubtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onSignup} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30">
              Submit interest <ArrowRight className="h-4 w-4" />
            </button>
            <a href={`mailto:${settings.contactEmail}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:shadow-black/20">
              Contact owner
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Funding snapshot</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">{settings.raiseMode === 'startup' ? 'Founder raise' : 'Expansion raise'}</h2>
          <p className="mt-4 text-base font-bold leading-7 text-slate-300">{settings.opportunitySummary}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <PortalMetric label="Goal" value={money(settings.fundingGoal)} />
            <PortalMetric label="Minimum" value={money(settings.minimumInterest)} />
            <PortalMetric label="Deadline" value={formatDate(settings.deadline)} />
            <PortalMetric label="Mode" value={settings.raiseMode === 'startup' ? 'Startup' : 'Local'} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 pt-0 lg:grid-cols-3 lg:p-8 lg:pt-0">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Business</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{settings.businessSummary}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Use of funds</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{settings.useOfFunds}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Proof / readiness</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{settings.proofPoints}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5 pt-0 lg:grid-cols-3 lg:p-8 lg:pt-0">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Who this is for</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{settings.audienceSummary}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Terms / structure</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{settings.termsSummary}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Next steps</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{settings.processSummary}</p>
        </div>
      </div>

      <div className="p-5 pt-0 lg:p-8 lg:pt-0">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-6 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          <strong>Important notice:</strong> {settings.riskNotice} {settings.wireNotice}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<ViewKey>('portal');
  const [form, setForm] = useState<SupporterForm>(() => ({ ...blankSupporter }));
  const [savedMessage, setSavedMessage] = useState('');

  const { settings, leads } = state;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalInterest = useMemo(() => leads.reduce((sum, lead) => sum + (Number(lead.proposedAmount) || 0), 0), [leads]);
  const canSubmit = Boolean(form.fullName.trim() && form.email.trim() && Number(form.proposedAmount) > 0 && form.understandsReview && form.typedName.trim());

  const updateSettings = (patch: Partial<RaiseSettings>) => setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  const updateForm = (patch: Partial<SupporterForm>) => setForm((prev) => ({ ...prev, ...patch }));

  const applyTemplate = (mode: RaiseMode) => {
    setState((prev) => ({ ...prev, settings: mode === 'startup' ? startupTemplate : localTemplate }));
    setSavedMessage(mode === 'startup' ? 'Startup / SAFE template applied.' : 'Local Business Expansion template applied.');
  };

  const handleLogoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSettings({ logoDataUrl: String(reader.result || '') });
    reader.readAsDataURL(file);
  };

  const saveLead = () => {
    if (!canSubmit) return;
    const lead: Lead = {
      ...form,
      id: `lead-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };
    setState((prev) => ({ ...prev, leads: [lead, ...prev.leads] }));
    setForm({ ...blankSupporter });
    setView('submissions');
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
    }));
  };

  const exportPortal = () => downloadTextFile(`${slugify(settings.businessName)}-private-funding-portal.html`, buildPortalHtml(settings), 'text/html;charset=utf-8');
  const exportProfile = () => downloadTextFile(`${slugify(settings.businessName)}-moniezi-raise-profile.json`, JSON.stringify(settings, null, 2), 'application/json;charset=utf-8');
  const exportPackage = (lead?: SupporterForm | Lead) => downloadTextFile(`${slugify(settings.businessName)}-funding-package.html`, buildPackageHtml(settings, lead), 'text/html;charset=utf-8');
  const exportLeadsCsv = () => {
    const header = ['Name', 'Email', 'Phone', 'City/State', 'Organization', 'Type', 'Proposed Amount', 'Timing', 'Relationship', 'Package Requested', 'Status', 'Submitted At', 'Message'];
    const rows = leads.map((lead) => [
      lead.fullName,
      lead.email,
      lead.phone,
      lead.cityState,
      lead.organization,
      lead.supporterType,
      lead.proposedAmount,
      lead.timing,
      lead.relationship,
      lead.wantsPackage ? 'Yes' : 'No',
      lead.status,
      lead.submittedAt,
      lead.message,
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadTextFile(`${slugify(settings.businessName)}-raise-leads.csv`, csv, 'text/csv;charset=utf-8');
  };

  const navItems: Array<[ViewKey, React.ElementType, string]> = [
    ['build', Settings, 'Build Page'],
    ['portal', Eye, 'Portal'],
    ['signup', Handshake, 'Signup'],
    ['submissions', ClipboardCheck, 'Leads'],
    ['package', FileText, 'Package'],
    ['guide', ShieldCheck, 'Guide'],
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/92">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark settings={settings} />
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-tight">MONIEZI Raise</p>
              <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">V1.3 · Investor Portal Builder</p>
            </div>
          </div>
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map(([key, Icon, label]) => (
              <button key={key} onClick={() => setView(key)} className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${view === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 dark:bg-blue-500 dark:text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </nav>
          <button onClick={exportPortal} className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg active:scale-95 dark:bg-blue-500 dark:text-white sm:inline-flex">
            <Download className="h-4 w-4" /> Export Portal
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Funding Goal" value={money(settings.fundingGoal)} icon={BadgeDollarSign} />
          <StatCard label="Interest Logged" value={money(totalInterest)} icon={Handshake} />
          <StatCard label="Leads" value={String(leads.length)} icon={ClipboardCheck} />
          <StatCard label="Output" value="Portal" icon={Globe2} />
        </section>

        {view === 'build' && (
          <div className="grid gap-6">
            <SectionCard title="Choose the buyer's funding-page template" eyebrow="Step 1 · Page strategy">
              <div className="grid gap-4 md:grid-cols-2">
                <TemplateButton active={settings.raiseMode === 'startup'} title="Startup / SAFE Raise" subtitle="For founders who need a private startup-style investor page, proposed SAFE terms, package request, and indication-of-interest flow." icon={Rocket} onClick={() => applyTemplate('startup')} />
                <TemplateButton active={settings.raiseMode === 'local'} title="Local Business Expansion Raise" subtitle="For contractors, service businesses, operators, and local companies raising for vehicles, equipment, crews, materials, or working capital." icon={BriefcaseBusiness} onClick={() => applyTemplate('local')} />
              </div>
              {savedMessage && <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">{savedMessage}</p>}
            </SectionCard>

            <SectionCard title="Business identity" eyebrow="Step 2 · Owner details">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Public business name"><input className={inputBase} value={settings.businessName} onChange={(e) => updateSettings({ businessName: e.target.value })} /></Field>
                <Field label="Legal name"><input className={inputBase} value={settings.legalName} onChange={(e) => updateSettings({ legalName: e.target.value })} /></Field>
                <Field label="Founder / Owner"><input className={inputBase} value={settings.founderName} onChange={(e) => updateSettings({ founderName: e.target.value })} /></Field>
                <Field label="Title"><input className={inputBase} value={settings.founderTitle} onChange={(e) => updateSettings({ founderTitle: e.target.value })} /></Field>
                <Field label="Email"><input className={inputBase} value={settings.contactEmail} onChange={(e) => updateSettings({ contactEmail: e.target.value })} /></Field>
                <Field label="Phone"><input className={inputBase} value={settings.contactPhone} onChange={(e) => updateSettings({ contactPhone: e.target.value })} /></Field>
                <Field label="Website"><input className={inputBase} value={settings.website} onChange={(e) => updateSettings({ website: e.target.value })} /></Field>
                <Field label="Location"><input className={inputBase} value={settings.location} onChange={(e) => updateSettings({ location: e.target.value })} /></Field>
              </div>
              <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50 sm:flex-row sm:items-center">
                <LogoMark settings={settings} size="lg" />
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-950 dark:text-white">Optional logo</p>
                  <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">Upload a logo for the generated portal. If no logo is added, MONIEZI Raise uses the Raise mark.</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95">
                  <Upload className="h-4 w-4" /> Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e.target.files?.[0])} />
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Investor portal copy" eyebrow="Step 3 · The page people will see">
              <div className="grid gap-4">
                <Field label="Portal headline"><input className={inputBase} value={settings.portalHeadline} onChange={(e) => updateSettings({ portalHeadline: e.target.value })} /></Field>
                <Field label="Portal subtitle"><textarea className={`${inputBase} min-h-24`} value={settings.portalSubtitle} onChange={(e) => updateSettings({ portalSubtitle: e.target.value })} /></Field>
                <Field label="Business summary"><textarea className={`${inputBase} min-h-32`} value={settings.businessSummary} onChange={(e) => updateSettings({ businessSummary: e.target.value })} /></Field>
                <Field label="Opportunity summary"><textarea className={`${inputBase} min-h-32`} value={settings.opportunitySummary} onChange={(e) => updateSettings({ opportunitySummary: e.target.value })} /></Field>
                <Field label="Proof / readiness points"><textarea className={`${inputBase} min-h-28`} value={settings.proofPoints} onChange={(e) => updateSettings({ proofPoints: e.target.value })} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Funding structure" eyebrow="Step 4 · Amounts, terms, and process">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Funding goal"><input className={inputBase} inputMode="numeric" value={settings.fundingGoal} onChange={(e) => updateSettings({ fundingGoal: e.target.value })} /></Field>
                <Field label="Minimum interest"><input className={inputBase} inputMode="numeric" value={settings.minimumInterest} onChange={(e) => updateSettings({ minimumInterest: e.target.value })} /></Field>
                <Field label="Deadline"><input className={inputBase} type="date" value={settings.deadline} onChange={(e) => updateSettings({ deadline: e.target.value })} /></Field>
              </div>
              <div className="mt-4 grid gap-4">
                <Field label="Offer label"><input className={inputBase} value={settings.offerLabel} onChange={(e) => updateSettings({ offerLabel: e.target.value })} /></Field>
                <Field label="Use of funds"><textarea className={`${inputBase} min-h-28`} value={settings.useOfFunds} onChange={(e) => updateSettings({ useOfFunds: e.target.value })} /></Field>
                <Field label="Terms summary"><textarea className={`${inputBase} min-h-28`} value={settings.termsSummary} onChange={(e) => updateSettings({ termsSummary: e.target.value })} /></Field>
                <Field label="Who this is for"><textarea className={`${inputBase} min-h-24`} value={settings.audienceSummary} onChange={(e) => updateSettings({ audienceSummary: e.target.value })} /></Field>
                <Field label="Process summary"><textarea className={`${inputBase} min-h-24`} value={settings.processSummary} onChange={(e) => updateSettings({ processSummary: e.target.value })} /></Field>
                <Field label="Package summary"><textarea className={`${inputBase} min-h-24`} value={settings.packageSummary} onChange={(e) => updateSettings({ packageSummary: e.target.value })} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Review notices" eyebrow="Step 5 · Safer wording">
              <div className="grid gap-4">
                <Field label="Risk / review notice"><textarea className={`${inputBase} min-h-28`} value={settings.riskNotice} onChange={(e) => updateSettings({ riskNotice: e.target.value })} /></Field>
                <Field label="Payment security notice"><textarea className={`${inputBase} min-h-24`} value={settings.wireNotice} onChange={(e) => updateSettings({ wireNotice: e.target.value })} /></Field>
              </div>
            </SectionCard>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setView('portal')} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95"><Eye className="h-4 w-4" /> Preview Portal</button>
              <button onClick={exportPortal} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg active:scale-95 dark:bg-blue-500 dark:text-white"><Download className="h-4 w-4" /> Export Static Portal HTML</button>
              <button onClick={exportProfile} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Save className="h-4 w-4" /> Export Profile</button>
            </div>
          </div>
        )}

        {view === 'portal' && (
          <div className="grid gap-6">
            <SectionCard title="Generated investor/supporter portal" eyebrow="This is what the buyer can share or export">
              <PortalPreview settings={settings} onSignup={() => setView('signup')} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => setView('build')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Settings className="h-4 w-4" /> Edit Page</button>
                <button onClick={exportPortal} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95"><Download className="h-4 w-4" /> Export Portal HTML</button>
                <button onClick={() => exportPackage()} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg active:scale-95 dark:bg-blue-500 dark:text-white"><PackageCheck className="h-4 w-4" /> Download Package</button>
              </div>
            </SectionCard>
          </div>
        )}

        {view === 'signup' && (
          <SectionCard title="Visitor signup / indication of interest" eyebrow="The intake flow the portal points to">
            <div className="mb-5 rounded-3xl border border-blue-200 bg-blue-50 p-5 text-sm font-bold leading-6 text-blue-950 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-100">
              This form records a non-binding indication of interest for owner review. In a static exported portal, the call-to-action prepares an email to the owner. A later hosted version can save submissions directly to the owner dashboard.
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Supporter type">
                <select className={inputBase} value={form.supporterType} onChange={(e) => updateForm({ supporterType: e.target.value as SupporterType })}>
                  <option value="individual">Individual</option>
                  <option value="business">Business contact</option>
                  <option value="entity">Investment entity</option>
                  <option value="lender">Private lender</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Full name"><input className={inputBase} value={form.fullName} onChange={(e) => updateForm({ fullName: e.target.value })} /></Field>
              <Field label="Email"><input className={inputBase} type="email" value={form.email} onChange={(e) => updateForm({ email: e.target.value })} /></Field>
              <Field label="Phone"><input className={inputBase} value={form.phone} onChange={(e) => updateForm({ phone: e.target.value })} /></Field>
              <Field label="City / State"><input className={inputBase} value={form.cityState} onChange={(e) => updateForm({ cityState: e.target.value })} /></Field>
              <Field label="Organization / entity"><input className={inputBase} value={form.organization} onChange={(e) => updateForm({ organization: e.target.value })} /></Field>
              <Field label="Proposed amount"><input className={inputBase} inputMode="numeric" value={form.proposedAmount} onChange={(e) => updateForm({ proposedAmount: e.target.value })} /></Field>
              <Field label="Timing"><input className={inputBase} value={form.timing} onChange={(e) => updateForm({ timing: e.target.value })} /></Field>
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Relationship to owner / business"><textarea className={`${inputBase} min-h-24`} value={form.relationship} onChange={(e) => updateForm({ relationship: e.target.value })} /></Field>
              <Field label="Message / questions"><textarea className={`${inputBase} min-h-28`} value={form.message} onChange={(e) => updateForm({ message: e.target.value })} /></Field>
            </div>
            <div className="mt-5 grid gap-3">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
                <input type="checkbox" className="mt-1 h-5 w-5" checked={form.wantsPackage} onChange={(e) => updateForm({ wantsPackage: e.target.checked })} />
                I would like to receive the private package or next-step details.
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
                <input type="checkbox" className="mt-1 h-5 w-5" checked={form.understandsReview} onChange={(e) => updateForm({ understandsReview: e.target.checked })} />
                I understand this is a non-binding indication of interest and is subject to owner/company review, final documents, and applicable rules.
              </label>
              <Field label="Typed name"><input className={inputBase} value={form.typedName} onChange={(e) => updateForm({ typedName: e.target.value })} /></Field>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
              <button disabled={!canSubmit} onClick={saveLead} className={`inline-flex items-center gap-2 rounded-2xl px-5 py-4 text-sm font-black shadow-lg active:scale-95 ${canSubmit ? 'bg-blue-600 text-white shadow-blue-900/20' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}><Send className="h-4 w-4" /> Save Interest</button>
              <button onClick={() => exportPackage(form)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Download className="h-4 w-4" /> Download Draft Package</button>
            </div>
          </SectionCard>
        )}

        {view === 'submissions' && (
          <SectionCard title="Owner lead review" eyebrow="Submissions and exports">
            <div className="mb-5 flex flex-wrap gap-3">
              <button onClick={exportLeadsCsv} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95"><Download className="h-4 w-4" /> Export CSV</button>
              <button onClick={() => downloadTextFile(`${slugify(settings.businessName)}-raise-leads.json`, JSON.stringify(leads, null, 2), 'application/json;charset=utf-8')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Download className="h-4 w-4" /> Export JSON</button>
            </div>
            <div className="grid gap-4">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">{lead.status}</p>
                      <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{lead.fullName}</h3>
                      <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                        <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {lead.email}</span>
                        <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {lead.phone || 'No phone'}</span>
                        <span><strong>Amount:</strong> {money(lead.proposedAmount)}</span>
                        <span><strong>Type:</strong> {lead.supporterType}</span>
                        <span><strong>Organization:</strong> {lead.organization || 'Individual'}</span>
                        <span><strong>Submitted:</strong> {formatDate(lead.submittedAt)}</span>
                      </div>
                      {lead.message && <p className="mt-3 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{lead.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 sm:min-w-56">
                      <select className={inputBase} value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}>
                        {['new', 'reviewing', 'package-sent', 'approved', 'declined', 'funded'].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <button onClick={() => exportPackage(lead)} className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95">Download Package</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {view === 'package' && (
          <SectionCard title="Downloadable supporter / investor package" eyebrow="The file the owner can send after interest">
            <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                <p className="text-sm font-bold leading-7 text-slate-700 dark:text-slate-200">The package is generated from the portal builder fields. It gives the owner a clean file to send after a person asks for details.</p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <p><strong>Business:</strong> {settings.businessName}</p>
                  <p><strong>Mode:</strong> {settings.raiseMode === 'startup' ? 'Startup / SAFE-style private raise' : 'Local business expansion raise'}</p>
                  <p><strong>Goal:</strong> {money(settings.fundingGoal)}</p>
                  <p><strong>Minimum interest:</strong> {money(settings.minimumInterest)}</p>
                  <p><strong>Deadline:</strong> {formatDate(settings.deadline)}</p>
                </div>
                <button onClick={() => exportPackage()} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95"><Download className="h-4 w-4" /> Download Package</button>
              </div>
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-7 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                <FileText className="mb-3 h-7 w-7" />
                The package is not a final legal agreement. It is a professional summary file for review, follow-up, advisor discussion, and owner-controlled private funding organization.
              </div>
            </div>
          </SectionCard>
        )}

        {view === 'guide' && (
          <div className="grid gap-6">
            <SectionCard title="What changed in V1.3" eyebrow="Product direction">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50"><Globe2 className="mb-3 h-7 w-7 text-blue-600" /><h3 className="text-lg font-black text-slate-950 dark:text-white">Portal Builder</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">The app now produces a polished investor/supporter portal, not just internal forms.</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50"><BriefcaseBusiness className="mb-3 h-7 w-7 text-blue-600" /><h3 className="text-lg font-black text-slate-950 dark:text-white">Two real markets</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">Startup founders and local business owners now get separate wording and page logic.</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50"><Download className="mb-3 h-7 w-7 text-blue-600" /><h3 className="text-lg font-black text-slate-950 dark:text-white">Shareable output</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">The owner can export a static HTML portal and a separate supporter package.</p></div>
              </div>
            </SectionCard>
            <SectionCard title="Recommended buyer workflow" eyebrow="How the owner uses it">
              <ol className="space-y-3 text-base font-bold leading-7 text-slate-700 dark:text-slate-200">
                <li>1. Choose Startup / SAFE or Local Business Expansion.</li>
                <li>2. Fill in the business story, funding goal, use of funds, proof points, terms summary, and process.</li>
                <li>3. Preview the generated private funding portal.</li>
                <li>4. Export the static portal HTML or package file.</li>
                <li>5. Upload the portal to GitHub Pages, Cloudflare Pages, Netlify, the owner website, or send the package directly.</li>
                <li>6. Share the link with selected private contacts, not as a promise of public fundraising.</li>
                <li>7. Track serious interest and export records for advisor review or MONIEZI Pro Finance.</li>
              </ol>
            </SectionCard>
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-3 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-950/95 lg:hidden">
        <div className="grid grid-cols-6 gap-1">
          {navItems.map(([key, Icon, label]) => (
            <button key={key} onClick={() => setView(key)} className={`rounded-2xl px-1 py-2 text-[10px] font-black ${view === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 dark:bg-blue-500 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
              <Icon className="mx-auto h-5 w-5" />
              <span className="mt-1 block leading-tight">{label.replace(' Page', '')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
