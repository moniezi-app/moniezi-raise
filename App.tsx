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
type TemplateKey = 'emyrgen' | 'startup' | 'local';
type RaiseMode = 'startup' | 'local';
type LeadStatus = 'new' | 'reviewing' | 'package-sent' | 'approved' | 'declined' | 'funded';
type SupporterType = 'individual' | 'business' | 'entity' | 'lender' | 'other';

interface RaiseSettings {
  templateKey: TemplateKey;
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
  heroEyebrow: string;
  portalHeadline: string;
  portalSubtitle: string;
  offerLabel: string;
  roundType: string;
  fundingGoal: string;
  minimumInterest: string;
  deadline: string;
  businessSummary: string;
  opportunitySummary: string;
  investmentThesis: string;
  whyNowTitle: string;
  whyNowSummary: string;
  whyNowCards: string;
  modelTitle: string;
  modelSummary: string;
  modelCards: string;
  proofTitle: string;
  proofSummary: string;
  proofCards: string;
  useOfFunds: string;
  marketTitle: string;
  marketSummary: string;
  marketCards: string;
  termsSummary: string;
  audienceSummary: string;
  processSummary: string;
  processSteps: string;
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

interface RowCard {
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
}

const STORAGE_KEY = 'moniezi-raise-v1-3-1-state';

const emyrgenStyleTemplate: RaiseSettings = {
  templateKey: 'emyrgen',
  raiseMode: 'startup',
  businessName: 'Apex Mission Systems',
  legalName: 'Apex Mission Systems, Inc.',
  founderName: 'Alex Founder',
  founderTitle: 'Founder & CEO',
  contactEmail: 'founder@example.com',
  contactPhone: '(555) 014-2026',
  website: 'https://example.com',
  location: 'United States',
  logoDataUrl: '',
  heroEyebrow: 'Private round · Investor portal template',
  portalHeadline: 'Back the company building a repeatable mission platform',
  portalSubtitle:
    'A professional private investor portal for selected contacts. Review the company story, investment case, use of funds, process, and next step before submitting a non-binding indication of interest.',
  offerLabel: 'EMYRGEN-style investor portal',
  roundType: 'Private founder round',
  fundingGoal: '250000',
  minimumInterest: '5000',
  deadline: '2026-06-30',
  businessSummary:
    'Apex Mission Systems is building a specialized business platform for customers who need a practical solution, credible execution, and a clear path from early product work to commercial deployment.',
  opportunitySummary:
    'The company is organizing private investor interest to fund product completion, customer validation, market launch, and professional readiness. The goal is to move from a founder-led build into a repeatable commercial program.',
  investmentThesis:
    'Investors are not just reviewing an idea. They are reviewing a company with a defined product direction, a focused customer segment, a founder-led execution plan, and a funding round tied to specific commercial milestones.',
  whyNowTitle: 'Three forces make this moment important',
  whyNowSummary:
    'The investor case becomes stronger when the page explains why this business should be funded now, not someday. Use this section to connect customer demand, execution progress, and the funding window.',
  whyNowCards:
    '01|Execution proof|Built beyond the idea stage|The company has moved from concept into a working direction with defined deliverables, customer logic, and a founder-led execution plan.|Execution;Milestones;Founder-led\n02|Market opening|Customers need a clearer solution|The target customers are underserved by expensive, complex, or generic tools. The company is positioned around a focused use case instead of a broad unfocused product.|Customer Pain;Focused Market;Timing\n03|Funding leverage|Capital changes the speed of execution|The raise is tied to specific milestones: finish the product, reach customers, produce materials, and convert interest into revenue opportunities.|Use of Funds;Launch;Growth',
  modelTitle: 'A repeatable business, not a one-off project',
  modelSummary:
    'This section explains how the business can repeat its work, reach customers, and create revenue after the first launch. It should show investors that the company has a model, not just a single transaction.',
  modelCards:
    '01|Product / service core|The main offer customers buy|Define the actual product, service, or platform the company sells and the problem it solves.\n02|Customer channel|How buyers are reached|Explain direct sales, local relationships, founder outreach, referrals, partnerships, marketplace listings, or vertical communities.\n03|Revenue path|How money comes in|Describe setup fees, product sales, subscriptions, service packages, licensing, repeat work, support, or expansion revenue.\n04|Operating advantage|Why this company can execute|Show founder expertise, cost advantage, relationships, speed, proprietary workflow, or market insight.',
  proofTitle: 'Proof, assets, and readiness',
  proofSummary:
    'Investors need evidence. This section gives the buyer a place to show traction, early work, customer conversations, signed jobs, prototype status, revenue, assets, or business readiness.',
  proofCards:
    'Proof 01|Customer signal|Early customer conversations, signed jobs, waitlist interest, LOIs, referrals, or direct buyer feedback.\nProof 02|Product progress|Prototype, demo, app build, service workflow, operating process, supplier readiness, or technical milestone.\nProof 03|Founder credibility|Relevant experience, execution history, industry knowledge, operational discipline, or relationship network.\nProof 04|Commercial readiness|Launch plan, pricing path, customer acquisition plan, package materials, and next-step process.',
  useOfFunds:
    'Product completion, customer acquisition, launch materials, working capital, professional fees, founder operations, support systems, and the first commercial rollout milestones.',
  marketTitle: 'Market opportunity and revenue logic',
  marketSummary:
    'This section helps the buyer explain why the business opportunity is large enough, specific enough, and urgent enough to deserve investor attention.',
  marketCards:
    'Market|Specific customer pain|Name the buyer group and the painful problem they already understand.\nOpportunity|Underserved segment|Explain why existing alternatives are too expensive, too complicated, too slow, or too generic.\nRevenue|Multiple paths|Describe the first revenue path and possible recurring, repeat, or expansion revenue.\nTiming|Why now|Connect the funding round to a concrete near-term milestone.',
  termsSummary:
    'Proposed participation may be structured through a SAFE, convertible note, private business investment document, or other advisor-approved agreement. Final terms are subject to company review and written documentation.',
  audienceSummary:
    'Selected private contacts, warm introductions, friends and family, founder contacts, private investors, business supporters, or people who can evaluate the company directly.',
  processSummary:
    'Submit interest, request the package, speak with the founder, review final documents, verify payment instructions directly, and participate only after written company approval.',
  processSteps:
    '01|Express interest|Enter your contact information and proposed amount through the private signup flow.\n02|Request package|Receive or download the investor/supporter package for review.\n03|Founder conversation|Ask questions directly before any final decision.\n04|Review documents|Review the final advisor-approved documents and terms.\n05|Verify payment instructions|Do not send money until instructions are verified directly with the company.\n06|Receive confirmation|Participation is confirmed only after approval, signed documents, and cleared funds.',
  packageSummary:
    'The package should include the business overview, founder note, use of funds, proposed terms, risk notice, process steps, and contact information.',
  riskNotice:
    'This page collects non-binding indications of interest only. It is not a public offering, does not guarantee acceptance, and does not complete any investment, loan, or revenue-share arrangement. Final participation requires company approval, final documents, payment confirmation, and compliance with applicable rules.',
  wireNotice:
    'Do not send funds until the company verifies your information and sends final payment instructions from the official company contact email.',
};

const startupTemplate: RaiseSettings = {
  ...emyrgenStyleTemplate,
  templateKey: 'startup',
  raiseMode: 'startup',
  businessName: 'Acme Growth Labs',
  legalName: 'Acme Growth Labs, Inc.',
  heroEyebrow: 'Private startup round · Founder portal',
  portalHeadline: 'Private founder round for selected investors',
  portalSubtitle:
    'Review the company, product direction, use of funds, proposed terms, and next steps before submitting a non-binding indication of interest.',
  offerLabel: 'Startup / SAFE-style private raise',
  roundType: 'Startup private raise',
  businessSummary:
    'Acme Growth Labs is building a focused software product for small business operators who need clearer records, better workflows, and a simpler path from daily operations to financing readiness.',
  opportunitySummary:
    'The company is opening a private early-stage round for people with an existing relationship, a warm introduction, or direct founder approval. Funding supports product completion, customer acquisition, and launch execution.',
  investmentThesis:
    'The thesis is simple: small operators need practical software that helps them look organized, control their records, and prepare for business growth without jumping into expensive enterprise platforms.',
  useOfFunds:
    'Product development, customer acquisition, launch marketing, support operations, working capital, and professional fees related to the financing process.',
};

const localTemplate: RaiseSettings = {
  ...emyrgenStyleTemplate,
  templateKey: 'local',
  raiseMode: 'local',
  businessName: 'Northside Roofing & Repair',
  legalName: 'Northside Roofing & Repair LLC',
  founderName: 'Jordan Owner',
  founderTitle: 'Owner',
  contactEmail: 'owner@example.com',
  contactPhone: '(555) 015-7700',
  location: 'New Jersey',
  heroEyebrow: 'Private local-business expansion · Supporter portal',
  portalHeadline: 'Private expansion funding for a local business',
  portalSubtitle:
    'Review the business, what the money will be used for, the owner plan, and the next step for selected private contacts.',
  offerLabel: 'Local business expansion raise',
  roundType: 'Private expansion funding',
  fundingGoal: '75000',
  minimumInterest: '2500',
  deadline: '2026-07-31',
  businessSummary:
    'Northside Roofing & Repair is a local service business serving residential and small commercial customers. The business is seeking funding to expand capacity and complete more scheduled work.',
  opportunitySummary:
    'The owner is organizing private interest from selected contacts to support equipment, materials, vehicle capacity, working capital, and crew expansion. This is designed for practical local-business growth, not a Silicon Valley startup pitch.',
  investmentThesis:
    'The funding case is based on practical expansion: more equipment, more crew capacity, better job scheduling, and the ability to complete more revenue-producing work.',
  whyNowTitle: 'Three forces make this expansion practical',
  whyNowSummary:
    'A local-business raise works when the page shows current demand, a clear use of funds, and a specific expansion plan.',
  whyNowCards:
    '01|Customer demand|More work than current capacity|The business has demand that can be better served with more equipment, materials, and crew support.|Jobs;Capacity;Local Demand\n02|Clear funding use|Money goes into operating capacity|Funding is tied to vehicles, tools, materials, working capital, and crew expansion instead of vague overhead.|Equipment;Materials;Crew\n03|Owner execution|Founder-led local operation|Supporters can evaluate the owner, reputation, work history, and local relationships directly.|Owner;Trust;Execution',
  modelTitle: 'A practical expansion plan, not a startup fantasy',
  modelSummary:
    'This section explains how additional funding can increase work capacity and support more revenue-producing jobs.',
  modelCards:
    '01|Current business|Existing local service work|The business already serves customers and has a practical service model.\n02|Expansion input|Vehicles, tools, materials, and crew|The funding supports concrete operating needs that can increase capacity.\n03|Revenue capacity|More jobs completed|The business can pursue or complete more scheduled work when bottlenecks are reduced.\n04|Owner accountability|Direct operator relationship|Supporters can communicate with the owner and evaluate the business directly.',
  proofTitle: 'Local proof and business readiness',
  proofSummary:
    'Use this section to show demand, job history, customer relationships, equipment needs, and owner credibility.',
  proofCards:
    'Proof 01|Work history|Completed jobs, repeat customers, referrals, reviews, or before-and-after proof.\nProof 02|Demand signal|Pending work, signed jobs, customer inquiries, seasonal demand, or service backlog.\nProof 03|Equipment need|Specific vehicle, tool, material, crew, or working-capital bottleneck.\nProof 04|Owner credibility|Experience, local reputation, trade skill, licenses, insurance, or vendor relationships.',
  useOfFunds:
    'Work truck deposit or lease support, roofing tools, safety equipment, materials for signed jobs, short-term working capital, subcontractor support, and customer acquisition.',
  marketTitle: 'Local opportunity and repayment logic',
  marketSummary:
    'A local-business page should explain the service area, customer demand, expansion bottleneck, and how the owner expects to support repayment or agreed participation terms.',
  marketCards:
    'Service area|Local customer need|Explain the neighborhood, city, or region served and the demand for the service.\nBottleneck|Capacity problem|Show what currently limits growth: vehicle, crew, tools, materials, cash cycle, or scheduling.\nUse of funds|Concrete operating inputs|Tie the money directly to items that help the business complete more work.\nRepayment logic|Business cash-flow plan|Explain how completed jobs, monthly revenue, or agreed terms may support repayment or participation.',
  termsSummary:
    'Support may be discussed as a private business loan, repayment plan, revenue-share, profit-share, equipment-financing support, or other advisor-approved structure. Final terms are agreed separately in writing.',
  audienceSummary:
    'Friends, family, customers, local supporters, private lenders, business contacts, suppliers, and people who already know or can evaluate the owner.',
  processSummary:
    'Submit interest, request the expansion package, speak with the owner, review proposed terms, and proceed only after written approval and final documents.',
  processSteps:
    '01|Express interest|Enter your contact information and proposed support amount.\n02|Request package|Review the business expansion package and use of funds.\n03|Owner conversation|Speak with the owner before any decision.\n04|Review terms|Review the proposed repayment, revenue-share, profit-share, or support structure.\n05|Verify instructions|Do not send money until instructions are verified directly with the owner.\n06|Receive confirmation|Participation is confirmed only after approval, signed documents, and cleared funds.',
  packageSummary:
    'The supporter package should explain the business, expansion plan, use of funds, repayment concept, owner contact information, and review process.',
  riskNotice:
    'This page collects non-binding indications of interest only. It is not a public offering, does not guarantee repayment or return, and does not complete any loan, investment, or revenue-share arrangement. Final participation requires owner approval, final documents, and advisor review where appropriate.',
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
  String(value || '')
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

const parseCards = (value: string): RowCard[] =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split('|').map((part) => part.trim());
      return {
        eyebrow: parts[0] || String(index + 1).padStart(2, '0'),
        title: parts[1] || 'Untitled point',
        body: parts[2] || '',
        tags: (parts[3] || '')
          .split(';')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
    });

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { settings: emyrgenStyleTemplate, leads: demoLeads };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      settings: { ...emyrgenStyleTemplate, ...(parsed.settings || {}) },
      leads: Array.isArray(parsed.leads) ? parsed.leads : demoLeads,
    };
  } catch {
    return { settings: emyrgenStyleTemplate, leads: demoLeads };
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

function PortalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function MiniCard({ card }: { card: RowCard }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">{card.eyebrow}</p>
      <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{card.title}</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600 dark:text-slate-200">{card.body}</p>
      {card.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600 dark:bg-white/10 dark:text-slate-200">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function PortalSection({ eyebrow, title, summary, children }: { eyebrow: string; title: string; summary: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-black/20 lg:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">{eyebrow}</p>
      <div className="mt-3 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl">{title}</h2>
        <p className="text-base font-bold leading-8 text-slate-600 dark:text-slate-200">{summary}</p>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function PortalPreview({ settings, onSignup }: { settings: RaiseSettings; onSignup: () => void }) {
  const whyCards = parseCards(settings.whyNowCards);
  const modelCards = parseCards(settings.modelCards);
  const proofCards = parseCards(settings.proofCards);
  const marketCards = parseCards(settings.marketCards);
  const processCards = parseCards(settings.processSteps);

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
        <div className="flex flex-wrap gap-2">
          {['Offer', 'Why Now', 'Model', 'Proof', 'Market', 'Process', 'Signup'].map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1.05fr_.95fr] lg:p-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">{settings.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">{settings.portalHeadline}</h1>
          <p className="mt-5 text-lg font-bold leading-8 text-slate-600 dark:text-slate-200">{settings.portalSubtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onSignup} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95 dark:bg-blue-500 dark:text-white dark:shadow-blue-950/30">
              Start investor review <ArrowRight className="h-4 w-4" />
            </button>
            <a href={`mailto:${settings.contactEmail}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:shadow-black/20">
              Request package
            </a>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">The offer</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">What investors are reviewing</h2>
          <p className="mt-4 text-base font-bold leading-7 text-slate-300">{settings.opportunitySummary}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <PortalMetric label="Goal" value={money(settings.fundingGoal)} />
            <PortalMetric label="Minimum" value={money(settings.minimumInterest)} />
            <PortalMetric label="Deadline" value={formatDate(settings.deadline)} />
            <PortalMetric label="Round" value={settings.raiseMode === 'startup' ? 'Startup' : 'Local'} />
          </div>
        </aside>
      </div>

      <div className="grid gap-6 p-5 pt-0 lg:p-8 lg:pt-0">
        <PortalSection eyebrow="Investment case" title="What investors are buying into" summary={settings.investmentThesis}>
          <div className="grid gap-4 lg:grid-cols-3">
            <MiniCard card={{ eyebrow: 'Business', title: settings.businessName, body: settings.businessSummary, tags: [settings.location, settings.roundType] }} />
            <MiniCard card={{ eyebrow: 'Use of funds', title: 'Capital tied to milestones', body: settings.useOfFunds, tags: ['Funding Plan', 'Execution'] }} />
            <MiniCard card={{ eyebrow: 'Terms', title: settings.offerLabel, body: settings.termsSummary, tags: ['Owner Review', 'Final Docs'] }} />
          </div>
        </PortalSection>

        <PortalSection eyebrow="Why now" title={settings.whyNowTitle} summary={settings.whyNowSummary}>
          <div className="grid gap-4 lg:grid-cols-3">{whyCards.map((card) => <MiniCard key={`${card.eyebrow}-${card.title}`} card={card} />)}</div>
        </PortalSection>

        <PortalSection eyebrow="Business model" title={settings.modelTitle} summary={settings.modelSummary}>
          <div className="grid gap-4 lg:grid-cols-4">{modelCards.map((card) => <MiniCard key={`${card.eyebrow}-${card.title}`} card={card} />)}</div>
        </PortalSection>

        <PortalSection eyebrow="Proof" title={settings.proofTitle} summary={settings.proofSummary}>
          <div className="grid gap-4 lg:grid-cols-4">{proofCards.map((card) => <MiniCard key={`${card.eyebrow}-${card.title}`} card={card} />)}</div>
        </PortalSection>

        <PortalSection eyebrow="Market opportunity" title={settings.marketTitle} summary={settings.marketSummary}>
          <div className="grid gap-4 lg:grid-cols-4">{marketCards.map((card) => <MiniCard key={`${card.eyebrow}-${card.title}`} card={card} />)}</div>
        </PortalSection>

        <PortalSection eyebrow="Investment process" title="From interest to approved participation" summary={settings.processSummary}>
          <div className="grid gap-4 lg:grid-cols-3">{processCards.map((card) => <MiniCard key={`${card.eyebrow}-${card.title}`} card={card} />)}</div>
        </PortalSection>

        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm font-bold leading-7 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100 lg:p-8">
          <strong>Important notice:</strong> {settings.riskNotice} {settings.wireNotice}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Investor signup</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">Begin the private review</h2>
              <p className="mt-4 text-base font-bold leading-8 text-slate-300">Submit a non-binding indication of interest, request the package, and wait for owner review before any final documents or payment instructions.</p>
            </div>
            <div className="grid gap-3 rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-200">Contact</p>
              <p className="text-lg font-black">{settings.founderName}</p>
              <p className="font-bold text-slate-300">{settings.founderTitle}</p>
              <p className="font-bold text-slate-300">{settings.contactEmail}</p>
              <button onClick={onSignup} className="mt-2 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 active:scale-95">
                Open signup flow
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function rowCardsHtml(cards: RowCard[]) {
  return cards
    .map(
      (card) => `<article class="card"><span>${safeText(card.eyebrow)}</span><h3>${safeText(card.title)}</h3><p>${safeText(card.body)}</p>${
        card.tags.length ? `<div class="tags">${card.tags.map((tag) => `<b>${safeText(tag)}</b>`).join('')}</div>` : ''
      }</article>`,
    )
    .join('');
}

function buildPortalHtml(settings: RaiseSettings) {
  const accent = settings.raiseMode === 'startup' ? '#2563eb' : '#0f766e';
  const subject = encodeURIComponent(`Interest in ${settings.businessName} funding page`);
  const body = encodeURIComponent(`Hello ${settings.founderName},\n\nI reviewed the ${settings.businessName} funding page and would like to request more information.\n\nName:\nEmail:\nPhone:\nProposed amount:\nRelationship to business:\nMessage:\n\nThank you.`);
  const whyCards = parseCards(settings.whyNowCards);
  const modelCards = parseCards(settings.modelCards);
  const proofCards = parseCards(settings.proofCards);
  const marketCards = parseCards(settings.marketCards);
  const processCards = parseCards(settings.processSteps);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeText(settings.businessName)} Private Funding Portal</title>
  <style>
    :root { color-scheme: light; --accent: ${accent}; --ink: #0f172a; --muted: #475569; --line: #e2e8f0; --soft: #f8fafc; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: linear-gradient(180deg, #eef5ff 0%, #f8fafc 42%, #ffffff 100%); color: var(--ink); }
    .wrap { max-width: 1180px; margin: 0 auto; padding: 28px 20px 58px; }
    .nav { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:34px; position:sticky; top:0; z-index:5; padding:14px 0; backdrop-filter: blur(16px); }
    .brand { display:flex; align-items:center; gap:14px; font-weight:950; } .mark { width:48px; height:48px; border-radius:18px; display:grid; place-items:center; color:white; background:linear-gradient(135deg,#3b82f6,#4338ca); box-shadow:0 18px 40px rgba(37,99,235,.25); }
    .links { display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; } .links a { text-decoration:none; color:#334155; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.1em; padding:9px 12px; border-radius:999px; background:rgba(255,255,255,.78); border:1px solid rgba(226,232,240,.9); }
    .hero { display:grid; grid-template-columns:1.06fr .94fr; gap:28px; align-items:stretch; }
    h1 { font-size:clamp(42px,7vw,82px); line-height:.92; margin:22px 0 18px; letter-spacing:-.065em; } h2 { font-size:clamp(30px,4.4vw,54px); line-height:1; letter-spacing:-.055em; margin:0; } h3 { margin:8px 0 10px; font-size:21px; letter-spacing:-.025em; }
    p { color:var(--muted); line-height:1.68; font-weight:680; } .lead { font-size:20px; color:#334155; max-width:760px; }
    .pill { display:inline-flex; align-items:center; border:1px solid rgba(37,99,235,.22); background:rgba(255,255,255,.75); padding:9px 13px; border-radius:999px; color:#1d4ed8; font-size:12px; font-weight:950; letter-spacing:.08em; text-transform:uppercase; }
    .panel { background:rgba(255,255,255,.9); border:1px solid rgba(226,232,240,.9); border-radius:32px; padding:30px; box-shadow:0 30px 90px rgba(15,23,42,.1); } .dark { background:#0f172a; color:white; border-radius:32px; padding:30px; box-shadow:0 30px 90px rgba(15,23,42,.22); } .dark p { color:#cbd5e1; }
    .cta { display:flex; flex-wrap:wrap; gap:12px; margin-top:28px; } .btn { border-radius:18px; padding:16px 21px; font-size:15px; font-weight:950; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; } .primary { color:white; background:var(--accent); box-shadow:0 18px 40px rgba(37,99,235,.25); } .secondary { color:#0f172a; background:white; border:1px solid #dbe3ef; }
    .metrics { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; margin-top:24px; } .metric { border:1px solid rgba(226,232,240,.85); background:white; color:#0f172a; border-radius:22px; padding:18px; } .metric span, .card span { display:block; color:#64748b; font-size:11px; font-weight:950; letter-spacing:.14em; text-transform:uppercase; } .metric strong { display:block; margin-top:7px; font-size:24px; letter-spacing:-.03em; }
    .section { margin-top:30px; } .section-head { display:grid; grid-template-columns:.85fr 1.15fr; gap:24px; margin-bottom:22px; } .section-head p { margin:0; font-size:17px; }
    .grid3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; } .grid4 { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px; }
    .card { border:1px solid var(--line); background:white; border-radius:26px; padding:24px; box-shadow:0 16px 44px rgba(15,23,42,.06); } .card p { margin-bottom:0; }
    .tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; } .tags b { border-radius:999px; background:#f1f5f9; color:#475569; padding:7px 10px; font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
    .notice { border:1px solid #fed7aa; background:#fff7ed; color:#7c2d12; border-radius:24px; padding:20px; font-weight:760; line-height:1.65; } .signup { background:#0f172a; color:white; border-radius:32px; padding:30px; } .signup p { color:#cbd5e1; }
    footer { margin-top:40px; color:#64748b; font-size:13px; font-weight:700; }
    @media (max-width: 920px) { .hero, .section-head, .grid3, .grid4 { grid-template-columns:1fr; } .links { display:none; } .wrap { padding-top:16px; } .panel, .dark, .signup { padding:22px; border-radius:26px; } }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="nav">
      <div class="brand"><div class="mark">$</div><div>${safeText(settings.businessName)}<br><span style="color:#64748b;font-size:13px;">Private funding portal</span></div></div>
      <nav class="links"><a href="#offer">Offer</a><a href="#why">Why Now</a><a href="#model">Model</a><a href="#proof">Proof</a><a href="#market">Market</a><a href="#process">Process</a><a href="#signup">Signup</a></nav>
    </header>

    <section class="hero" id="offer">
      <div class="panel"><span class="pill">${safeText(settings.heroEyebrow)}</span><h1>${safeText(settings.portalHeadline)}</h1><p class="lead">${safeText(settings.portalSubtitle)}</p><div class="cta"><a class="btn primary" href="mailto:${safeText(settings.contactEmail)}?subject=${subject}&body=${body}">Request package / submit interest</a><a class="btn secondary" href="#process">Review process</a></div></div>
      <aside class="dark"><span class="pill">The offer</span><h2>What investors are reviewing</h2><p>${safeText(settings.opportunitySummary)}</p><div class="metrics"><div class="metric"><span>Funding goal</span><strong>${money(settings.fundingGoal)}</strong></div><div class="metric"><span>Minimum interest</span><strong>${money(settings.minimumInterest)}</strong></div><div class="metric"><span>Deadline</span><strong>${formatDate(settings.deadline)}</strong></div><div class="metric"><span>Round</span><strong>${safeText(settings.roundType)}</strong></div></div></aside>
    </section>

    <section class="section panel"><div class="section-head"><h2>What investors are buying into</h2><p>${safeText(settings.investmentThesis)}</p></div><div class="grid3"><article class="card"><span>Business</span><h3>${safeText(settings.businessName)}</h3><p>${safeText(settings.businessSummary)}</p></article><article class="card"><span>Use of funds</span><h3>Capital tied to milestones</h3><p>${safeText(settings.useOfFunds)}</p></article><article class="card"><span>Terms</span><h3>${safeText(settings.offerLabel)}</h3><p>${safeText(settings.termsSummary)}</p></article></div></section>
    <section class="section panel" id="why"><div class="section-head"><h2>${safeText(settings.whyNowTitle)}</h2><p>${safeText(settings.whyNowSummary)}</p></div><div class="grid3">${rowCardsHtml(whyCards)}</div></section>
    <section class="section panel" id="model"><div class="section-head"><h2>${safeText(settings.modelTitle)}</h2><p>${safeText(settings.modelSummary)}</p></div><div class="grid4">${rowCardsHtml(modelCards)}</div></section>
    <section class="section panel" id="proof"><div class="section-head"><h2>${safeText(settings.proofTitle)}</h2><p>${safeText(settings.proofSummary)}</p></div><div class="grid4">${rowCardsHtml(proofCards)}</div></section>
    <section class="section panel" id="market"><div class="section-head"><h2>${safeText(settings.marketTitle)}</h2><p>${safeText(settings.marketSummary)}</p></div><div class="grid4">${rowCardsHtml(marketCards)}</div></section>
    <section class="section panel" id="process"><div class="section-head"><h2>From interest to approved participation</h2><p>${safeText(settings.processSummary)}</p></div><div class="grid3">${rowCardsHtml(processCards)}</div></section>
    <section class="section notice"><strong>Important notice:</strong> ${safeText(settings.riskNotice)} ${safeText(settings.wireNotice)}</section>
    <section class="section signup" id="signup"><span class="pill">Investor signup</span><h2>Begin the private review</h2><p>Submit a non-binding indication of interest, request the package, and wait for owner review before any final documents or payment instructions.</p><div class="cta"><a class="btn primary" href="mailto:${safeText(settings.contactEmail)}?subject=${subject}&body=${body}">Request package / submit interest</a><a class="btn secondary" href="${safeText(settings.website)}">Visit company site</a></div><p><strong>${safeText(settings.founderName)}</strong><br>${safeText(settings.founderTitle)}<br>${safeText(settings.contactEmail)} · ${safeText(settings.contactPhone)}</p></section>
    <footer>Generated with MONIEZI Raise V1.3.1. This static portal is a presentation and interest-intake page. It should be reviewed by appropriate advisors before use for any financing transaction.</footer>
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
  <div class="brand">MONIEZI Raise V1.3.1 · Private Funding Package</div>
  <h1>${safeText(settings.businessName)} Funding Package</h1>
  <p>${safeText(settings.portalSubtitle)}</p>
  <div class="notice"><strong>Important:</strong> ${safeText(settings.riskNotice)}</div>
  <h2>Business Summary</h2><p>${safeText(settings.businessSummary)}</p>
  <h2>Investment Case</h2><p>${safeText(settings.investmentThesis)}</p>
  <h2>Opportunity Summary</h2><p>${safeText(settings.opportunitySummary)}</p>
  <h2>Funding Details</h2>
  <table>
    <tr><th>Legal name</th><td>${safeText(settings.legalName)}</td></tr>
    <tr><th>Founder / Owner</th><td>${safeText(settings.founderName)} · ${safeText(settings.founderTitle)}</td></tr>
    <tr><th>Template</th><td>${safeText(settings.offerLabel)}</td></tr>
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
  <p style="font-size:12px;color:#64748b;">Generated by MONIEZI Raise V1.3.1. This is a business workflow document, not legal advice or a final financing agreement.</p>
</section></main>
</body>
</html>`;
}

function MultilineEditor({ label, value, onChange, help }: { label: string; value: string; onChange: (value: string) => void; help?: string }) {
  return (
    <Field label={label}>
      <textarea className={`${inputBase} min-h-36 font-mono text-sm leading-6`} value={value} onChange={(e) => onChange(e.target.value)} />
      {help && <p className="mt-2 text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">{help}</p>}
    </Field>
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

  const applyTemplate = (template: TemplateKey) => {
    const next = template === 'emyrgen' ? emyrgenStyleTemplate : template === 'startup' ? startupTemplate : localTemplate;
    setState((prev) => ({ ...prev, settings: next }));
    setSavedMessage(template === 'emyrgen' ? 'EMYRGEN-style Investor Portal template applied.' : template === 'startup' ? 'Startup / SAFE template applied.' : 'Local Business Expansion template applied.');
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
    ['build', Settings, 'Build'],
    ['portal', Eye, 'Preview'],
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
              <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">V1.3.1 · Full Investor Portal Builder</p>
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
          <StatCard label="Template" value={settings.templateKey === 'emyrgen' ? 'Portal' : settings.raiseMode === 'startup' ? 'Startup' : 'Local'} icon={Globe2} />
        </section>

        {view === 'build' && (
          <div className="grid gap-6">
            <SectionCard title="Choose the investor portal template" eyebrow="Step 1 · The output the buyer is creating">
              <div className="grid gap-4 lg:grid-cols-3">
                <TemplateButton active={settings.templateKey === 'emyrgen'} title="EMYRGEN-style Investor Portal" subtitle="Full investor-portal structure: offer, why now, business model, proof, market, process, and signup. This is the strongest template for a serious private round." icon={Landmark} onClick={() => applyTemplate('emyrgen')} />
                <TemplateButton active={settings.templateKey === 'startup'} title="Startup / SAFE Raise" subtitle="For founders who need a private startup-style investor page, proposed SAFE terms, package request, and indication-of-interest flow." icon={Rocket} onClick={() => applyTemplate('startup')} />
                <TemplateButton active={settings.templateKey === 'local'} title="Local Business Expansion" subtitle="For contractors, service businesses, operators, and local companies raising for vehicles, equipment, crews, materials, or working capital." icon={BriefcaseBusiness} onClick={() => applyTemplate('local')} />
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

            <SectionCard title="Hero and offer" eyebrow="Step 3 · Top of the investor page">
              <div className="grid gap-4">
                <Field label="Hero eyebrow"><input className={inputBase} value={settings.heroEyebrow} onChange={(e) => updateSettings({ heroEyebrow: e.target.value })} /></Field>
                <Field label="Portal headline"><textarea className={`${inputBase} min-h-24`} value={settings.portalHeadline} onChange={(e) => updateSettings({ portalHeadline: e.target.value })} /></Field>
                <Field label="Portal subtitle"><textarea className={`${inputBase} min-h-28`} value={settings.portalSubtitle} onChange={(e) => updateSettings({ portalSubtitle: e.target.value })} /></Field>
                <Field label="Opportunity summary"><textarea className={`${inputBase} min-h-32`} value={settings.opportunitySummary} onChange={(e) => updateSettings({ opportunitySummary: e.target.value })} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Investor story" eyebrow="Step 4 · Substance investors need">
              <div className="grid gap-4">
                <Field label="Business summary"><textarea className={`${inputBase} min-h-32`} value={settings.businessSummary} onChange={(e) => updateSettings({ businessSummary: e.target.value })} /></Field>
                <Field label="Investment thesis"><textarea className={`${inputBase} min-h-32`} value={settings.investmentThesis} onChange={(e) => updateSettings({ investmentThesis: e.target.value })} /></Field>
                <Field label="Why now section title"><input className={inputBase} value={settings.whyNowTitle} onChange={(e) => updateSettings({ whyNowTitle: e.target.value })} /></Field>
                <Field label="Why now summary"><textarea className={`${inputBase} min-h-28`} value={settings.whyNowSummary} onChange={(e) => updateSettings({ whyNowSummary: e.target.value })} /></Field>
                <MultilineEditor label="Why now cards" value={settings.whyNowCards} onChange={(value) => updateSettings({ whyNowCards: value })} help="One card per line: Number | Title | Body | optional;tags" />
              </div>
            </SectionCard>

            <SectionCard title="Model, proof, and market" eyebrow="Step 5 · Make the page persuasive">
              <div className="grid gap-4">
                <Field label="Business model title"><input className={inputBase} value={settings.modelTitle} onChange={(e) => updateSettings({ modelTitle: e.target.value })} /></Field>
                <Field label="Business model summary"><textarea className={`${inputBase} min-h-28`} value={settings.modelSummary} onChange={(e) => updateSettings({ modelSummary: e.target.value })} /></Field>
                <MultilineEditor label="Business model cards" value={settings.modelCards} onChange={(value) => updateSettings({ modelCards: value })} />
                <Field label="Proof section title"><input className={inputBase} value={settings.proofTitle} onChange={(e) => updateSettings({ proofTitle: e.target.value })} /></Field>
                <Field label="Proof section summary"><textarea className={`${inputBase} min-h-28`} value={settings.proofSummary} onChange={(e) => updateSettings({ proofSummary: e.target.value })} /></Field>
                <MultilineEditor label="Proof cards" value={settings.proofCards} onChange={(value) => updateSettings({ proofCards: value })} />
                <Field label="Market title"><input className={inputBase} value={settings.marketTitle} onChange={(e) => updateSettings({ marketTitle: e.target.value })} /></Field>
                <Field label="Market summary"><textarea className={`${inputBase} min-h-28`} value={settings.marketSummary} onChange={(e) => updateSettings({ marketSummary: e.target.value })} /></Field>
                <MultilineEditor label="Market cards" value={settings.marketCards} onChange={(value) => updateSettings({ marketCards: value })} />
              </div>
            </SectionCard>

            <SectionCard title="Funding structure and process" eyebrow="Step 6 · Amounts, package, and next steps">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Funding goal"><input className={inputBase} inputMode="numeric" value={settings.fundingGoal} onChange={(e) => updateSettings({ fundingGoal: e.target.value })} /></Field>
                <Field label="Minimum interest"><input className={inputBase} inputMode="numeric" value={settings.minimumInterest} onChange={(e) => updateSettings({ minimumInterest: e.target.value })} /></Field>
                <Field label="Deadline"><input className={inputBase} type="date" value={settings.deadline} onChange={(e) => updateSettings({ deadline: e.target.value })} /></Field>
              </div>
              <div className="mt-4 grid gap-4">
                <Field label="Offer label"><input className={inputBase} value={settings.offerLabel} onChange={(e) => updateSettings({ offerLabel: e.target.value })} /></Field>
                <Field label="Round type"><input className={inputBase} value={settings.roundType} onChange={(e) => updateSettings({ roundType: e.target.value })} /></Field>
                <Field label="Use of funds"><textarea className={`${inputBase} min-h-28`} value={settings.useOfFunds} onChange={(e) => updateSettings({ useOfFunds: e.target.value })} /></Field>
                <Field label="Terms summary"><textarea className={`${inputBase} min-h-28`} value={settings.termsSummary} onChange={(e) => updateSettings({ termsSummary: e.target.value })} /></Field>
                <Field label="Who this is for"><textarea className={`${inputBase} min-h-24`} value={settings.audienceSummary} onChange={(e) => updateSettings({ audienceSummary: e.target.value })} /></Field>
                <Field label="Process summary"><textarea className={`${inputBase} min-h-24`} value={settings.processSummary} onChange={(e) => updateSettings({ processSummary: e.target.value })} /></Field>
                <MultilineEditor label="Process steps" value={settings.processSteps} onChange={(value) => updateSettings({ processSteps: value })} />
                <Field label="Package summary"><textarea className={`${inputBase} min-h-24`} value={settings.packageSummary} onChange={(e) => updateSettings({ packageSummary: e.target.value })} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Review notices" eyebrow="Step 7 · Safer wording">
              <div className="grid gap-4">
                <Field label="Risk / review notice"><textarea className={`${inputBase} min-h-28`} value={settings.riskNotice} onChange={(e) => updateSettings({ riskNotice: e.target.value })} /></Field>
                <Field label="Payment security notice"><textarea className={`${inputBase} min-h-24`} value={settings.wireNotice} onChange={(e) => updateSettings({ wireNotice: e.target.value })} /></Field>
              </div>
            </SectionCard>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setView('portal')} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-900/20 active:scale-95"><Eye className="h-4 w-4" /> Preview Investor Portal</button>
              <button onClick={exportPortal} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg active:scale-95 dark:bg-blue-500 dark:text-white"><Download className="h-4 w-4" /> Export Static Portal HTML</button>
              <button onClick={exportProfile} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Save className="h-4 w-4" /> Export Profile</button>
            </div>
          </div>
        )}

        {view === 'portal' && (
          <div className="grid gap-6">
            <SectionCard title="Generated investor/supporter portal" eyebrow="This is the real output the buyer can share or export">
              <PortalPreview settings={settings} onSignup={() => setView('signup')} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => setView('build')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Settings className="h-4 w-4" /> Edit Portal</button>
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
                <p className="text-sm font-bold leading-7 text-slate-700 dark:text-slate-200">The package is generated from the full portal builder fields. It gives the owner a clean file to send after a person asks for details.</p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <p><strong>Business:</strong> {settings.businessName}</p>
                  <p><strong>Template:</strong> {settings.offerLabel}</p>
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
            <SectionCard title="What changed in V1.3.1" eyebrow="Product direction">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50"><Globe2 className="mb-3 h-7 w-7 text-blue-600" /><h3 className="text-lg font-black text-slate-950 dark:text-white">Full Portal Output</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">Preview now renders a full investor/supporter portal, not a short summary card.</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50"><Landmark className="mb-3 h-7 w-7 text-blue-600" /><h3 className="text-lg font-black text-slate-950 dark:text-white">EMYRGEN-style Template</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">The first template follows a serious investor-portal structure: offer, why now, model, proof, market, process, signup.</p></div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50"><Download className="mb-3 h-7 w-7 text-blue-600" /><h3 className="text-lg font-black text-slate-950 dark:text-white">Exportable Page</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">The exported static HTML now matches the richer portal structure.</p></div>
              </div>
            </SectionCard>
            <SectionCard title="Recommended buyer workflow" eyebrow="How the owner uses it">
              <ol className="space-y-3 text-base font-bold leading-7 text-slate-700 dark:text-slate-200">
                <li>1. Choose the EMYRGEN-style Investor Portal template for a serious private raise, or use Startup / Local Business for simpler markets.</li>
                <li>2. Enter the business identity, founder details, headline, offer, investment thesis, why-now story, proof, market logic, use of funds, terms, and process.</li>
                <li>3. Open Preview and review the full investor portal as a visitor would see it.</li>
                <li>4. Export the static portal HTML and upload it to GitHub Pages, Cloudflare Pages, Netlify, or the owner website.</li>
                <li>5. Share the link with selected private contacts and collect non-binding indications of interest.</li>
                <li>6. Export leads or move serious records into MONIEZI Pro Finance for owner-side tracking.</li>
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
              <span className="mt-1 block leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
