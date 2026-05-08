import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  FileSignature,
  FileText,
  Landmark,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react';

type ViewKey = 'setup' | 'investor' | 'submissions' | 'package' | 'guide';
type InvestorType = 'individual' | 'entity' | 'trust' | 'family-office' | 'other';
type InstrumentType = 'SAFE' | 'Common Stock' | 'Preferred Stock' | 'Convertible Note' | 'Reservation Only';
type SubmissionStatus = 'draft' | 'submitted' | 'reviewing' | 'accepted' | 'declined' | 'funded';

interface RaiseSettings {
  companyLegalName: string;
  publicCompanyName: string;
  founderName: string;
  founderTitle: string;
  contactEmail: string;
  contactPhone: string;
  companyAddress: string;
  website: string;
  logoDataUrl: string;
  roundName: string;
  instrument: InstrumentType;
  targetRaise: string;
  minimumInvestment: string;
  valuationCap: string;
  discountRate: string;
  deadline: string;
  useOfFunds: string;
  companyStory: string;
  pageHeadline: string;
  pageSubtitle: string;
  riskAcknowledgment: string;
  wireNotice: string;
}

interface InvestorForm {
  investorType: InvestorType;
  fullLegalName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  address: string;
  entityName: string;
  entityType: string;
  entityJurisdiction: string;
  signerTitle: string;
  proposedAmount: string;
  amountTiming: string;
  preferredInstrument: InstrumentType;
  notes: string;
  accreditedStatus: 'yes' | 'no' | 'not-sure' | 'entity' | '';
  existingRelationship: string;
  electronicConsent: boolean;
  reservationAcknowledgment: boolean;
  riskAcknowledged: boolean;
  typedSignature: string;
}

interface InvestorSubmission extends InvestorForm {
  id: string;
  submittedAt: string;
  status: SubmissionStatus;
  packageDownloadedAt?: string;
}

interface AppState {
  settings: RaiseSettings;
  submissions: InvestorSubmission[];
}

const STORAGE_KEY = 'moniezi-raise-v1-1-state';

const defaultSettings: RaiseSettings = {
  companyLegalName: 'Acme Growth Labs, Inc.',
  publicCompanyName: 'Acme Growth Labs',
  founderName: 'Alex Founder',
  founderTitle: 'Founder & CEO',
  contactEmail: 'founder@example.com',
  contactPhone: '(555) 014-2026',
  companyAddress: '123 Founder Street, Suite 100, Wilmington, DE 19801',
  website: 'https://example.com',
  logoDataUrl: '',
  roundName: 'Friends & Family SAFE Round',
  instrument: 'SAFE',
  targetRaise: '250000',
  minimumInvestment: '5000',
  valuationCap: '5000000',
  discountRate: '20',
  deadline: '2026-06-30',
  useOfFunds: 'Product development, launch marketing, customer acquisition, working capital, and professional fees related to the financing.',
  companyStory:
    'We are building a focused business platform with a disciplined path to launch, revenue, and investor reporting. This private round is intended for people who already know the founder or have been personally introduced.',
  pageHeadline: 'Private Investment Reservation',
  pageSubtitle: 'Review the opportunity, download the package, and submit a proposed investment amount for company review.',
  riskAcknowledgment:
    'This page is an indication-of-interest and reservation workflow only. It is not a public offering, does not guarantee acceptance, and does not complete a securities purchase. Final participation is subject to company approval, final documents, payment confirmation, and applicable securities-law requirements.',
  wireNotice:
    'Do not wire funds until the company confirms your reservation, verifies your information, and sends final wire instructions directly from the official company contact email.',
};

const blankInvestor: InvestorForm = {
  investorType: 'individual',
  fullLegalName: '',
  email: '',
  phone: '',
  country: 'United States',
  state: '',
  address: '',
  entityName: '',
  entityType: '',
  entityJurisdiction: '',
  signerTitle: '',
  proposedAmount: '',
  amountTiming: 'Within 30 days after final documents are approved',
  preferredInstrument: 'SAFE',
  notes: '',
  accreditedStatus: '',
  existingRelationship: '',
  electronicConsent: false,
  reservationAcknowledgment: false,
  riskAcknowledged: false,
  typedSignature: '',
};

const demoSubmissions: InvestorSubmission[] = [
  {
    ...blankInvestor,
    id: 'demo-1',
    investorType: 'individual',
    fullLegalName: 'Jordan Miller',
    email: 'jordan@example.com',
    phone: '(555) 201-1400',
    state: 'CA',
    proposedAmount: '25000',
    preferredInstrument: 'SAFE',
    accreditedStatus: 'not-sure',
    existingRelationship: 'Family friend of the founder',
    electronicConsent: true,
    reservationAcknowledgment: true,
    riskAcknowledged: true,
    typedSignature: 'Jordan Miller',
    submittedAt: '2026-04-26T15:30:00.000Z',
    status: 'reviewing',
    packageDownloadedAt: '2026-04-26T15:25:00.000Z',
  },
  {
    ...blankInvestor,
    id: 'demo-2',
    investorType: 'entity',
    fullLegalName: 'Priya Shah',
    email: 'priya@example.com',
    phone: '(555) 812-4401',
    state: 'NY',
    entityName: 'Northstar Angel LLC',
    entityType: 'LLC',
    entityJurisdiction: 'Delaware',
    signerTitle: 'Managing Member',
    proposedAmount: '50000',
    preferredInstrument: 'SAFE',
    accreditedStatus: 'entity',
    existingRelationship: 'Warm introduction from advisor',
    electronicConsent: true,
    reservationAcknowledgment: true,
    riskAcknowledged: true,
    typedSignature: 'Priya Shah',
    submittedAt: '2026-04-27T18:05:00.000Z',
    status: 'accepted',
    packageDownloadedAt: '2026-04-27T17:55:00.000Z',
  },
];

const currency = (value: string | number) => {
  const numberValue = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numberValue)) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(numberValue);
};

const formatDate = (value?: string) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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

const inputBase =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:ring-blue-500/20';

const labelBase = 'mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300';

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { settings: defaultSettings, submissions: demoSubmissions };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      settings: { ...defaultSettings, ...(parsed.settings || {}) },
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : demoSubmissions,
    };
  } catch {
    return { settings: defaultSettings, submissions: demoSubmissions };
  }
}

function buildInvestorPackageHtml(settings: RaiseSettings, investor: InvestorForm | InvestorSubmission) {
  const submittedAt = 'submittedAt' in investor ? investor.submittedAt : new Date().toISOString();
  const entityBlock = investor.investorType === 'entity' || investor.entityName
    ? `
      <h2>Entity Information</h2>
      <table>
        <tr><th>Entity Name</th><td>${escapeHtml(investor.entityName || 'Not provided')}</td></tr>
        <tr><th>Entity Type</th><td>${escapeHtml(investor.entityType || 'Not provided')}</td></tr>
        <tr><th>Jurisdiction</th><td>${escapeHtml(investor.entityJurisdiction || 'Not provided')}</td></tr>
        <tr><th>Authorized Signer / Title</th><td>${escapeHtml(`${investor.fullLegalName || 'Not provided'}${investor.signerTitle ? `, ${investor.signerTitle}` : ''}`)}</td></tr>
      </table>
    `
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(settings.publicCompanyName)} Investor Package</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
    .page { max-width: 880px; margin: 0 auto; padding: 42px 24px; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 24px 80px rgba(15,23,42,.10); }
    .brand { color: #2563eb; font-size: 12px; font-weight: 900; letter-spacing: .22em; text-transform: uppercase; }
    h1 { font-size: 34px; line-height: 1.05; margin: 12px 0 8px; }
    h2 { font-size: 18px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    p { line-height: 1.55; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { text-align: left; vertical-align: top; border-bottom: 1px solid #e2e8f0; padding: 12px 8px; }
    th { width: 34%; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: .10em; }
    .notice { background: #fff7ed; border: 1px solid #fed7aa; color: #7c2d12; padding: 16px; border-radius: 18px; margin: 18px 0; }
    .signature { margin-top: 28px; padding: 18px; border: 1px dashed #94a3b8; border-radius: 18px; }
    .footer { font-size: 12px; color: #64748b; margin-top: 24px; }
    @media print { body { background: white; } .page { padding: 0; } .card { box-shadow: none; border: none; border-radius: 0; } }
  </style>
</head>
<body>
  <main class="page">
    <section class="card">
      <div class="brand">MONIEZI Raise · Private Investor Package</div>
      <h1>${escapeHtml(settings.roundName)}</h1>
      <p><strong>${escapeHtml(settings.companyLegalName)}</strong> has prepared this private reservation package for the investor listed below.</p>
      <div class="notice"><strong>Important:</strong> ${escapeHtml(settings.riskAcknowledgment)}</div>

      <h2>Company and Offering Summary</h2>
      <table>
        <tr><th>Company</th><td>${escapeHtml(settings.companyLegalName)}</td></tr>
        <tr><th>Contact</th><td>${escapeHtml(settings.founderName)} · ${escapeHtml(settings.contactEmail)} · ${escapeHtml(settings.contactPhone)}</td></tr>
        <tr><th>Instrument</th><td>${escapeHtml(settings.instrument)}</td></tr>
        <tr><th>Target Raise</th><td>${currency(settings.targetRaise)}</td></tr>
        <tr><th>Minimum Investment</th><td>${currency(settings.minimumInvestment)}</td></tr>
        <tr><th>Valuation Cap</th><td>${settings.valuationCap ? currency(settings.valuationCap) : 'Not specified'}</td></tr>
        <tr><th>Discount Rate</th><td>${settings.discountRate ? `${escapeHtml(settings.discountRate)}%` : 'Not specified'}</td></tr>
        <tr><th>Deadline</th><td>${formatDate(settings.deadline)}</td></tr>
        <tr><th>Use of Funds</th><td>${escapeHtml(settings.useOfFunds)}</td></tr>
      </table>

      <h2>Investor Reservation</h2>
      <table>
        <tr><th>Investor</th><td>${escapeHtml(investor.fullLegalName || 'Not provided')}</td></tr>
        <tr><th>Email</th><td>${escapeHtml(investor.email || 'Not provided')}</td></tr>
        <tr><th>Phone</th><td>${escapeHtml(investor.phone || 'Not provided')}</td></tr>
        <tr><th>Investor Type</th><td>${escapeHtml(investor.investorType)}</td></tr>
        <tr><th>Proposed Amount</th><td>${currency(investor.proposedAmount)}</td></tr>
        <tr><th>Preferred Instrument</th><td>${escapeHtml(investor.preferredInstrument)}</td></tr>
        <tr><th>Accredited Status</th><td>${escapeHtml(investor.accreditedStatus || 'Not provided')}</td></tr>
        <tr><th>Relationship</th><td>${escapeHtml(investor.existingRelationship || 'Not provided')}</td></tr>
        <tr><th>Submitted / Prepared</th><td>${formatDate(submittedAt)}</td></tr>
      </table>

      ${entityBlock}

      <h2>Wire Security Notice</h2>
      <p>${escapeHtml(settings.wireNotice)}</p>

      <h2>Acknowledgments</h2>
      <p>By submitting this package, the investor indicates interest only. No securities are issued and no investment is complete until the company accepts the reservation, provides final documents, confirms payment instructions, receives funds, and records the transaction.</p>

      <div class="signature">
        <strong>Typed Signature:</strong> ${escapeHtml(investor.typedSignature || 'Not signed')}<br />
        <strong>Date:</strong> ${formatDate(submittedAt)}
      </div>

      <p class="footer">Generated by MONIEZI Raise. This package is a business workflow document and should be reviewed with legal counsel before use as a final securities agreement.</p>
    </section>
  </main>
</body>
</html>`;
}

function IconLogo({ settings }: { settings: RaiseSettings }) {
  if (settings.logoDataUrl) {
    return <img src={settings.logoDataUrl} alt="Company logo" className="h-12 w-12 rounded-2xl object-cover shadow-lg" />;
  }
  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/20">
      <Landmark className="h-7 w-7 text-white" />
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

function StatCard({ label, value, icon: Icon, tone = 'blue' }: { label: string; value: string; icon: React.ElementType; tone?: 'blue' | 'green' | 'amber' }) {
  const tones = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-900/20',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-900/20',
    amber: 'from-amber-400 to-orange-500 shadow-amber-900/20',
  };
  return (
    <div className="rounded-[1.65rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tones[tone]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
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

function App() {
  const [state, setState] = useState<AppState>(() => loadInitialState());
  const [view, setView] = useState<ViewKey>('investor');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<InvestorForm>(() => ({ ...blankInvestor, preferredInstrument: defaultSettings.instrument }));
  const [copied, setCopied] = useState('');

  const settings = state.settings;
  const submissions = state.submissions;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateSettings = (patch: Partial<RaiseSettings>) => setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  const updateForm = (patch: Partial<InvestorForm>) => setForm((prev) => ({ ...prev, ...patch }));

  const submittedTotal = useMemo(
    () => submissions.reduce((sum, item) => sum + (Number(item.proposedAmount) || 0), 0),
    [submissions]
  );

  const canSubmit =
    form.fullLegalName.trim() &&
    form.email.trim() &&
    Number(form.proposedAmount) > 0 &&
    form.electronicConsent &&
    form.reservationAcknowledgment &&
    form.riskAcknowledged &&
    form.typedSignature.trim();

  const steps = [
    'Investor Type',
    'Contact Details',
    'Entity Info',
    'Investment Interest',
    'Qualification',
    'Review & Submit',
  ];

  const saveSubmission = () => {
    if (!canSubmit) return;
    const now = new Date().toISOString();
    const submission: InvestorSubmission = {
      ...form,
      id: `sub-${Date.now()}`,
      submittedAt: now,
      status: 'submitted',
    };
    setState((prev) => ({ ...prev, submissions: [submission, ...prev.submissions] }));
    setForm({ ...blankInvestor, preferredInstrument: settings.instrument });
    setStep(0);
    setView('submissions');
  };

  const downloadPackage = (investor: InvestorForm | InvestorSubmission = form) => {
    const html = buildInvestorPackageHtml(settings, investor);
    const baseName = (investor.fullLegalName || settings.publicCompanyName || 'investor').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'investor';
    downloadTextFile(`${baseName}-moniezi-raise-investor-package.html`, html, 'text/html;charset=utf-8');
    if ('id' in investor) {
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        submissions: prev.submissions.map((item) => (item.id === investor.id ? { ...item, packageDownloadedAt: now } : item)),
      }));
    }
  };

  const exportSubmissionsCsv = () => {
    const headers = ['Status', 'Submitted', 'Investor', 'Email', 'Phone', 'Type', 'Entity', 'Proposed Amount', 'Instrument', 'Accredited', 'Relationship'];
    const rows = submissions.map((item) => [
      item.status,
      item.submittedAt,
      item.fullLegalName,
      item.email,
      item.phone,
      item.investorType,
      item.entityName,
      item.proposedAmount,
      item.preferredInstrument,
      item.accreditedStatus,
      item.existingRelationship,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadTextFile('moniezi-raise-investor-submissions.csv', csv, 'text/csv;charset=utf-8');
  };

  const exportProfile = () => {
    downloadTextFile('moniezi-raise-company-profile.json', JSON.stringify(settings, null, 2), 'application/json;charset=utf-8');
  };

  const importProfile = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    updateSettings({
      companyLegalName: parsed.companyLegalName || parsed.businessName || parsed.legalName || settings.companyLegalName,
      publicCompanyName: parsed.publicCompanyName || parsed.businessName || parsed.companyName || settings.publicCompanyName,
      founderName: parsed.founderName || parsed.ownerName || parsed.contactName || settings.founderName,
      contactEmail: parsed.contactEmail || parsed.email || parsed.businessEmail || settings.contactEmail,
      contactPhone: parsed.contactPhone || parsed.phone || parsed.businessPhone || settings.contactPhone,
      companyAddress: parsed.companyAddress || parsed.address || parsed.businessAddress || settings.companyAddress,
      website: parsed.website || parsed.businessWebsite || settings.website,
      logoDataUrl: parsed.logoDataUrl || parsed.logo || settings.logoDataUrl,
    });
  };

  const copyInvitation = async () => {
    const message = `${settings.publicCompanyName}: ${settings.pageHeadline}\n\n${settings.pageSubtitle}\n\nMinimum investment: ${currency(settings.minimumInvestment)}\nInstrument: ${settings.instrument}\n\nPlease open the private MONIEZI Raise page, review the package, and submit your reservation for company review.`;
    await navigator.clipboard.writeText(message);
    setCopied('Invitation copied');
    setTimeout(() => setCopied(''), 1600);
  };

  const setSubmissionStatus = (id: string, status: SubmissionStatus) => {
    setState((prev) => ({ ...prev, submissions: prev.submissions.map((item) => (item.id === id ? { ...item, status } : item)) }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-[#080d1d] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#081226]/95 px-4 py-3 shadow-2xl shadow-slate-950/20 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconLogo settings={settings} />
            <div>
              <div className="text-xl font-black tracking-[0.12em] text-white">MONIEZI <span className="text-blue-300">Raise</span></div>
              <div className="text-[11px] font-black uppercase tracking-[0.26em] text-blue-100/80">Investor Portal</div>
            </div>
          </div>
          <button
            onClick={copyInvitation}
            className="hidden rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-black/20 active:scale-95 sm:inline-flex"
          >
            {copied || 'Copy Invite'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:pt-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 p-6 text-white shadow-2xl shadow-slate-950/30 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-200">Standalone private fundraising page-app</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{settings.pageHeadline}</h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-blue-100/90 sm:text-lg">{settings.pageSubtitle}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => { setView('investor'); setStep(0); }} className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg active:scale-95">
                  Start Investor Signup
                </button>
                <button onClick={() => setView('setup')} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur active:scale-95">
                  Configure Raise
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100/80">Instrument</p>
                <p className="mt-1 text-2xl font-black">{settings.instrument}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100/80">Minimum</p>
                <p className="mt-1 text-2xl font-black">{currency(settings.minimumInvestment)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100/80">Deadline</p>
                <p className="mt-1 text-2xl font-black">{formatDate(settings.deadline)}</p>
              </div>
            </div>
          </div>
        </section>

        <nav className="mt-5 grid grid-cols-2 gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20 sm:grid-cols-5">
          {([
            ['investor', 'Investor Page', FileSignature],
            ['setup', 'Raise Setup', Settings],
            ['submissions', 'Submissions', ClipboardCheck],
            ['package', 'Package', FileText],
            ['guide', 'Guide', ShieldCheck],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black transition active:scale-95 ${view === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Target Raise" value={currency(settings.targetRaise)} icon={BadgeDollarSign} />
          <StatCard label="Reserved / Proposed" value={currency(submittedTotal)} icon={CheckCircle2} tone="green" />
          <StatCard label="Investor Submissions" value={String(submissions.length)} icon={UserRound} tone="amber" />
        </div>

        <div className="mt-6">
          {view === 'setup' && (
            <div className="grid gap-6">
              <SectionCard title="Company Profile" eyebrow="Setup">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Legal company name"><input className={inputBase} value={settings.companyLegalName} onChange={(e) => updateSettings({ companyLegalName: e.target.value })} /></Field>
                  <Field label="Public display name"><input className={inputBase} value={settings.publicCompanyName} onChange={(e) => updateSettings({ publicCompanyName: e.target.value })} /></Field>
                  <Field label="Founder / contact name"><input className={inputBase} value={settings.founderName} onChange={(e) => updateSettings({ founderName: e.target.value })} /></Field>
                  <Field label="Founder title"><input className={inputBase} value={settings.founderTitle} onChange={(e) => updateSettings({ founderTitle: e.target.value })} /></Field>
                  <Field label="Contact email"><input className={inputBase} type="email" value={settings.contactEmail} onChange={(e) => updateSettings({ contactEmail: e.target.value })} /></Field>
                  <Field label="Contact phone"><input className={inputBase} value={settings.contactPhone} onChange={(e) => updateSettings({ contactPhone: e.target.value })} /></Field>
                  <Field label="Website"><input className={inputBase} value={settings.website} onChange={(e) => updateSettings({ website: e.target.value })} /></Field>
                  <Field label="Company logo">
                    <input
                      className={inputBase}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => updateSettings({ logoDataUrl: String(reader.result || '') });
                        reader.readAsDataURL(file);
                      }}
                    />
                  </Field>
                  <div className="md:col-span-2"><Field label="Company address"><textarea className={`${inputBase} min-h-[92px]`} value={settings.companyAddress} onChange={(e) => updateSettings({ companyAddress: e.target.value })} /></Field></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={exportProfile} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30"><Download className="h-4 w-4" /> Export Profile</button>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-950 dark:text-white">
                    <Upload className="h-4 w-4" /> Import Pro Profile
                    <input type="file" accept="application/json" className="hidden" onChange={(e) => importProfile(e.target.files?.[0])} />
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Raise Details" eyebrow="Offering setup">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Round name"><input className={inputBase} value={settings.roundName} onChange={(e) => updateSettings({ roundName: e.target.value })} /></Field>
                  <Field label="Instrument">
                    <select className={inputBase} value={settings.instrument} onChange={(e) => updateSettings({ instrument: e.target.value as InstrumentType })}>
                      {['SAFE', 'Common Stock', 'Preferred Stock', 'Convertible Note', 'Reservation Only'].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </Field>
                  <Field label="Target raise"><input className={inputBase} inputMode="decimal" value={settings.targetRaise} onChange={(e) => updateSettings({ targetRaise: e.target.value })} /></Field>
                  <Field label="Minimum investment"><input className={inputBase} inputMode="decimal" value={settings.minimumInvestment} onChange={(e) => updateSettings({ minimumInvestment: e.target.value })} /></Field>
                  <Field label="Valuation cap"><input className={inputBase} inputMode="decimal" value={settings.valuationCap} onChange={(e) => updateSettings({ valuationCap: e.target.value })} /></Field>
                  <Field label="Discount rate %"><input className={inputBase} inputMode="decimal" value={settings.discountRate} onChange={(e) => updateSettings({ discountRate: e.target.value })} /></Field>
                  <Field label="Target close / deadline"><input className={inputBase} type="date" value={settings.deadline} onChange={(e) => updateSettings({ deadline: e.target.value })} /></Field>
                  <Field label="Wire security notice"><textarea className={`${inputBase} min-h-[92px]`} value={settings.wireNotice} onChange={(e) => updateSettings({ wireNotice: e.target.value })} /></Field>
                  <div className="md:col-span-2"><Field label="Use of funds"><textarea className={`${inputBase} min-h-[120px]`} value={settings.useOfFunds} onChange={(e) => updateSettings({ useOfFunds: e.target.value })} /></Field></div>
                  <div className="md:col-span-2"><Field label="Company story"><textarea className={`${inputBase} min-h-[140px]`} value={settings.companyStory} onChange={(e) => updateSettings({ companyStory: e.target.value })} /></Field></div>
                  <div className="md:col-span-2"><Field label="Risk / reservation acknowledgment"><textarea className={`${inputBase} min-h-[140px]`} value={settings.riskAcknowledgment} onChange={(e) => updateSettings({ riskAcknowledgment: e.target.value })} /></Field></div>
                </div>
              </SectionCard>
            </div>
          )}

          {view === 'investor' && (
            <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
              <SectionCard title="Six-Step Investor Signup" eyebrow="Investor-facing workflow">
                <div className="space-y-3">
                  {steps.map((item, index) => (
                    <button
                      key={item}
                      onClick={() => setStep(index)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition active:scale-[.99] ${step === index ? 'border-blue-500 bg-blue-50 text-blue-950 dark:border-blue-300 dark:bg-blue-500/20 dark:text-white' : 'border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200'}`}
                    >
                      <span className="font-black">{index + 1}. {item}</span>
                      {index < step ? <Check className="h-5 w-5 text-emerald-500" /> : <ArrowRight className="h-5 w-5" />}
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                  <AlertTriangle className="mb-2 h-5 w-5" />
                  This workflow collects a proposed reservation or indication of interest. It does not complete a securities sale or issue shares.
                </div>
              </SectionCard>

              <SectionCard title={steps[step]} eyebrow={`${settings.publicCompanyName} · ${settings.roundName}`}>
                {step === 0 && (
                  <div className="grid gap-3">
                    {([
                      ['individual', 'Individual investor'],
                      ['entity', 'Company / LLC investor'],
                      ['trust', 'Trust'],
                      ['family-office', 'Family office'],
                      ['other', 'Other'],
                    ] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateForm({ investorType: value })} className={`rounded-2xl border px-4 py-4 text-left font-black ${form.investorType === value ? 'border-blue-500 bg-blue-50 text-blue-950 dark:bg-blue-500/20 dark:text-white' : 'border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-950/50 dark:text-white'}`}>{label}</button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full legal name"><input className={inputBase} value={form.fullLegalName} onChange={(e) => updateForm({ fullLegalName: e.target.value })} /></Field>
                    <Field label="Email"><input className={inputBase} type="email" value={form.email} onChange={(e) => updateForm({ email: e.target.value })} /></Field>
                    <Field label="Phone"><input className={inputBase} value={form.phone} onChange={(e) => updateForm({ phone: e.target.value })} /></Field>
                    <Field label="Country"><input className={inputBase} value={form.country} onChange={(e) => updateForm({ country: e.target.value })} /></Field>
                    <Field label="State / province"><input className={inputBase} value={form.state} onChange={(e) => updateForm({ state: e.target.value })} /></Field>
                    <div className="md:col-span-2"><Field label="Address"><textarea className={`${inputBase} min-h-[88px]`} value={form.address} onChange={(e) => updateForm({ address: e.target.value })} /></Field></div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Entity legal name"><input className={inputBase} value={form.entityName} onChange={(e) => updateForm({ entityName: e.target.value })} placeholder="Leave blank for individual" /></Field>
                    <Field label="Entity type"><input className={inputBase} value={form.entityType} onChange={(e) => updateForm({ entityType: e.target.value })} placeholder="LLC, corporation, trust..." /></Field>
                    <Field label="Formation state/country"><input className={inputBase} value={form.entityJurisdiction} onChange={(e) => updateForm({ entityJurisdiction: e.target.value })} /></Field>
                    <Field label="Signer title"><input className={inputBase} value={form.signerTitle} onChange={(e) => updateForm({ signerTitle: e.target.value })} placeholder="Managing Member, Trustee..." /></Field>
                    <div className="md:col-span-2 rounded-2xl bg-slate-100 p-4 text-sm font-bold leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                      Individual investors can leave this section blank. Entity investors should enter the entity and authorized signer details.
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Proposed pledge / reservation amount"><input className={inputBase} inputMode="decimal" value={form.proposedAmount} onChange={(e) => updateForm({ proposedAmount: e.target.value })} placeholder="25000" /></Field>
                    <Field label="Preferred instrument">
                      <select className={inputBase} value={form.preferredInstrument} onChange={(e) => updateForm({ preferredInstrument: e.target.value as InstrumentType })}>
                        {['SAFE', 'Common Stock', 'Preferred Stock', 'Convertible Note', 'Reservation Only'].map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </Field>
                    <div className="md:col-span-2"><Field label="Expected timing"><input className={inputBase} value={form.amountTiming} onChange={(e) => updateForm({ amountTiming: e.target.value })} /></Field></div>
                    <div className="md:col-span-2"><Field label="Investor notes"><textarea className={`${inputBase} min-h-[110px]`} value={form.notes} onChange={(e) => updateForm({ notes: e.target.value })} /></Field></div>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid gap-4">
                    <Field label="Investor qualification">
                      <select className={inputBase} value={form.accreditedStatus} onChange={(e) => updateForm({ accreditedStatus: e.target.value as InvestorForm['accreditedStatus'] })}>
                        <option value="">Select one</option>
                        <option value="yes">Accredited investor</option>
                        <option value="no">Not accredited</option>
                        <option value="not-sure">Not sure</option>
                        <option value="entity">Entity-level qualification to review</option>
                      </select>
                    </Field>
                    <Field label="Existing relationship with company/founder"><textarea className={`${inputBase} min-h-[120px]`} value={form.existingRelationship} onChange={(e) => updateForm({ existingRelationship: e.target.value })} placeholder="Friend, family, existing customer, advisor intro, etc." /></Field>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-950 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-100">
                      Private fundraising should usually be limited to people with a real relationship or appropriate investor qualification. The company should review each submission before accepting money.
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                      <h3 className="text-lg font-black text-slate-950 dark:text-white">Review Summary</h3>
                      <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                        <p><strong>Investor:</strong> {form.fullLegalName || 'Not entered'}</p>
                        <p><strong>Email:</strong> {form.email || 'Not entered'}</p>
                        <p><strong>Amount:</strong> {currency(form.proposedAmount)}</p>
                        <p><strong>Instrument:</strong> {form.preferredInstrument}</p>
                        <p><strong>Entity:</strong> {form.entityName || 'Individual / not entered'}</p>
                        <p><strong>Qualification:</strong> {form.accreditedStatus || 'Not entered'}</p>
                      </div>
                    </div>
                    <button onClick={() => downloadPackage(form)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-base font-black text-white shadow-xl shadow-blue-900/20 active:scale-95 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30">
                      <Download className="h-5 w-5" /> Download Investor Package
                    </button>
                    <div className="space-y-3">
                      {[
                        ['electronicConsent', 'I agree to receive and sign records electronically.'],
                        ['reservationAcknowledgment', 'I understand this is a reservation / indication of interest only and is subject to company acceptance.'],
                        ['riskAcknowledged', 'I understand private investments involve risk and may result in loss of capital.'],
                      ].map(([key, label]) => (
                        <label key={key} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100">
                          <input type="checkbox" checked={Boolean(form[key as keyof InvestorForm])} onChange={(e) => updateForm({ [key]: e.target.checked } as Partial<InvestorForm>)} className="mt-1 h-5 w-5" />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    <Field label="Typed signature"><input className={inputBase} value={form.typedSignature} onChange={(e) => updateForm({ typedSignature: e.target.value })} placeholder={form.fullLegalName || 'Type full legal name'} /></Field>
                    <button disabled={!canSubmit} onClick={saveSubmission} className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-black shadow-xl active:scale-95 ${canSubmit ? 'bg-blue-600 text-white shadow-blue-900/20' : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>
                      <Send className="h-5 w-5" /> Submit Reservation for Company Review
                    </button>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-white/10">
                  <button disabled={step === 0} onClick={() => setStep((prev) => Math.max(0, prev - 1))} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-900 disabled:opacity-40 dark:border-white/10 dark:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button disabled={step === steps.length - 1} onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 disabled:opacity-40 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30">Next <ArrowRight className="h-4 w-4" /></button>
                </div>
              </SectionCard>
            </div>
          )}

          {view === 'submissions' && (
            <SectionCard title="Investor Submissions" eyebrow="Owner tracking">
              <div className="mb-5 flex flex-wrap gap-3">
                <button onClick={exportSubmissionsCsv} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30"><Download className="h-4 w-4" /> Export CSV</button>
                <button onClick={() => downloadTextFile('moniezi-raise-submissions.json', JSON.stringify(submissions, null, 2), 'application/json;charset=utf-8')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-950 dark:text-white"><Download className="h-4 w-4" /> Export JSON</button>
              </div>
              <div className="grid gap-4">
                {submissions.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">{item.status}</p>
                        <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{item.fullLegalName}</h3>
                        <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                          <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {item.email}</span>
                          <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {item.phone || 'No phone'}</span>
                          <span><strong>Amount:</strong> {currency(item.proposedAmount)}</span>
                          <span><strong>Instrument:</strong> {item.preferredInstrument}</span>
                          <span><strong>Entity:</strong> {item.entityName || 'Individual'}</span>
                          <span><strong>Submitted:</strong> {formatDate(item.submittedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:min-w-48">
                        <select className={inputBase} value={item.status} onChange={(e) => setSubmissionStatus(item.id, e.target.value as SubmissionStatus)}>
                          {['submitted', 'reviewing', 'accepted', 'declined', 'funded'].map((status) => <option key={status}>{status}</option>)}
                        </select>
                        <button onClick={() => downloadPackage(item)} className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30">Download Package</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {view === 'package' && (
            <SectionCard title="Investor Package Preview" eyebrow="Downloadable agreement package">
              <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                  <p className="text-sm font-bold leading-7 text-slate-700 dark:text-slate-200">This package is generated from Raise Setup plus the investor's answers. It gives the investor a clean review copy they can download before submitting a reservation.</p>
                  <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <p><strong>Company:</strong> {settings.companyLegalName}</p>
                    <p><strong>Round:</strong> {settings.roundName}</p>
                    <p><strong>Instrument:</strong> {settings.instrument}</p>
                    <p><strong>Target:</strong> {currency(settings.targetRaise)}</p>
                    <p><strong>Minimum:</strong> {currency(settings.minimumInvestment)}</p>
                    <p><strong>Deadline:</strong> {formatDate(settings.deadline)}</p>
                  </div>
                  <button onClick={() => downloadPackage(form)} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95"><Download className="h-4 w-4" /> Download Current Draft Package</button>
                </div>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-7 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                  <FileText className="mb-3 h-7 w-7" />
                  The downloaded file is an HTML package designed to open cleanly in any browser and print/save to PDF. The buyer should replace sample terms with attorney-approved SAFE or private investment documents before using it as a final agreement.
                </div>
              </div>
            </SectionCard>
          )}

          {view === 'guide' && (
            <div className="grid gap-6">
              <SectionCard title="How MONIEZI Raise Fits the Product Package" eyebrow="Product strategy">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">MONIEZI Pro Finance</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">Owner/admin app for bookkeeping, invoices, receipts, mileage, reports, tax prep, internal equity records, SAFE tracking, reservations, and cap-table exports.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">MONIEZI Raise</h3>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">Standalone investor-facing page-app for private raise setup, six-step signup, pledge/reservation amount, downloadable investor package, signature acknowledgments, and submission exports.</p>
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Recommended Use" eyebrow="Workflow">
                <ol className="space-y-3 text-base font-bold leading-7 text-slate-700 dark:text-slate-200">
                  <li>1. Configure company and raise details in Raise Setup.</li>
                  <li>2. Share the MONIEZI Raise page with invited investors only.</li>
                  <li>3. Investor completes the six-step signup and downloads the package.</li>
                  <li>4. Investor submits a proposed pledge/reservation amount.</li>
                  <li>5. Owner reviews submissions, exports records, and sends final legal documents/payment instructions outside the public page until Cloudflare backend is connected.</li>
                </ol>
              </SectionCard>
            </div>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-950/95 sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          {([
            ['investor', FileSignature, 'Signup'],
            ['setup', Settings, 'Setup'],
            ['submissions', ClipboardCheck, 'Subs'],
            ['package', FileText, 'Docs'],
            ['guide', ShieldCheck, 'Guide'],
          ] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setView(key)} className={`rounded-2xl px-2 py-2 text-[11px] font-black ${view === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30' : 'text-slate-700 dark:text-slate-200'}`}>
              <Icon className="mx-auto h-5 w-5" />
              <span className="mt-1 block">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
