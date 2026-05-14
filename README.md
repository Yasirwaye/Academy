# Eastleigh United Academy — Project Documentation

## Overview

A full-stack football academy website built with **React + Tailwind CSS** on the frontend and **Supabase** for backend, database, authentication, and file storage.  
The site has a **public-facing landing page** and a **password-protected admin panel** — all in a single app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Lucide React icons |
| State / Data | TanStack React Query |
| Backend / DB | Supabase (PostgreSQL database, auth, file storage) |
| Hosting | Vercel (frontend) + Supabase (backend) |
| File Uploads | Supabase Storage (`media` bucket — photos, videos) |

---

## Project Structure

```
src/
├── pages/
│   └── Landing.jsx               ← Public-facing landing page
├── components/
│   ├── original/                 ← Legacy design reference (not used in production)
│   │   └── ...                   ← See "Original Folder" note below
│   ├── layout/
│   │   ├── AppLayout.jsx         ← Authenticated layout with sidebar
│   │   └── Sidebar.jsx           ← Navigation sidebar
│   └── shared/
│       ├── PhotoUpload.jsx       ← Reusable photo uploader (Supabase Storage)
│       └── VideoUpload.jsx       ← Reusable video uploader (Supabase Storage)
├── api/
│   ├── supabaseClient.js         ← Supabase client (swap stub → real client locally)
│   └── dataService.js            ← All DB + file upload operations (db.* and uploadFile)
├── lib/
│   ├── AuthContext.jsx           ← Supabase auth context (session, login, logout)
│   ├── PageNotFound.jsx          ← 404 page
│   └── query-client.js           ← TanStack React Query client
├── App.jsx                       ← React Router routes
├── index.css                     ← Global styles (.glass, .gradient-text, fonts)
└── tailwind.config.js
```

---

## Database Tables (Supabase / PostgreSQL)

### players
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key (auto) |
| full_name | text | Required |
| position | text | Goalkeeper / Defender / Midfielder / Forward |
| squad_id | uuid | Foreign key → squads.id |
| jersey_number | int | |
| date_of_birth | date | |
| nationality | text | |
| email | text | |
| phone | text | |
| photo_url | text | Uploaded to Supabase Storage `media` bucket |
| status | text | active / injured / suspended / inactive |
| stats_goals | int | |
| stats_assists | int | |
| stats_matches | int | |
| notes | text | Quote / description |

### squads
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | Required |
| age_group | text | U-8 … Senior |
| formation | text | 4-3-3 / 4-4-2 / 5-3-2 / 4-2-3-1 / 3-5-2 / 4-1-4-1 |
| coach_name | text | |
| training_schedule | text | |
| description | text | |
| image_url | text | |
| lineup | jsonb | Ordered array of player IDs (starting XI) |
| substitutes | jsonb | Array of player IDs (bench) |

### spotlights (up to 4)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| player_id | uuid | Foreign key → players.id |
| order | int | 1–4 display order |
| highlight_text | text | Custom description shown on site |

### highlights
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Required |
| video_url | text | Supabase Storage URL or YouTube/direct URL |
| thumbnail_url | text | Optional thumbnail image |
| description | text | |
| match_date | date | |
| squad_id | uuid | Optional — foreign key → squads.id |
| is_featured | boolean | Pins to top of gallery |

### applications
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| first_name | text | Required |
| last_name | text | Required |
| email | text | Required |
| position | text | |
| date_of_birth | date | |
| previous_club | text | |
| phone | text | |
| message | text | |
| status | text | pending / reviewed / accepted / rejected |

### announcements
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Required |
| content | text | |
| type | text | general / training / match / event |
| squad_id | uuid | Optional — targets specific squad |

---

## Authentication (Supabase Auth)

- Admin logs in via **email + password** through Supabase Auth
- Session is managed by `AuthContext.jsx` using `supabase.auth.getSession()` and `onAuthStateChange`
- To mark a user as admin: go to **Supabase Dashboard → Authentication → Users → Edit user → user_metadata** and set `{ "role": "admin" }`
- Logout clears the Supabase session via `supabase.auth.signOut()`

---

## File Uploads (Supabase Storage)

- All photos and videos are uploaded to the **`media`** storage bucket in Supabase
- The bucket must be set to **Public**
- Upload handled by `uploadFile(file)` in `api/dataService.js`
- Returns a public URL saved to the relevant table column

---

## Admin Panel

Access: click the **Shield icon** in the navbar → enter your Supabase admin email/password.

### Tabs

| Tab | What it does |
|-----|-------------|
| **Squads** | Create / edit / delete squads |
| **Players** | Create / edit / delete players with stats, photo upload, squad assignment |
| **Lineup** | Set formation → assign players to 11 slots → mark substitutes → Save |
| **Spotlight** | Add up to 4 players to the public spotlight section |
| **Highlights** | Upload videos or paste YouTube URLs, thumbnails, feature/unfeature |
| **Applications** | View and update status of public application submissions |

---

## Original Folder (`components/original/`)

> **This folder contains legacy/reference code only — it is NOT used in production.**  
> It holds the original design components from the initial project iteration.  
> You can safely **ignore or delete** this folder when setting up locally.  
> It is kept here only as a reference for the original UI designs.

---

## Local Setup

```bash
npm install
npm install @supabase/supabase-js
```

Create a `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then in `src/api/supabaseClient.js`, replace the stub with:
```js
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Run:
```bash
npm run dev
```

---

## Deploying to Vercel

### Step 1 — Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Import into Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

### Step 3 — Environment Variables in Vercel
Add these in Vercel → Project → Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4 — Deploy
Click **Deploy**. Vercel hosts the React frontend. Supabase handles the database, auth, and file storage.

### Step 5 — Add Vercel domain to Supabase
In Supabase → **Authentication → URL Configuration** → add your Vercel URL to **Redirect URLs**.

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0e1a` (dark navy) |
| Accent | `cyan-400` / `blue-500` gradient |
| Glass card | `rgba(30,64,175,0.1)` + `backdrop-blur` |
| Font body | Inter |
| Font display | Oswald (headings, stats) |
| Gradient text | `#00d4ff` → `#3b82f6` |

---

## Club Logo
The official Eastleigh United crest is used in the Navbar and Footer.