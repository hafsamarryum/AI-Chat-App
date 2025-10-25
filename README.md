# Next.js Chat App with Google Gemini AI

A modern chat application built with Next.js 15, tRPC, and Google Gemini AI (free tier).

## Features

- 🤖 **Free AI Chat** - Powered by Google Gemini 1.5 Flash (no cost)
- 🔐 **Authentication** - Supabase Auth integration
- 💬 **Real-time Chat** - Instant responses from AI
- 🎨 **Modern UI** - Clean and responsive design
- ⚡ **Fast** - Built with Next.js 15 and Turbopack

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **API Layer**: tRPC
- **AI Provider**: Google Gemini AI (Free)
- **Authentication**: Supabase
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier)
- A Google AI Studio API key (free tier)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI (Free)
GEMINI_API_KEY=your_gemini_api_key

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

3. Set up the database:

Run the SQL script in `scripts/01-init-db.sql` in your Supabase SQL editor.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Getting API Keys

### Google Gemini API Key (Free)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to `.env.local`

**Note**: Gemini 1.5 Flash is completely free with generous rate limits (15 requests per minute, 1 million tokens per day).

### Supabase Setup

1. Go to [Supabase](https://supabase.com)
2. Create a new project (free tier available)
3. Go to Settings > API
4. Copy the URL and anon key to `.env.local`
5. Go to Settings > Database and copy the service role key

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (tRPC, health check)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth-page.tsx     # Authentication page
│   ├── chat-page.tsx     # Main chat interface
│   └── message-bubble.tsx # Message component
├── lib/                   # Utility functions
│   ├── llm-client.ts     # AI client (Gemini)
│   ├── store.ts          # Zustand store
│   ├── supabase-client.ts # Supabase client
│   └── trpc-client.ts    # tRPC client
├── server/                # Server-side code
│   └── trpc/             # tRPC routers
│       ├── routers/
│       │   ├── chat.ts   # Chat endpoints
│       │   └── models.ts # Model list
│       └── root.ts       # Root router
└── scripts/              # Database scripts
    └── 01-init-db.sql    # Initial schema
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### AI Chat
- Uses Google Gemini 1.5 Flash model
- Completely free with no credit card required
- Fast response times (typically 1-2 seconds)
- Supports long conversations
- Configurable temperature and token limits

### Authentication
- Email/password authentication via Supabase
- Secure session management
- Protected routes
- Automatic logout functionality

### Chat Interface
- Clean, modern UI with gradient header
- Message history with timestamps
- Loading states with animated dots
- Error handling with user-friendly messages
- Responsive design for mobile and desktop
- Dark mode toggle

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Redirect URL for auth | Yes |

## Troubleshooting

### "Gemini is not configured" error
- Make sure `GEMINI_API_KEY` is set in `.env.local`
- Restart the development server after adding the key
- Verify the API key is valid in Google AI Studio

### Authentication issues
- Verify Supabase credentials in `.env.local`
- Check that the database schema is set up correctly
- Ensure redirect URL matches your development URL
- Check Supabase dashboard for authentication logs

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Port already in use
- The app will automatically use port 3001 if 3000 is busy
- Or manually kill the process using port 3000

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [tRPC Documentation](https://trpc.io/docs) - type-safe API layer
- [Google Gemini AI](https://ai.google.dev/) - AI model documentation
- [Supabase Documentation](https://supabase.com/docs) - backend and auth
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important**: Remember to add all environment variables in Vercel's project settings before deploying.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## List any stretch you tackled

While implementing Theme mode switching (Dark, Light), I struggled a bit figuring out the exact issue,
as per documentation and search my code seemed perfect but it wasn't reflecting the desired changes.
Also wasn't throwing any proper error.
So, after some hours of debugging and searching I found out the issue was regarding Next.js version conflicting with tailwind. Degrading from latest version worked for me.


## License

MIT