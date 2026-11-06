# Portfolio-Template

A fully-featured **portfolio template** built with **Next.js (App Router)** and **Supabase** — complete with an **admin panel** so you can edit all your content directly from a dashboard (no code changes needed).

> Built with Next.js 16, React 19, Supabase, and CSS Modules.

---

## ✨ Features

### Public Portfolio
- **Hero** — Name, title, tagline, resume download
- **About** — Bio with image and paragraphs
- **Education** — Timeline-style education cards (image optional)
- **Experience** — Work experience timeline (image optional)
- **Skills** — Categorized skill tags
- **Projects** — Project cards with tech stack, features, and GitHub links
- **Contact** — Contact form (via EmailJS) + social links
- Scroll-triggered reveal animations, smooth scrolling, responsive design

### Admin Panel (`/admin`)
- Secure login with Supabase email/password auth
- Edit all content via forms: Hero, About, Education, Experience, Skills, Projects, Contact
- Tag input for skills, tech stacks, bullet lists
- Image URL fields
- Reorderable items (via `order_index`)

---

## 📦 Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- A **Supabase** account (free tier)
- An **EmailJS** account (free tier)
- **npm**

---

## ⚙️ Installation

```bash
git clone https://github.com/MohamedAlsayed334/Portfolio-Templete.git
cd Portfolio-Templete
npm install
cp .env.example .env
```
> [!CAUTION]
> 🚧 <b style="color: red" >Then follow the setup guides below to configure Supabase and EmailJS.</b>

---

## Setup

### 1. Supabase Setup

1. Create a project at <a href="https://supabase.com" target="_blank">supabase.com</a>
2. Go to **SQL Editor**, paste and run the contents of `src/data/schema.sql`
3. Go to **Authentication → Sign in/Providers → Email** and enable email/password auth
> [!CAUTION]
> **Important:**
> 1. You must disable **Allow new users to sign up** as you don't want anyone to make an account (in case of any security issue).
> 2. You must disable **Confirm email** as you don't want to verify emails (Supabase sometimes doesn't send email verification).

4. Go to **Authentication → Users** and create an admin user (this will be your login)
   
5. Find your credentials in **Project Settings**
   - **1- Get SUPABASE_ANON_KEY** : **API Keys→ Publishable key -> Copy**
> [!CAUTION]
> **Important:** **Don't get the Secret keys!** We only need the **Publishable key**.

   - **2- Get SUPABASE_URL** : **Data API → API URL(copyy  the URL)**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. EmailJS Setup

1. Sign up at <a  href="https://www.emailjs.com/" target="_blank">EmailJS</a>
2. Go to **Email Services** and connect an email service (Gmail, Outlook, etc.)
3. Go to **Email Templates** and create a template with these variables:
   - `{{from_name}}` — sender name
   - `{{from_email}}` — sender email
   - `{{subject}}` — message subject
   - `{{message}}` — message body
4. Go to **Account → API Keys** and copy your public key
5. Add the credentials to `.env`:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

> The `NEXT_PUBLIC_` prefix makes these variables available on the client side (required for EmailJS).

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for your portfolio.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) and log in with the admin user you created.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service ID | Yes (for contact form) |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Yes (for contact form) |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public API key | Yes (for contact form) |

---

## Project Structure

```
Portfolio-Templete/
├── public/                     # Static assets (images, etc.)
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel pages
│   │   │   ├── login/
│   │   │   ├── hero/
│   │   │   ├── about/
│   │   │   ├── education/
│   │   │   ├── experience/
│   │   │   ├── skills/
│   │   │   ├── projects/
│   │   │   ├── contact/
│   │   │   ├── layout.js
│   │   │   └── page.js         # Dashboard
│   │   ├── api/
│   │   │   ├── admin/[table]/  # CRUD proxy (authenticated)
│   │   │   ├── public/[table]/ # Read-only proxy (public)
│   │   │   └── auth/           # Login & session
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js             # Home page
│   ├── components/
│   │   ├── ui/                 # Reusable UI (Button, Section, Icons)
│   │   ├── admin/              # Admin components (TagInput)
│   │   ├── Hero.js, About.js, Education.js, ...
│   │   └── Contact.js          # Contact form (EmailJS)
│   ├── data/
│   │   ├── content.js          # Fallback content
│   │   ├── projects.js         # Fallback projects
│   │   └── schema.sql          # Supabase SQL schema
│   └── lib/
│       ├── api.js              # API client
│       ├── content-context.js  # Content loading context
│       └── utils.js
├── .env.example
├── .gitignore
├── package.json
├── next.config.mjs
└── vercel.json
```

---

## Customization Guide

### Content

- **Via admin panel** — log into `/admin` and edit everything through forms
- **Via fallback files** — edit `src/data/content.js` and `src/data/projects.js` (used when Supabase is unavailable)

### Images

- Place images in `public/images/` and reference as `/images/your-image.webp`
- Images in **Education** and **Experience** are optional — leave the path empty to hide the image block

### Styling

- **Global styles**: `src/app/globals.css`
- **Admin styles**: `src/app/admin/admin.css`
- **Component styles**: co-located `.module.css` files

### Layout

Sections are assembled in `src/app/page.js`. Add, remove, or reorder sections there.

---

## Deployment

### Deploy to Vercel

1. Push the repo to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env`
4. Deploy

The `vercel.json` is pre-configured for Next.js.

---

## How It Works

### API Architecture

```
Browser → Next.js API Route → Supabase REST API
```

- **Public routes** (`/api/public/[table]`) — read-only, anon key
- **Admin routes** (`/api/admin/[table]`) — authenticated, user JWT
- **Auth routes** (`/api/auth/login`, `/api/auth/me`) — Supabase Auth

### Content Loading

1. React fetches data from `/api/public/[table]` on page load
2. If Supabase is configured and reachable → data from DB
3. If unavailable → falls back to local data files

### Admin Authentication

1. Login at `/admin/login` via email/password
2. Tokens stored in `localStorage`
3. Admin API requests include JWT in `Authorization` header
4. Server verifies token with Supabase Auth before proxying

### Contact Form

The contact form uses **EmailJS** to send messages directly to your email. All EmailJS credentials are configured via environment variables — the form never exposes your email address publicly.

---

## License


- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.   
---

## Contributing

Open an issue or PR on GitHub.
# 👨‍💻 Author

**Niral Patel**
---
Made with ❤️ by me
[GitHub](https://github.com/NiralPatel-15)
