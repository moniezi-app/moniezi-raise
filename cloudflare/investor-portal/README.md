# MONIEZI Raise V1 Cloudflare Investor Portal

This folder contains a deployable Cloudflare Worker + D1 scaffold for the investor-facing reservation page.

## What it does

- Creates private investor package links from MONIEZI package JSON.
- Serves `/p/:token` as a DocuSign-style indication-of-interest page.
- Collects typed signature, acknowledgments, amount, contact data, and audit metadata.
- Stores submissions in Cloudflare D1.
- Exposes an admin JSON export that can be pasted back into MONIEZI's Equity > Cloudflare Portal import box.

## What it does not do

- It does not process payments.
- It does not issue shares.
- It does not replace Wefunder, a registered funding portal, legal review, board approval, investor verification, or final securities documents.

## Setup outline

```bash
cd cloudflare/investor-portal
wrangler d1 create moniezi_investor_portal
# paste the returned database_id into wrangler.toml
wrangler d1 execute moniezi_investor_portal --file=schema.sql
wrangler secret put ADMIN_SECRET
wrangler deploy
```

## Create a package

1. In MONIEZI, open Equity > Investor Packages.
2. Create a package and click **Download Portal JSON**.
3. Send it to the Worker admin endpoint:

```bash
curl -X POST "https://YOUR-WORKER.workers.dev/api/admin/packages" \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  --data @examples/package.sample.json
```

The response includes a public link like:

```text
https://YOUR-WORKER.workers.dev/p/sample-token-123
```

## Export submissions back to MONIEZI

```bash
curl "https://YOUR-WORKER.workers.dev/api/admin/submissions" \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

Paste that JSON into MONIEZI > Equity > Cloudflare Portal > Import signed portal submissions.
