# Jasmine Goh Portfolio

A modern portfolio website for Jasmine Goh, a UX/Product Designer, built with Next.js, Supabase, and TailwindCSS.

## Features

- **Dynamic Content**: Projects and profile information fetched from Supabase.
- **Admin CMS**: Built-in admin dashboard to manage projects and media.
- **Media Library**: efficient image management with crop, resize, and upload capabilities.
- **Secure Authentication**: Custom admin authentication using bcrypt and JWT.
- **Responsive Design**: Fully responsive UI with dark mode support.
- **Animations**: Smooth page transitions and interactions using Framer Motion.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/rizkinov/jasmine-goh-portfolio.git
cd jasmine-goh-portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Authentication
ADMIN_USERNAME=your_username
ADMIN_PASSWORD_HASH=your_bcrypt_hash
JWT_SECRET=your_random_secret_string
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Admin Access

The admin dashboard is located at `/admin`.
- **Login**: Accessed via the dashboard.
- **Media**: Manage uploaded images at `/admin/media`.
- **Projects**: Edit project content using the Tiptap editor.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

**Important**: When deploying to Vercel, ensure you add the following Environment Variables in your project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `JWT_SECRET`
