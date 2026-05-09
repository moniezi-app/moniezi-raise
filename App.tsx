import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Images,
  Landmark,
  Mail,
  PenLine,
  Rocket,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
  Video,
  X,
} from 'lucide-react';

type BuilderView = 'build' | 'preview' | 'export';
type TemplateKey = 'premium' | 'startup' | 'local';

interface PortalSettings {
  templateKey: TemplateKey;
  companyName: string;
  legalName: string;
  founderName: string;
  founderTitle: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  location: string;
  portalEyebrow: string;
  headline: string;
  subheadline: string;
  raiseLabel: string;
  roundType: string;
  fundingGoal: string;
  minimumInterest: string;
  deadline: string;
  primaryCta: string;
  secondaryCta: string;
  businessOverview: string;
  investorThesis: string;
  whyNow: string;
  businessModel: string;
  proofPoints: string;
  useOfFunds: string;
  marketOpportunity: string;
  termsSummary: string;
  investorProcess: string;
  agreementTitle: string;
  agreementSummary: string;
  riskNotice: string;
  logoDataUrl: string;
  heroImageDataUrl: string;
  companyImagesDataUrls: string[];
  opportunityImagesDataUrls: string[];
  proofImagesDataUrls: string[];
  fundsImagesDataUrls: string[];
  processImagesDataUrls: string[];
  companyVideosDataUrls: string[];
  opportunityVideosDataUrls: string[];
  proofVideosDataUrls: string[];
  fundsVideosDataUrls: string[];
  processVideosDataUrls: string[];
  agreementFileName: string;
  agreementDataUrl: string;
}

const STORAGE_KEY = 'moniezi-raise-v1-5-5-premium-section-builder-state';

const baseTemplate: PortalSettings = {
  templateKey: 'premium',
  companyName: 'Apex Growth Systems',
  legalName: 'Apex Growth Systems, Inc.',
  founderName: 'Alex Founder',
  founderTitle: 'Founder & CEO',
  contactEmail: 'founder@example.com',
  contactPhone: '(555) 014-2026',
  website: 'https://example.com',
  location: 'United States',
  portalEyebrow: 'Private funding portal for selected investors',
  headline: 'A focused private round for a company ready to move from build stage to market execution',
  subheadline:
    'Review the business story, investment case, use of funds, owner process, and next step before submitting a non-binding indication of interest.',
  raiseLabel: 'Private founder round',
  roundType: 'Private investment / advisor-reviewed documents',
  fundingGoal: '250000',
  minimumInterest: '5000',
  deadline: '2026-06-30',
  primaryCta: 'Submit investor interest',
  secondaryCta: 'Download investor document',
  businessOverview:
    'Apex Growth Systems is building a practical business platform for a specific customer group that needs a clearer, more professional way to solve a costly operating problem. The company is moving from founder-led development into a repeatable commercial launch plan.',
  investorThesis:
    'The investment case is based on a focused product direction, a defined customer problem, founder-led execution, and a funding plan tied to specific commercial milestones rather than vague growth claims.',
  whyNow:
    'The timing matters because customers are already looking for simpler solutions, the founder has completed the early groundwork, and the next stage requires capital for product completion, customer acquisition, professional materials, and launch execution.',
  businessModel:
    'The business expects to earn revenue through product sales, service packages, setup fees, subscriptions, licensing, support, or repeat customer relationships. The portal should explain the first revenue path and why that path is realistic.',
  proofPoints:
    'Early product work completed. Customer conversations started. Founder has relevant operating experience. Launch plan and use of funds are defined. Investor package and next-step process are organized for review.',
  useOfFunds:
    'Product completion, customer acquisition, launch materials, working capital, professional fees, operating systems, and the first commercial rollout milestones.',
  marketOpportunity:
    'The opportunity is strongest when the company names a specific customer segment, explains the painful problem those customers already understand, and shows why existing alternatives are too expensive, too complicated, too slow, or too generic.',
  termsSummary:
    'Proposed participation may be structured through a SAFE, convertible note, private investment agreement, business loan, revenue-share, profit-share, or another advisor-approved document. Final terms are subject to company review and signed documentation.',
  investorProcess:
    'Review the portal. Download or request the investor document. Submit a non-binding indication of interest. Speak with the owner. Review final documents. Verify payment instructions directly. Proceed only after written approval and cleared funds.',
  agreementTitle: 'Investor / supporter agreement document',
  agreementSummary:
    'Upload the fillable agreement, SAFE, term sheet, private funding document, or supporter agreement that investors should download for review. If no document is uploaded yet, the portal can direct investors to request it by email.',
  riskNotice:
    'This page collects non-binding indications of interest only. It is not a public offering, does not guarantee acceptance, and does not complete any investment, loan, or revenue-share arrangement. Final participation requires owner approval, final documents, payment confirmation, and compliance with applicable rules.',
  logoDataUrl: '',
  heroImageDataUrl: '',
  companyImagesDataUrls: [],
  opportunityImagesDataUrls: [],
  proofImagesDataUrls: [],
  fundsImagesDataUrls: [],
  processImagesDataUrls: [],
  companyVideosDataUrls: [],
  opportunityVideosDataUrls: [],
  proofVideosDataUrls: [],
  fundsVideosDataUrls: [],
  processVideosDataUrls: [],
  agreementFileName: '',
  agreementDataUrl: '',
};

const startupTemplate: PortalSettings = {
  ...baseTemplate,
  templateKey: 'startup',
  companyName: 'Acme Founder Labs',
  legalName: 'Acme Founder Labs, Inc.',
  portalEyebrow: 'Private startup round for selected investors',
  headline: 'A private startup round for investors who want to review the company before the next launch milestone',
  raiseLabel: 'Startup / SAFE-style round',
  roundType: 'SAFE or convertible-style documents',
  businessOverview:
    'Acme Founder Labs is building a focused software product for small operators who need clearer records, stronger workflows, and a simpler path from daily business activity to funding readiness.',
  investorThesis:
    'The thesis is that small operators need practical software that makes them look organized, keeps records under control, and helps them prepare for growth without jumping into expensive enterprise systems.',
  whyNow:
    'The product direction is defined, the customer problem is clear, and the next milestone is commercial execution: product polish, customer acquisition, launch materials, and early customer conversion.',
  businessModel:
    'Revenue may come from direct digital-product sales, early-access packages, setup support, templates, licensing, subscriptions, or future hosted services once customer demand is validated.',
  proofPoints:
    'Working product version completed. Target customer defined. Early sales channels identified. Launch package and founder toolkit strategy prepared. Next milestone is customer validation and first revenue.',
};

const localTemplate: PortalSettings = {
  ...baseTemplate,
  templateKey: 'local',
  companyName: 'Northside Roofing & Repair',
  legalName: 'Northside Roofing & Repair LLC',
  founderName: 'Jordan Owner',
  founderTitle: 'Owner',
  contactEmail: 'owner@example.com',
  contactPhone: '(555) 015-7700',
  location: 'New Jersey',
  portalEyebrow: 'Private local-business expansion portal',
  headline: 'A local business expansion raise tied to equipment, crew capacity, materials, and signed work',
  subheadline:
    'Review the business, what the money is for, how expansion may increase operating capacity, and the owner review process before submitting interest.',
  raiseLabel: 'Local business expansion raise',
  roundType: 'Private business loan, revenue-share, profit-share, or advisor-reviewed agreement',
  fundingGoal: '75000',
  minimumInterest: '2500',
  deadline: '2026-07-31',
  businessOverview:
    'Northside Roofing & Repair is a local service business serving residential and small commercial customers. The owner is organizing private interest to expand capacity and complete more scheduled work.',
  investorThesis:
    'The funding case is practical: more equipment, better materials access, stronger crew capacity, and improved ability to complete revenue-producing jobs.',
  whyNow:
    'The business has local demand, a clear operating bottleneck, and a direct use for capital. Funding can support capacity rather than vague overhead.',
  businessModel:
    'The business earns revenue by completing service jobs for customers. Additional vehicles, tools, materials, crew support, and working capital may help the owner accept and complete more work.',
  proofPoints:
    'Completed jobs, repeat customers, referrals, owner trade experience, supplier relationships, equipment needs, and visible local demand can be presented as proof of readiness.',
  useOfFunds:
    'Work truck deposit or lease support, tools, safety equipment, materials for scheduled jobs, short-term working capital, subcontractor support, and customer acquisition.',
  marketOpportunity:
    'Local customers need reliable service providers. The opportunity is based on service-area demand, owner reputation, job capacity, and the ability to complete more paid work when operating bottlenecks are reduced.',
};

const templates: Array<{ key: TemplateKey; title: string; body: string; icon: React.ElementType; settings: PortalSettings }> = [
  {
    key: 'premium',
    title: 'Premium Investor Portal',
    body: 'Best for a polished private investor page with a serious company story, use of funds, proof, process, and agreement download.',
    icon: Landmark,
    settings: baseTemplate,
  },
  {
    key: 'startup',
    title: 'Startup / SAFE Portal',
    body: 'Best for early-stage founders preparing a private startup round, SAFE-style package, investor review, and founder-led process.',
    icon: Rocket,
    settings: startupTemplate,
  },
  {
    key: 'local',
    title: 'Local Business Expansion Portal',
    body: 'Best for contractors, service businesses, local operators, and owners raising for equipment, vehicles, crews, materials, or working capital.',
    icon: Building2,
    settings: localTemplate,
  },
];

type ImageCollectionKey =
  | 'companyImagesDataUrls'
  | 'opportunityImagesDataUrls'
  | 'proofImagesDataUrls'
  | 'fundsImagesDataUrls'
  | 'processImagesDataUrls';

const imageCollectionMax = 3;

type VideoCollectionKey =
  | 'companyVideosDataUrls'
  | 'opportunityVideosDataUrls'
  | 'proofVideosDataUrls'
  | 'fundsVideosDataUrls'
  | 'processVideosDataUrls';

const videoCollectionMax = 3;

const money = (value: string | number) => {
  const numeric = typeof value === 'number' ? value : Number(String(value || '').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numeric)) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(numeric);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return 'Not set';
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
  String(value || 'moniezi-raise')
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function readImageFiles(files: FileList | File[]): Promise<string[]> {
  const picked = Array.from(files).filter((file) => file.type.startsWith('image/')).slice(0, imageCollectionMax);
  return Promise.all(picked.map(readFileAsDataUrl));
}

async function readVideoFiles(files: FileList | File[]): Promise<string[]> {
  const picked = Array.from(files).filter((file) => file.type.startsWith('video/')).slice(0, videoCollectionMax);
  return Promise.all(picked.map(readFileAsDataUrl));
}

function loadSettings(): PortalSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseTemplate;
    return { ...baseTemplate, ...(JSON.parse(raw) as Partial<PortalSettings>) };
  } catch {
    return baseTemplate;
  }
}

function LogoMark({ settings, large = false }: { settings: PortalSettings; large?: boolean }) {
  const size = large ? 'h-16 w-16 rounded-[1.45rem]' : 'h-12 w-12 rounded-2xl';
  if (settings.logoDataUrl) {
    return <img src={settings.logoDataUrl} alt={`${settings.companyName} logo`} className={`${size} object-cover shadow-2xl shadow-blue-950/20`} />;
  }
  return (
    <div className={`${size} grid place-items-center bg-gradient-to-br from-blue-500 via-indigo-600 to-slate-950 shadow-2xl shadow-blue-950/20`}>
      <Landmark className={large ? 'h-9 w-9 text-white' : 'h-6 w-6 text-white'} />
    </div>
  );
}

function Guidance({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-blue-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.24),_transparent_38%),linear-gradient(135deg,#eff6ff,#ffffff)] p-5 shadow-xl shadow-blue-950/10 dark:border-blue-300/20 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.34),_transparent_40%),linear-gradient(135deg,#0f172a,#020617)] dark:shadow-black/30">
      <p className="inline-flex rounded-full border border-blue-300/60 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 dark:border-blue-300/20 dark:bg-blue-300/10 dark:text-blue-100">Builder guidance</p>
      <h4 className="mt-4 text-xl font-semibold leading-[1.32] tracking-[-0.035em] text-slate-950 dark:text-white">{title}</h4>
      <ul className="mt-5 grid gap-4 text-sm font-medium leading-[2.05] text-slate-700 dark:text-slate-200">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <CheckCircle2 className="mt-1.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-[2rem] border border-slate-200/90 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/25">
      <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 dark:border-blue-300/20 dark:bg-blue-400/10 dark:text-blue-200">{label}</span>
      {hint && <span className="mt-4 block text-sm font-medium leading-[2.05] text-slate-600 dark:text-slate-300">{hint}</span>}
      <div className="mt-4">{children}</div>
    </label>
  );
}

function BuilderSection({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="w-full overflow-hidden border-y border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
      <div className="w-full bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,.34),_transparent_42%),linear-gradient(135deg,#020617_0%,#0f172a_58%,#1e3a8a_100%)] px-5 py-9 text-white sm:px-8 lg:px-10">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-blue-200/30 bg-white/10 text-sm font-semibold text-blue-50 shadow-2xl shadow-blue-950/30 backdrop-blur">
            {number}
          </div>
          <div className="min-w-0">
            <p className="inline-flex rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-blue-100">Portal builder</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.22] tracking-[-0.045em] text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-base font-medium leading-[2.05] text-slate-200">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="w-full bg-[linear-gradient(180deg,#f8fafc,#eef4ff)] px-5 py-8 dark:bg-[linear-gradient(180deg,#020617,#0f172a)] sm:px-8 lg:px-10">
        <div className="grid gap-8">{children}</div>
      </div>
    </section>
  );
}

function TemplateButton({ template, active, onClick }: { template: (typeof templates)[number]; active: boolean; onClick: () => void }) {
  const Icon = template.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[2rem] border p-5 text-left shadow-xl transition active:scale-[0.99] ${
        active
          ? 'border-blue-500 bg-blue-50 text-slate-950 shadow-blue-900/10 dark:border-blue-300 dark:bg-blue-500/15 dark:text-white'
          : 'border-slate-200 bg-white text-slate-950 shadow-slate-200/70 hover:border-blue-300 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:shadow-black/20'
      }`}
    >
      <div className="flex gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{template.title}</h3>
          <p className="mt-2 text-sm font-medium leading-9 text-slate-600 dark:text-slate-300">{template.body}</p>
        </div>
      </div>
    </button>
  );
}

const inputClass =
  'w-full rounded-[1.45rem] border border-slate-200 bg-white/95 px-4 py-4 text-base font-medium leading-[1.7] text-slate-950 shadow-inner shadow-slate-200/50 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-900/90 dark:text-white dark:shadow-black/20 dark:focus:ring-blue-500/20';
const textAreaClass = `${inputClass} min-h-48 leading-[2.05]`;

function UploadBox({ title, subtitle, fileName, accept, onFile }: { title: string; subtitle: string; fileName?: string; accept: string; onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="rounded-[2rem] border border-dashed border-blue-300/80 bg-[linear-gradient(135deg,#f8fafc,#eff6ff)] p-5 shadow-xl shadow-blue-950/10 dark:border-blue-300/20 dark:bg-[linear-gradient(135deg,#0f172a,#020617)] dark:shadow-black/25">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/25 dark:bg-blue-500 dark:text-white">
          <Upload className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xl font-semibold leading-[1.35] tracking-[-0.035em] text-slate-950 dark:text-white">{title}</h4>
          <p className="mt-3 text-sm font-medium leading-[2.05] text-slate-600 dark:text-slate-300">{subtitle}</p>
          {fileName && <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">Selected: {fileName}</p>}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-5 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 active:scale-95 dark:bg-blue-500"
          >
            Choose file
          </button>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept={accept}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFile(file);
              event.currentTarget.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ImageUploadGroup({
  title,
  subtitle,
  images,
  onAdd,
  onRemove,
  onClear,
}: {
  title: string;
  subtitle: string;
  images: string[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="rounded-[2rem] border border-blue-100 bg-[linear-gradient(135deg,#ffffff,#eff6ff)] p-5 shadow-xl shadow-blue-950/10 dark:border-blue-300/15 dark:bg-[linear-gradient(135deg,#0f172a,#020617)] dark:shadow-black/25">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 dark:bg-blue-500">
          <Images className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xl font-semibold leading-[1.35] tracking-[-0.035em] text-slate-950 dark:text-white">{title}</h4>
          <p className="mt-4 text-sm font-medium leading-[2.05] text-slate-600 dark:text-slate-300">{subtitle}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.13em] text-blue-600 dark:text-blue-300">{images.length}/{imageCollectionMax} images selected</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <Upload className="h-4 w-4" /> Add images
            </button>
            {images.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                Clear section images
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              if (event.target.files?.length) onAdd(event.target.files);
              event.currentTarget.value = '';
            }}
          />
          {images.length > 0 && (
            <div className="mt-5 grid gap-4">
              {images.map((src, index) => (
                <div key={`${src.slice(0, 32)}-${index}`} className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                  <img src={src} alt={`${title} ${index + 1}`} className="h-44 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-slate-950/80 text-white backdrop-blur active:scale-95"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function VideoUploadGroup({
  title,
  subtitle,
  videos,
  onAdd,
  onRemove,
  onClear,
}: {
  title: string;
  subtitle: string;
  videos: string[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="rounded-[2rem] border border-blue-100 bg-[linear-gradient(135deg,#ffffff,#eff6ff)] p-5 shadow-xl shadow-blue-950/10 dark:border-blue-300/15 dark:bg-[linear-gradient(135deg,#0f172a,#020617)] dark:shadow-black/25">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 dark:bg-indigo-500">
          <Video className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xl font-semibold leading-[1.35] tracking-[-0.035em] text-slate-950 dark:text-white">{title}</h4>
          <p className="mt-4 text-sm font-medium leading-[2.05] text-slate-600 dark:text-slate-300">{subtitle}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-300">{videos.length}/{videoCollectionMax} videos selected</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/20 active:scale-95"
            >
              <Upload className="h-4 w-4" /> Add videos
            </button>
            {videos.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                Clear section videos
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            multiple
            onChange={(event) => {
              if (event.target.files?.length) onAdd(event.target.files);
              event.currentTarget.value = '';
            }}
          />
          {videos.length > 0 && (
            <div className="mt-5 grid gap-4">
              {videos.map((src, index) => (
                <div key={`${src.slice(0, 32)}-${index}`} className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 dark:border-white/10">
                  <video src={src} className="h-52 w-full object-cover" controls muted playsInline preload="metadata" />
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-slate-950/80 text-white backdrop-blur active:scale-95"
                    aria-label="Remove video"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <p className="bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-slate-600 dark:bg-white/10 dark:text-slate-200">Video {index + 1}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PortalImageGallery({ images, label }: { images: string[]; label: string }) {
  if (!images.length) return null;
  return (
    <div className="mt-7 grid gap-4">
      {images.map((src, index) => (
        <figure key={`${label}-${index}`} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <img src={src} alt={`${label} ${index + 1}`} className="h-64 w-full object-cover sm:h-80" />
          <figcaption className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-300">{label} · Image {index + 1}</figcaption>
        </figure>
      ))}
    </div>
  );
}


function PortalVideoGallery({ videos, label }: { videos: string[]; label: string }) {
  if (!videos.length) return null;
  return (
    <div className="mt-7 grid gap-4">
      {videos.map((src, index) => (
        <figure key={`${label}-video-${index}`} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-black dark:shadow-black/20">
          <video src={src} className="h-64 w-full object-cover sm:h-80" controls muted playsInline preload="metadata" />
          <figcaption className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-300">{label} · Video {index + 1}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function buildGalleryHtml(images: string[], label: string) {
  if (!images.length) return '';
  return `<div class="gallery">${images
    .map((src, index) => `<figure><img src="${src}" alt="${safeText(label)} ${index + 1}"/><figcaption>${safeText(label)} · Image ${index + 1}</figcaption></figure>`)
    .join('')}</div>`;
}


function buildVideoGalleryHtml(videos: string[], label: string) {
  if (!videos.length) return '';
  return `<div class="gallery videoGallery">${videos
    .map((src, index) => `<figure><video src="${src}" controls muted playsinline preload="metadata"></video><figcaption>${safeText(label)} · Video ${index + 1}</figcaption></figure>`)
    .join('')}</div>`;
}

function PortalCard({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <article className="rounded-[2rem] border border-blue-100 bg-[linear-gradient(135deg,#ffffff,#f8fbff)] p-5 shadow-xl shadow-blue-950/10 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">{eyebrow}</p>
      <h3 className="mt-4 text-2xl font-semibold leading-[1.35] tracking-[-0.035em] text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-5 text-base font-medium leading-[2.05] text-slate-600 dark:text-slate-200">{body}</p>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-200">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function PortalSection({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children?: React.ReactNode }) {
  return (
    <section className="w-full border-y border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-11 dark:border-white/10 dark:bg-slate-900 sm:px-8 lg:px-10">
      <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 dark:border-blue-300/20 dark:bg-blue-400/10 dark:text-blue-200">{eyebrow}</p>
      <h2 className="mt-5 text-4xl font-semibold leading-[1.18] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-5xl">{title}</h2>
      <p className="mt-6 text-base font-medium leading-[2.05] text-slate-600 dark:text-slate-200">{body}</p>
      {children && <div className="mt-7">{children}</div>}
    </section>
  );
}

function InvestorPortal({ settings, standalone = false }: { settings: PortalSettings; standalone?: boolean }) {
  return (
    <div className="w-full overflow-hidden bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <LogoMark settings={settings} />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{settings.companyName}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Private investor portal</p>
          </div>
        </div>
      </header>

      <section className="relative w-full overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.40),_transparent_36%),linear-gradient(135deg,#020617_0%,#0f172a_54%,#172554_100%)] px-5 py-10 sm:px-8 lg:px-10">
        {settings.heroImageDataUrl && <img src={settings.heroImageDataUrl} alt="Company visual" className="mb-7 h-56 w-full rounded-[2rem] object-cover shadow-2xl shadow-black/30" />}
        <p className="inline-flex rounded-full border border-blue-300/25 bg-blue-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">{settings.portalEyebrow}</p>
        <h1 className="mt-6 text-5xl font-semibold leading-[1.12] tracking-[-0.065em] sm:text-7xl lg:text-8xl">{settings.headline}</h1>
        <p className="mt-7 text-lg font-medium leading-[2.05] text-slate-200 sm:text-xl">{settings.subheadline}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#investor-interest" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-blue-950/30">
            {settings.primaryCta} <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={settings.agreementDataUrl || `mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Request investor document for ${settings.companyName}`)}`}
            download={settings.agreementDataUrl ? settings.agreementFileName || `${slugify(settings.companyName)}-agreement` : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-semibold text-white"
          >
            {settings.secondaryCta} <Download className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-8 grid gap-3">
          <Metric label="Funding goal" value={money(settings.fundingGoal)} />
          <Metric label="Minimum interest" value={money(settings.minimumInterest)} />
          <Metric label="Deadline" value={formatDate(settings.deadline)} />
          <Metric label="Round type" value={settings.raiseLabel} />
        </div>
      </section>

      <PortalSection eyebrow="The company" title="Business overview" body={settings.businessOverview}>
        <PortalImageGallery images={settings.companyImagesDataUrls} label="Company story" />
        <PortalVideoGallery videos={settings.companyVideosDataUrls} label="Company story" />
        <div className="mt-7 grid gap-4">
          <PortalCard eyebrow="Investment case" title="Why this opportunity deserves review" body={settings.investorThesis} />
          <PortalCard eyebrow="Business model" title="How the company expects to create revenue" body={settings.businessModel} />
        </div>
      </PortalSection>

      <PortalSection eyebrow="Why now" title="The timing and funding window" body={settings.whyNow}>
        <PortalImageGallery images={settings.opportunityImagesDataUrls} label="Opportunity visuals" />
        <PortalVideoGallery videos={settings.opportunityVideosDataUrls} label="Opportunity visuals" />
        <div className="mt-7">
          <PortalImageGallery images={settings.fundsImagesDataUrls} label="Use-of-funds visuals" />
          <PortalVideoGallery videos={settings.fundsVideosDataUrls} label="Use-of-funds visuals" />
        </div>
        <PortalCard eyebrow="Use of funds" title="Capital tied to specific execution needs" body={settings.useOfFunds} />
      </PortalSection>

      <PortalSection eyebrow="Proof" title="Evidence, readiness, and credibility" body={settings.proofPoints}>
        <PortalImageGallery images={settings.proofImagesDataUrls} label="Proof and readiness" />
        <PortalVideoGallery videos={settings.proofVideosDataUrls} label="Proof and readiness" />
        <PortalCard eyebrow="Market opportunity" title="The customer problem and revenue logic" body={settings.marketOpportunity} />
      </PortalSection>

      <PortalSection eyebrow="Terms" title="Proposed participation structure" body={settings.termsSummary}>
        <PortalImageGallery images={settings.processImagesDataUrls} label="Process and review assets" />
        <PortalVideoGallery videos={settings.processVideosDataUrls} label="Process and review assets" />
        <PortalCard eyebrow="Process" title="From interest to approved participation" body={settings.investorProcess} />
      </PortalSection>

      <section id="investor-interest" className="w-full border-y border-white/10 bg-slate-950 px-5 py-12 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Investor interest</p>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.18] tracking-[-0.055em] text-white sm:text-5xl">Begin the private review</h2>
        <p className="mt-6 text-base font-medium leading-[2.05] text-slate-300">
          Submit your name, contact details, proposed interest amount, and questions. This is a non-binding indication of interest for owner review only.
        </p>
        <form className="mt-7 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <input className="rounded-2xl border border-white/10 bg-white px-4 py-4 text-base font-medium text-slate-950" placeholder="Full name" />
          <input className="rounded-2xl border border-white/10 bg-white px-4 py-4 text-base font-medium text-slate-950" placeholder="Email" />
          <input className="rounded-2xl border border-white/10 bg-white px-4 py-4 text-base font-medium text-slate-950" placeholder="Phone" />
          <input className="rounded-2xl border border-white/10 bg-white px-4 py-4 text-base font-medium text-slate-950" placeholder="Proposed amount" />
          <textarea className="min-h-32 rounded-2xl border border-white/10 bg-white px-4 py-4 text-base font-medium text-slate-950" placeholder="Message or questions" />
          <a href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Investor interest in ${settings.companyName}`)}&body=${encodeURIComponent('Name:\nEmail:\nPhone:\nProposed amount:\nMessage:\n')}`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-blue-950/30">
            Submit by email <Mail className="h-4 w-4" />
          </a>
        </form>
      </section>

      <section className="w-full bg-amber-50 px-5 py-9 text-amber-950 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">Important review notice</p>
        <p className="mt-4 text-sm font-medium leading-[2.05]">{settings.riskNotice}</p>
      </section>

      <footer className="w-full bg-slate-950 px-5 py-8 text-sm font-medium leading-[2.05] text-slate-400 sm:px-8 lg:px-10">
        <p>{settings.legalName} · {settings.location}</p>
        <p>{settings.contactEmail} · {settings.contactPhone} {settings.website ? `· ${settings.website}` : ''}</p>
      </footer>
    </div>
  );
}

function buildPortalHtml(settings: PortalSettings) {
  const agreementHref = settings.agreementDataUrl || `mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Request investor document for ${settings.companyName}`)}`;
  const agreementDownload = settings.agreementDataUrl ? ` download="${safeText(settings.agreementFileName || `${slugify(settings.companyName)}-agreement`)}"` : '';
  const heroImage = settings.heroImageDataUrl ? `<img class="heroImage" src="${settings.heroImageDataUrl}" alt="Company visual" />` : '';
  const companyGallery = buildGalleryHtml(settings.companyImagesDataUrls || [], 'Company story');
  const opportunityGallery = buildGalleryHtml(settings.opportunityImagesDataUrls || [], 'Opportunity visuals');
  const proofGallery = buildGalleryHtml(settings.proofImagesDataUrls || [], 'Proof and readiness');
  const fundsGallery = buildGalleryHtml(settings.fundsImagesDataUrls || [], 'Use-of-funds visuals');
  const processGallery = buildGalleryHtml(settings.processImagesDataUrls || [], 'Process and review assets');
  const companyVideos = buildVideoGalleryHtml(settings.companyVideosDataUrls || [], 'Company story');
  const opportunityVideos = buildVideoGalleryHtml(settings.opportunityVideosDataUrls || [], 'Opportunity visuals');
  const proofVideos = buildVideoGalleryHtml(settings.proofVideosDataUrls || [], 'Proof and readiness');
  const fundsVideos = buildVideoGalleryHtml(settings.fundsVideosDataUrls || [], 'Use-of-funds visuals');
  const processVideos = buildVideoGalleryHtml(settings.processVideosDataUrls || [], 'Process and review assets');
  const logo = settings.logoDataUrl ? `<img class="logo" src="${settings.logoDataUrl}" alt="${safeText(settings.companyName)} logo" />` : '<div class="logoMark">◆</div>';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${safeText(settings.companyName)} Private Investor Portal</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap');
*{box-sizing:border-box} html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%} body{margin:0;font-family:Manrope,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#020617;color:white;font-weight:500;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility} a{text-decoration:none}h1,h2,h3,.brand strong{font-family:Sora,Manrope,ui-sans-serif,system-ui,sans-serif;font-weight:650}.top{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:14px;padding:16px 20px;background:rgba(2,6,23,.92);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.1)}.logo,.logoMark{width:50px;height:50px;border-radius:18px;object-fit:cover}.logoMark{display:grid;place-items:center;background:linear-gradient(135deg,#3b82f6,#1e1b4b);box-shadow:0 18px 45px rgba(37,99,235,.28)}.brand strong{display:block;font-size:18px;letter-spacing:-.025em}.brand span{display:block;margin-top:4px;color:#bfdbfe;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.17em}.hero{padding:42px 20px;background:radial-gradient(circle at top left,rgba(59,130,246,.42),transparent 35%),linear-gradient(135deg,#020617,#0f172a 56%,#172554);border-bottom:1px solid rgba(255,255,255,.1)}.heroImage{width:100%;height:230px;object-fit:cover;border-radius:32px;margin-bottom:28px;box-shadow:0 26px 70px rgba(0,0,0,.38)}.eyebrow{display:inline-flex;border:1px solid rgba(147,197,253,.28);background:rgba(147,197,253,.1);border-radius:999px;padding:9px 14px;color:#dbeafe;font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.16em}h1{margin:22px 0 0;font-size:clamp(42px,11vw,84px);line-height:1.02;letter-spacing:-.065em}h2{margin:0;font-size:clamp(34px,8.5vw,58px);line-height:1.08;letter-spacing:-.05em}.lead{margin-top:24px;color:#dbeafe;font-size:18px;font-weight:500;line-height:1.95}.cta{display:grid;gap:12px;margin-top:30px}.btn{display:flex;justify-content:center;align-items:center;border-radius:20px;padding:17px 20px;font-size:14px;font-weight:650;letter-spacing:-.01em}.primary{background:#3b82f6;color:white;box-shadow:0 20px 46px rgba(30,64,175,.36)}.secondary{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);color:white}.metrics{display:grid;gap:12px;margin-top:30px}.metric{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);border-radius:24px;padding:18px}.metric span,.card span{display:block;color:#bfdbfe;font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.16em}.metric strong{display:block;margin-top:8px;font-family:Sora,Manrope,sans-serif;font-size:25px;font-weight:600;letter-spacing:-.035em}.section{padding:38px 20px;background:#fff;color:#0f172a;border-bottom:1px solid #e2e8f0}.section.dark{background:#0f172a;color:white;border-color:rgba(255,255,255,.1)}.section.dark p{color:#cbd5e1}.section p{color:#475569;font-size:16px;font-weight:500;line-height:2}.card{margin-top:18px;border:1px solid #e2e8f0;background:white;border-radius:30px;padding:22px;box-shadow:0 20px 55px rgba(15,23,42,.08)}.dark .card{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.05);box-shadow:none}.card h3{margin:10px 0 0;font-size:24px;line-height:1.22;letter-spacing:-.035em}.card p{margin-top:18px}.gallery{display:grid;gap:18px;margin-top:26px}.gallery figure{margin:0;overflow:hidden;border:1px solid #e2e8f0;background:#f8fafc;border-radius:32px;box-shadow:0 20px 55px rgba(15,23,42,.08)}.gallery img{display:block;width:100%;height:270px;object-fit:cover}.gallery video{display:block;width:100%;height:270px;object-fit:cover;background:#020617}.gallery figcaption{padding:15px 18px;color:#475569;font-size:11px;font-weight:650;text-transform:uppercase;letter-spacing:.13em}.dark .gallery figure{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.05);box-shadow:none}.interest{padding:40px 20px;background:#020617;border-top:1px solid rgba(255,255,255,.1)}.interest p{color:#cbd5e1;font-size:16px;font-weight:500;line-height:1.95}.form{display:grid;gap:14px;margin-top:24px;padding:20px;border-radius:30px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05)}input,textarea{width:100%;border:0;border-radius:18px;padding:16px;font-family:Manrope,system-ui,sans-serif;font-size:16px;font-weight:500;color:#0f172a}textarea{min-height:130px}.notice{padding:28px 20px;background:#fffbeb;color:#78350f}.notice p{font-weight:500;line-height:2}.foot{padding:28px 20px;background:#020617;color:#94a3b8;font-weight:500;line-height:1.95}@media(min-width:900px){.top,.hero,.section,.interest,.notice,.foot{padding-left:42px;padding-right:42px}.cta{display:flex;flex-wrap:wrap}.metrics{grid-template-columns:1fr}.heroImage{height:420px}}
</style>
</head>
<body>
<header class="top">${logo}<div class="brand"><strong>${safeText(settings.companyName)}</strong><span>Private investor portal</span></div></header>
<section class="hero">${heroImage}<span class="eyebrow">${safeText(settings.portalEyebrow)}</span><h1>${safeText(settings.headline)}</h1><p class="lead">${safeText(settings.subheadline)}</p><div class="cta"><a class="btn primary" href="#investor-interest">${safeText(settings.primaryCta)}</a><a class="btn secondary" href="${agreementHref}"${agreementDownload}>${safeText(settings.secondaryCta)}</a></div><div class="metrics"><div class="metric"><span>Funding goal</span><strong>${money(settings.fundingGoal)}</strong></div><div class="metric"><span>Minimum interest</span><strong>${money(settings.minimumInterest)}</strong></div><div class="metric"><span>Deadline</span><strong>${safeText(formatDate(settings.deadline))}</strong></div><div class="metric"><span>Round type</span><strong>${safeText(settings.raiseLabel)}</strong></div></div></section>
<section class="section"><span class="eyebrow">The company</span><h2>Business overview</h2><p>${safeText(settings.businessOverview)}</p>${companyGallery}${companyVideos}<article class="card"><span>Investment case</span><h3>Why this opportunity deserves review</h3><p>${safeText(settings.investorThesis)}</p></article><article class="card"><span>Business model</span><h3>How the company expects to create revenue</h3><p>${safeText(settings.businessModel)}</p></article></section>
<section class="section dark"><span class="eyebrow">Why now</span><h2>The timing and funding window</h2><p>${safeText(settings.whyNow)}</p>${opportunityGallery}${opportunityVideos}${fundsGallery}${fundsVideos}<article class="card"><span>Use of funds</span><h3>Capital tied to specific execution needs</h3><p>${safeText(settings.useOfFunds)}</p></article></section>
<section class="section"><span class="eyebrow">Proof</span><h2>Evidence, readiness, and credibility</h2><p>${safeText(settings.proofPoints)}</p>${proofGallery}${proofVideos}<article class="card"><span>Market opportunity</span><h3>The customer problem and revenue logic</h3><p>${safeText(settings.marketOpportunity)}</p></article></section>
<section class="section"><span class="eyebrow">Terms</span><h2>Proposed participation structure</h2><p>${safeText(settings.termsSummary)}</p>${processGallery}${processVideos}<article class="card"><span>Process</span><h3>From interest to approved participation</h3><p>${safeText(settings.investorProcess)}</p></article></section>
<section id="investor-interest" class="interest"><span class="eyebrow">Investor interest</span><h2>Begin the private review</h2><p>Submit your name, contact details, proposed interest amount, and questions. This is a non-binding indication of interest for owner review only.</p><div class="form"><input placeholder="Full name"/><input placeholder="Email"/><input placeholder="Phone"/><input placeholder="Proposed amount"/><textarea placeholder="Message or questions"></textarea><a class="btn primary" href="mailto:${safeText(settings.contactEmail)}?subject=${encodeURIComponent(`Investor interest in ${settings.companyName}`)}&body=${encodeURIComponent('Name:\nEmail:\nPhone:\nProposed amount:\nMessage:\n')}">Submit by email</a></div></section>
<section class="notice"><strong>Important review notice</strong><p>${safeText(settings.riskNotice)}</p></section>
<footer class="foot"><p>${safeText(settings.legalName)} · ${safeText(settings.location)}</p><p>${safeText(settings.contactEmail)} · ${safeText(settings.contactPhone)} ${settings.website ? `· ${safeText(settings.website)}` : ''}</p></footer>
</body>
</html>`;
}

function buildPackageText(settings: PortalSettings) {
  return `PRIVATE INVESTOR PORTAL PACKAGE\n\nCompany: ${settings.companyName}\nLegal name: ${settings.legalName}\nFounder / Owner: ${settings.founderName}, ${settings.founderTitle}\nContact: ${settings.contactEmail} · ${settings.contactPhone}\nWebsite: ${settings.website}\nLocation: ${settings.location}\n\nFunding Goal: ${money(settings.fundingGoal)}\nMinimum Interest: ${money(settings.minimumInterest)}\nDeadline: ${formatDate(settings.deadline)}\nRound / Structure: ${settings.roundType}\n\nBUSINESS OVERVIEW\n${settings.businessOverview}\n\nINVESTOR THESIS\n${settings.investorThesis}\n\nWHY NOW\n${settings.whyNow}\n\nBUSINESS MODEL\n${settings.businessModel}\n\nPROOF / READINESS\n${settings.proofPoints}\n\nUSE OF FUNDS\n${settings.useOfFunds}\n\nMARKET OPPORTUNITY\n${settings.marketOpportunity}\n\nTERMS SUMMARY\n${settings.termsSummary}\n\nINVESTOR PROCESS\n${settings.investorProcess}\n\nAGREEMENT DOCUMENT\n${settings.agreementFileName ? `Attached / uploaded document: ${settings.agreementFileName}` : 'No agreement file uploaded yet. Investors should request the document from the owner.'}\n\nRISK NOTICE\n${settings.riskNotice}\n\nThis package is an organization and presentation aid, not legal, accounting, tax, investment, or securities advice.`;
}

function App() {
  const [view, setView] = useState<BuilderView>('build');
  const [settings, setSettings] = useState<PortalSettings>(() => loadSettings());
  const [savedAt, setSavedAt] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = (patch: Partial<PortalSettings>) => setSettings((current) => ({ ...current, ...patch }));

  const selectTemplate = (key: TemplateKey) => {
    const template = templates.find((item) => item.key === key)?.settings || baseTemplate;
    setSettings((current) => ({ ...template, logoDataUrl: current.logoDataUrl, heroImageDataUrl: current.heroImageDataUrl, companyImagesDataUrls: current.companyImagesDataUrls, opportunityImagesDataUrls: current.opportunityImagesDataUrls, proofImagesDataUrls: current.proofImagesDataUrls, fundsImagesDataUrls: current.fundsImagesDataUrls, processImagesDataUrls: current.processImagesDataUrls, companyVideosDataUrls: current.companyVideosDataUrls, opportunityVideosDataUrls: current.opportunityVideosDataUrls, proofVideosDataUrls: current.proofVideosDataUrls, fundsVideosDataUrls: current.fundsVideosDataUrls, processVideosDataUrls: current.processVideosDataUrls, agreementDataUrl: current.agreementDataUrl, agreementFileName: current.agreementFileName }));
  };

  const exportPortal = () => downloadTextFile(`${slugify(settings.companyName)}-investor-portal.html`, buildPortalHtml(settings), 'text/html;charset=utf-8');
  const exportProfile = () => downloadTextFile(`${slugify(settings.companyName)}-portal-builder-profile.json`, JSON.stringify(settings, null, 2), 'application/json;charset=utf-8');
  const exportPackage = () => downloadTextFile(`${slugify(settings.companyName)}-private-funding-package.txt`, buildPackageText(settings));

  const visibleProgress = useMemo(() => {
    const fields = [
      settings.companyName,
      settings.headline,
      settings.businessOverview,
      settings.investorThesis,
      settings.useOfFunds,
      settings.termsSummary,
      settings.contactEmail,
    ];
    const complete = fields.filter((field) => String(field || '').trim().length > 12).length;
    return Math.round((complete / fields.length) * 100);
  }, [settings]);

  const handleUpload = async (file: File, type: 'logo' | 'hero' | 'agreement') => {
    const dataUrl = await readFileAsDataUrl(file);
    if (type === 'logo') update({ logoDataUrl: dataUrl });
    if (type === 'hero') update({ heroImageDataUrl: dataUrl });
    if (type === 'agreement') update({ agreementDataUrl: dataUrl, agreementFileName: file.name });
  };

  const addSectionImages = async (key: ImageCollectionKey, files: FileList) => {
    const newImages = await readImageFiles(files);
    setSettings((current) => ({
      ...current,
      [key]: [...(current[key] || []), ...newImages].slice(0, imageCollectionMax),
    }));
  };

  const addSectionVideos = async (key: VideoCollectionKey, files: FileList) => {
    const newVideos = await readVideoFiles(files);
    setSettings((current) => ({
      ...current,
      [key]: [...(current[key] || []), ...newVideos].slice(0, videoCollectionMax),
    }));
  };

  const removeSectionVideo = (key: VideoCollectionKey, index: number) => {
    setSettings((current) => ({
      ...current,
      [key]: (current[key] || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const clearSectionVideos = (key: VideoCollectionKey) => {
    setSettings((current) => ({ ...current, [key]: [] }));
  };

  const removeSectionImage = (key: ImageCollectionKey, index: number) => {
    setSettings((current) => ({
      ...current,
      [key]: (current[key] || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const clearSectionImages = (key: ImageCollectionKey) => {
    setSettings((current) => ({ ...current, [key]: [] }));
  };

  const saveStamp = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedAt(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 px-5 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/90 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <LogoMark settings={settings} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold tracking-tight">MONIEZI Raise</p>
            <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">V1.5.5 · Premium Section Builder</p>
          </div>
          <button onClick={saveStamp} className="rounded-2xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white shadow-lg active:scale-95 dark:bg-blue-500">
            Save
          </button>
        </div>
        <nav className="mt-4 grid grid-cols-3 gap-2">
          {([
            ['build', 'Build'],
            ['preview', 'Preview'],
            ['export', 'Export'],
          ] as Array<[BuilderView, string]>).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`rounded-2xl px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition active:scale-95 ${
                view === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {view === 'build' && (
        <main className="w-full">
          <section className="w-full bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.22),_transparent_36%),linear-gradient(180deg,#ffffff,#eff6ff)] px-5 py-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.25),_transparent_36%),linear-gradient(180deg,#020617,#0f172a)] sm:px-8 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">One job only</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.18] tracking-[-0.055em] sm:text-6xl">Build a premium investor portal for your business.</h1>
            <p className="mt-6 text-base font-medium leading-[2.05] text-slate-600 dark:text-slate-300">
              Fill the guided template, preview the investor-facing page, attach a fillable agreement or funding document, and export a shareable portal. This builder is for the owner’s investor portal — nothing else.
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-blue-200 bg-white/80 p-4 dark:border-blue-400/20 dark:bg-white/5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Portal readiness</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">{visibleProgress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${visibleProgress}%` }} />
              </div>
              {savedAt && <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Saved at {savedAt}</p>}
            </div>
          </section>

          <BuilderSection number="01" title="Choose the portal template" subtitle="Start with the type of investor portal you want to create. You can change all wording after choosing a template.">
            <Guidance
              title="What this choice controls"
              bullets={[
                'Use Premium Investor Portal for the broadest polished private-round page.',
                'Use Startup / SAFE Portal for startup-style investor language and an agreement-review workflow.',
                'Use Local Business Expansion Portal for equipment, vehicles, crews, materials, working capital, or growth capacity.',
              ]}
            />
            <div className="grid gap-4">
              {templates.map((template) => (
                <TemplateButton key={template.key} template={template} active={settings.templateKey === template.key} onClick={() => selectTemplate(template.key)} />
              ))}
            </div>
          </BuilderSection>

          <BuilderSection number="02" title="Company identity" subtitle="This information appears in the portal header, footer, investor document area, and contact sections.">
            <Guidance
              title="Fill this like a real investor page"
              bullets={[
                'Use the public-facing company name investors should recognize.',
                'Add the legal name if documents will be signed under a different formal entity name.',
                'Use a direct email that investors can verify before sending documents or funds.',
              ]}
            />
            <div className="grid gap-5">
              <Field label="Company / business name" hint="Example: Northside Roofing & Repair or Apex Growth Systems."><input className={inputClass} value={settings.companyName} onChange={(e) => update({ companyName: e.target.value })} /></Field>
              <Field label="Legal entity name" hint="Use the formal entity name that appears on agreements, if different."><input className={inputClass} value={settings.legalName} onChange={(e) => update({ legalName: e.target.value })} /></Field>
              <Field label="Founder / owner name"><input className={inputClass} value={settings.founderName} onChange={(e) => update({ founderName: e.target.value })} /></Field>
              <Field label="Founder / owner title"><input className={inputClass} value={settings.founderTitle} onChange={(e) => update({ founderTitle: e.target.value })} /></Field>
              <Field label="Contact email"><input className={inputClass} type="email" value={settings.contactEmail} onChange={(e) => update({ contactEmail: e.target.value })} /></Field>
              <Field label="Contact phone"><input className={inputClass} value={settings.contactPhone} onChange={(e) => update({ contactPhone: e.target.value })} /></Field>
              <Field label="Website"><input className={inputClass} value={settings.website} onChange={(e) => update({ website: e.target.value })} /></Field>
              <Field label="Location"><input className={inputClass} value={settings.location} onChange={(e) => update({ location: e.target.value })} /></Field>
            </div>
            <div className="grid gap-4">
              <UploadBox title="Upload company logo" subtitle="Optional. This appears in the portal header and makes the page feel less generic." accept="image/*" onFile={(file) => handleUpload(file, 'logo')} />
              <UploadBox title="Upload hero image" subtitle="Optional. Use a product, service, business, project, or founder image. Section videos are added below so the finished portal can feel more like a real presentation." accept="image/*" onFile={(file) => handleUpload(file, 'hero')} />
            </div>
          </BuilderSection>

          <BuilderSection number="03" title="Investor portal hero" subtitle="This is the first screen investors see. It should sound clear, serious, and specific.">
            <Guidance
              title="Write the opening like an investor portal, not a flyer"
              bullets={[
                'The headline should say what kind of opportunity this is and why the business deserves review.',
                'The subheadline should explain what investors will learn on the page.',
                'Avoid vague claims like “great opportunity.” Be specific about the business, round, and next step.',
              ]}
            />
            <div className="grid gap-5">
              <Field label="Small eyebrow above headline"><input className={inputClass} value={settings.portalEyebrow} onChange={(e) => update({ portalEyebrow: e.target.value })} /></Field>
              <Field label="Main portal headline"><textarea className={textAreaClass} value={settings.headline} onChange={(e) => update({ headline: e.target.value })} /></Field>
              <Field label="Subheadline"><textarea className={textAreaClass} value={settings.subheadline} onChange={(e) => update({ subheadline: e.target.value })} /></Field>
              <Field label="Primary button text"><input className={inputClass} value={settings.primaryCta} onChange={(e) => update({ primaryCta: e.target.value })} /></Field>
              <Field label="Agreement download button text"><input className={inputClass} value={settings.secondaryCta} onChange={(e) => update({ secondaryCta: e.target.value })} /></Field>
            </div>
          </BuilderSection>

          <BuilderSection number="04" title="Raise snapshot" subtitle="These values appear as high-visibility investor metrics on the portal.">
            <Guidance
              title="Keep the numbers understandable"
              bullets={[
                'Funding goal should be the amount the owner is trying to organize interest around.',
                'Minimum interest is not a guaranteed minimum investment; it is a suggested review amount.',
                'Round type should match the document strategy: SAFE, private loan, revenue-share, profit-share, or advisor-reviewed agreement.',
              ]}
            />
            <div className="grid gap-5">
              <Field label="Funding goal"><input className={inputClass} inputMode="numeric" value={settings.fundingGoal} onChange={(e) => update({ fundingGoal: e.target.value })} /></Field>
              <Field label="Minimum interest"><input className={inputClass} inputMode="numeric" value={settings.minimumInterest} onChange={(e) => update({ minimumInterest: e.target.value })} /></Field>
              <Field label="Deadline"><input className={inputClass} type="date" value={settings.deadline} onChange={(e) => update({ deadline: e.target.value })} /></Field>
              <Field label="Portal raise label"><input className={inputClass} value={settings.raiseLabel} onChange={(e) => update({ raiseLabel: e.target.value })} /></Field>
              <Field label="Round / agreement structure"><textarea className={textAreaClass} value={settings.roundType} onChange={(e) => update({ roundType: e.target.value })} /></Field>
            </div>
          </BuilderSection>

          <BuilderSection number="05" title="Investment story" subtitle="This is the core of the portal. It gives investors enough substance to understand what they are reviewing.">
            <Guidance
              title="Each answer should sell one part of the business case"
              bullets={[
                'Business overview explains what the company does and who it serves.',
                'Investor thesis explains why this business could be worth reviewing.',
                'Why now explains why the funding should happen now instead of someday.',
                'Proof points show evidence: revenue, customers, jobs, prototype, owner experience, assets, relationships, or readiness.',
              ]}
            />
            <div className="grid gap-5">
              <Field label="Business overview"><textarea className={textAreaClass} value={settings.businessOverview} onChange={(e) => update({ businessOverview: e.target.value })} /></Field>
              <Field label="Investor thesis"><textarea className={textAreaClass} value={settings.investorThesis} onChange={(e) => update({ investorThesis: e.target.value })} /></Field>
              <Field label="Why now"><textarea className={textAreaClass} value={settings.whyNow} onChange={(e) => update({ whyNow: e.target.value })} /></Field>
              <Field label="Business model"><textarea className={textAreaClass} value={settings.businessModel} onChange={(e) => update({ businessModel: e.target.value })} /></Field>
              <Field label="Proof / readiness"><textarea className={textAreaClass} value={settings.proofPoints} onChange={(e) => update({ proofPoints: e.target.value })} /></Field>
              <Field label="Use of funds"><textarea className={textAreaClass} value={settings.useOfFunds} onChange={(e) => update({ useOfFunds: e.target.value })} /></Field>
              <Field label="Market opportunity"><textarea className={textAreaClass} value={settings.marketOpportunity} onChange={(e) => update({ marketOpportunity: e.target.value })} /></Field>
            </div>
          </BuilderSection>



          <BuilderSection number="06" title="Portal images and videos for each section" subtitle="Add visual proof so the investor portal feels like a real business presentation, not a plain text page. Each major section can include up to three images and up to three videos.">
            <Guidance
              title="Use media to make the opportunity feel real"
              bullets={[
                'Upload one to three images and one to three videos for each major section where visuals help the investor understand the business.',
                'Use clear media that supports the business story: product demos, service work, equipment, customer problem, proof of execution, founder message, or agreement-review instructions.',
                'Keep videos short and compressed when possible. Large videos can make exported portals heavy, slower to load, and harder to move from a phone.',
              ]}
            />
            <div className="grid gap-5">
              <ImageUploadGroup
                title="Business overview images"
                subtitle="Use product photos, service images, storefront images, founder/team photos, aircraft/equipment images, or visuals that immediately show what the company does."
                images={settings.companyImagesDataUrls}
                onAdd={(files) => addSectionImages('companyImagesDataUrls', files)}
                onRemove={(index) => removeSectionImage('companyImagesDataUrls', index)}
                onClear={() => clearSectionImages('companyImagesDataUrls')}
              />
              <VideoUploadGroup
                title="Business overview videos"
                subtitle="Optional. Use short videos that explain what the company does: product demo, job-site walkthrough, founder intro, service footage, app screen recording, or company presentation clip."
                videos={settings.companyVideosDataUrls}
                onAdd={(files) => addSectionVideos('companyVideosDataUrls', files)}
                onRemove={(index) => removeSectionVideo('companyVideosDataUrls', index)}
                onClear={() => clearSectionVideos('companyVideosDataUrls')}
              />
              <ImageUploadGroup
                title="Opportunity / market images"
                subtitle="Use images that support the market story: customers, locations, workflows, service area, before-and-after examples, or the problem the business solves."
                images={settings.opportunityImagesDataUrls}
                onAdd={(files) => addSectionImages('opportunityImagesDataUrls', files)}
                onRemove={(index) => removeSectionImage('opportunityImagesDataUrls', index)}
                onClear={() => clearSectionImages('opportunityImagesDataUrls')}
              />
              <VideoUploadGroup
                title="Opportunity / market videos"
                subtitle="Optional. Use short videos that show customer demand, the operating problem, market setting, local service area, before-and-after context, or the reason the opportunity is timely."
                videos={settings.opportunityVideosDataUrls}
                onAdd={(files) => addSectionVideos('opportunityVideosDataUrls', files)}
                onRemove={(index) => removeSectionVideo('opportunityVideosDataUrls', index)}
                onClear={() => clearSectionVideos('opportunityVideosDataUrls')}
              />
              <ImageUploadGroup
                title="Proof / readiness images"
                subtitle="Use real proof: completed work, prototype screenshots, equipment, signed jobs, customer examples, product visuals, operating assets, or launch readiness visuals."
                images={settings.proofImagesDataUrls}
                onAdd={(files) => addSectionImages('proofImagesDataUrls', files)}
                onRemove={(index) => removeSectionImage('proofImagesDataUrls', index)}
                onClear={() => clearSectionImages('proofImagesDataUrls')}
              />
              <VideoUploadGroup
                title="Proof / readiness videos"
                subtitle="Optional. Use short videos that prove execution: product demo, completed work, customer walkthrough, equipment in use, project progress, prototype footage, or operating capability."
                videos={settings.proofVideosDataUrls}
                onAdd={(files) => addSectionVideos('proofVideosDataUrls', files)}
                onRemove={(index) => removeSectionVideo('proofVideosDataUrls', index)}
                onClear={() => clearSectionVideos('proofVideosDataUrls')}
              />
              <ImageUploadGroup
                title="Use-of-funds images"
                subtitle="Use images of trucks, tools, equipment, materials, inventory, workspace, product development, crew capacity, or the exact things funding will help move forward."
                images={settings.fundsImagesDataUrls}
                onAdd={(files) => addSectionImages('fundsImagesDataUrls', files)}
                onRemove={(index) => removeSectionImage('fundsImagesDataUrls', index)}
                onClear={() => clearSectionImages('fundsImagesDataUrls')}
              />
              <VideoUploadGroup
                title="Use-of-funds videos"
                subtitle="Optional. Use short videos showing the exact assets, equipment, buildout, materials, crew capacity, inventory, or project stage that the funding will support."
                videos={settings.fundsVideosDataUrls}
                onAdd={(files) => addSectionVideos('fundsVideosDataUrls', files)}
                onRemove={(index) => removeSectionVideo('fundsVideosDataUrls', index)}
                onClear={() => clearSectionVideos('fundsVideosDataUrls')}
              />
              <ImageUploadGroup
                title="Process / agreement images"
                subtitle="Optional. Use images that support credibility around the process: founder portrait, advisor-ready materials, signed package visuals, operating documentation, or investor-review assets."
                images={settings.processImagesDataUrls}
                onAdd={(files) => addSectionImages('processImagesDataUrls', files)}
                onRemove={(index) => removeSectionImage('processImagesDataUrls', index)}
                onClear={() => clearSectionImages('processImagesDataUrls')}
              />
              <VideoUploadGroup
                title="Process / agreement videos"
                subtitle="Optional. Use short videos for a founder message, investor walkthrough, agreement review instructions, due-diligence overview, or final private-review process explanation."
                videos={settings.processVideosDataUrls}
                onAdd={(files) => addSectionVideos('processVideosDataUrls', files)}
                onRemove={(index) => removeSectionVideo('processVideosDataUrls', index)}
                onClear={() => clearSectionVideos('processVideosDataUrls')}
              />
            </div>
          </BuilderSection>

          <BuilderSection number="07" title="Terms, process, and agreement" subtitle="This section controls the investor agreement download area and the next-step instructions.">
            <Guidance
              title="Use careful language"
              bullets={[
                'Describe the proposed structure without promising acceptance, return, equity, or automatic participation.',
                'Use “non-binding indication of interest,” “owner review,” “final documents,” and “advisor-reviewed agreement” where appropriate.',
                'Upload the actual fillable PDF or document investors should download, sign, and return by email when the owner is ready.',
              ]}
            />
            <div className="grid gap-5">
              <Field label="Terms summary"><textarea className={textAreaClass} value={settings.termsSummary} onChange={(e) => update({ termsSummary: e.target.value })} /></Field>
              <Field label="Investor process"><textarea className={textAreaClass} value={settings.investorProcess} onChange={(e) => update({ investorProcess: e.target.value })} /></Field>
              <Field label="Agreement title"><input className={inputClass} value={settings.agreementTitle} onChange={(e) => update({ agreementTitle: e.target.value })} /></Field>
              <Field label="Agreement summary"><textarea className={textAreaClass} value={settings.agreementSummary} onChange={(e) => update({ agreementSummary: e.target.value })} /></Field>
              <UploadBox
                title="Upload agreement / SAFE / funding document"
                subtitle="Optional but important. Upload the fillable PDF or document investors can download from the portal. This embeds the file in the exported HTML. Very large files should be avoided."
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                fileName={settings.agreementFileName}
                onFile={(file) => handleUpload(file, 'agreement')}
              />
              <Field label="Risk / review notice"><textarea className={textAreaClass} value={settings.riskNotice} onChange={(e) => update({ riskNotice: e.target.value })} /></Field>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button onClick={() => setView('preview')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-900/20 active:scale-95"><Eye className="h-4 w-4" /> Preview investor portal</button>
              <button onClick={exportPortal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-xl active:scale-95 dark:bg-blue-500"><Download className="h-4 w-4" /> Export portal HTML</button>
              <button onClick={exportProfile} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-950 shadow-xl active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-white"><Save className="h-4 w-4" /> Export builder profile</button>
            </div>
          </BuilderSection>
        </main>
      )}

      {view === 'preview' && (
        <main className="w-full">
          <section className="w-full border-b border-slate-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-slate-900 sm:px-8 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Portal preview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Preview the investor portal.</h1>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button onClick={() => setView('build')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg active:scale-95 dark:border-white/10 dark:bg-slate-950 dark:text-white"><PenLine className="h-4 w-4" /> Edit builder</button>
              <button onClick={exportPortal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 active:scale-95"><Download className="h-4 w-4" /> Export portal</button>
            </div>
          </section>
          <InvestorPortal settings={settings} />
        </main>
      )}

      {view === 'export' && (
        <main className="w-full">
          <section className="w-full bg-white px-5 py-8 dark:bg-slate-900 sm:px-8 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Export center</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.18] tracking-[-0.055em] sm:text-5xl">Download investor portal materials.</h1>
            <p className="mt-6 text-base font-medium leading-[2.05] text-slate-600 dark:text-slate-300">
              This version exports the investor-facing portal as a single static HTML file. It also exports the builder profile and a text funding package. If an agreement file was uploaded, the exported portal includes a download button for that document.
            </p>
            <div className="mt-8 grid gap-4">
              <button onClick={exportPortal} className="flex items-center justify-between gap-4 rounded-[2rem] bg-blue-600 p-5 text-left text-white shadow-xl shadow-blue-900/20 active:scale-[0.99]"><span><strong className="block text-xl">Export investor portal HTML</strong><span className="mt-1 block text-sm font-medium text-blue-100">The finished investor portal page you can upload or share.</span></span><Download className="h-6 w-6" /></button>
              <button onClick={exportPackage} className="flex items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 text-left text-slate-950 shadow-xl shadow-slate-200/70 active:scale-[0.99] dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-black/20"><span><strong className="block text-xl">Download funding package text</strong><span className="mt-1 block text-sm font-medium text-slate-500 dark:text-slate-300">A clean internal package summary from the builder content.</span></span><FileText className="h-6 w-6" /></button>
              <button onClick={exportProfile} className="flex items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 text-left text-slate-950 shadow-xl shadow-slate-200/70 active:scale-[0.99] dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-black/20"><span><strong className="block text-xl">Export builder profile JSON</strong><span className="mt-1 block text-sm font-medium text-slate-500 dark:text-slate-300">Save or move the owner’s portal settings.</span></span><ClipboardList className="h-6 w-6" /></button>
              {settings.agreementDataUrl && (
                <a href={settings.agreementDataUrl} download={settings.agreementFileName || 'investor-agreement'} className="flex items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 text-left text-slate-950 shadow-xl shadow-slate-200/70 active:scale-[0.99] dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-black/20">
                  <span><strong className="block text-xl">Download uploaded agreement</strong><span className="mt-1 block text-sm font-medium text-slate-500 dark:text-slate-300">{settings.agreementFileName}</span></span><Download className="h-6 w-6" />
                </a>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
