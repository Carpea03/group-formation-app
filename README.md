# AI for Business Transformation — Group Formation App

A Next.js web app that collects student survey responses and uses Claude AI to generate balanced project groups for Assignment 2: AI Business Pitch.

---

## Features

- **4-step student survey** — collects AI experience, skills, availability, industry interests, and working style
- **Vercel KV (Redis)** — stores all submissions serverlessly; handles duplicate submissions gracefully
- **Password-protected admin dashboard** — view all responses, filter by experience level, expand individual profiles
- **AI group generation** — sends all profiles to Claude and receives balanced group suggestions (groups of 3–4)
- **CSV export** — download all responses for offline use
- **Adelaide University branding** — official colours, typography, and visual identity throughout

---

## Tech Stack

- Next.js 14 (App Router)
- Vercel KV (`@vercel/kv`)
- Tailwind CSS
- Claude API (claude-sonnet-4-20250514)

---

## Deployment Instructions

### 1. Create a Vercel project

```bash
# Install Vercel CLI if needed
npm i -g vercel

# From the project directory
vercel
```

Or connect your GitHub repo at vercel.com and import the project.

### 2. Add Vercel KV

In your Vercel dashboard:
1. Go to **Storage** → **Create Database** → **KV**
2. Name it (e.g. `group-formation-kv`)
3. Click **Connect to project** and select your project
4. Vercel automatically adds the `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` environment variables

### 3. Set environment variables

In Vercel dashboard → **Settings** → **Environment Variables**, add:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | Your chosen admin password |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (from console.anthropic.com) |

> The KV variables are added automatically — do **not** add them manually.

### 4. Deploy

```bash
vercel --prod
```

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Then fill in ADMIN_PASSWORD and ANTHROPIC_API_KEY

# Pull KV credentials from Vercel (requires vercel link first)
vercel env pull .env.local

# Run development server
npm run dev
```

App runs at http://localhost:3000

---

## Usage

### Student survey
- Share the root URL (e.g. `https://your-app.vercel.app`) with students before Week 1
- Takes 5–7 minutes to complete
- Students who re-submit with the same Student ID will have their response updated

### Admin dashboard
- Access at `/admin`
- Enter your `ADMIN_PASSWORD`
- View all responses, filter by AI experience level, expand individual profiles
- Click **Generate Groups with AI** once responses are collected
- AI suggests groups of 3–4 with rationale for each
- Review flagged considerations before publishing to Canvas
- Click **Export CSV** to download all responses

---

## Group Formation Logic

When "Generate Groups with AI" is clicked, the app sends all student profiles to Claude with instructions to:

1. **Balance AI experience** — mix Beginners, Intermediate, Advanced, and Expert students
2. **Complement roles** — ensure each group has a mix of Coordinators, Researchers, Creatives
3. **Align availability** — group students with overlapping available times
4. **Match industry interests** — group students with similar pitch ideas where possible
5. **Respect peer preferences** — honour stated preferences where feasible

The AI returns JSON with group assignments, rationale for each group, suggested industry focus, and any considerations for the lecturer to review.

---

## File Structure

```
app/
├── layout.jsx              # Root layout with AU header/footer
├── globals.css             # AU brand colours and component styles
├── page.jsx                # Student survey (4-step form)
├── success/page.jsx        # Confirmation page after submission
├── admin/page.jsx          # Admin dashboard
└── api/
    ├── submit/route.js     # POST — store survey submission
    ├── responses/route.js  # GET — retrieve all submissions (admin)
    ├── generate-groups/route.js  # POST — AI group generation; GET — retrieve saved groups
    ├── verify-admin/route.js     # POST — verify admin password
    └── export/route.js     # GET — export responses as CSV
```

---

## Adelaide University Brand Colours

| Colour | Hex |
|---|---|
| Dark Blue | `#140F50` |
| North Terrace Purple | `#856BFF` |
| Bright Blue | `#1449FF` |
| South East Limestone | `#F8EFE0` |
| White | `#FFFFFF` |
