# X Subscription - Enterprise Asset & Subscription Manager

X Subscription is a modern, full-stack SaaS application designed to help users track, manage, and optimize their recurring software subscriptions. It is built with a highly scalable **Monorepo Architecture** using `pnpm workspaces`, decoupling the frontend, backend, and database schema into isolated, reusable packages.

## 🏗️ Architecture & Project Structure

To maintain clean separation of concerns and allow the project to scale to a large engineering team, the codebase is organized into independent packages. 

```text
Asset-Manager/
├── apps/
│   ├── frontend/           # 🖥️ FRONTEND: React (Vite) Single Page Application
│   │   ├── src/components/ # Reusable UI components (Glassmorphism, Forms, Layouts)
│   │   ├── src/pages/      # Route-level views (Dashboard, Login, Analytics)
│   │   └── src/contexts/   # React Context providers (Auth, Global State)
│   │
│   └── backend/            # ⚙️ BACKEND: Express.js REST API
│       ├── src/routes/     # API Route handlers (Subscriptions, Analytics, Health)
│       ├── src/middleware/ # Express middlewares (JWT Auth verification)
│       └── src/lib/        # Backend utilities and Supabase server clients
│
├── lib/
│   ├── db/                 # 🗄️ DATABASE: Drizzle ORM Schema & Migrations
│   │   └── src/schema/     # Postgres table definitions (subscriptions.ts)
│   │
│   └── api-client-react/   # 🔌 SHARED: Strongly-typed fetch client for the Frontend
│
├── package.json            # Root configuration for pnpm workspaces
└── .env                    # Shared Environment Variables (Supabase, Ports)
```

---

## 🛠️ The Tech Stack

X Subscrips is built with a modern, high-performance stack optimized for scalability, security, and developer experience.

### Frontend
- **Framework:** [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Routing:** [Wouter](https://github.com/molefrog/wouter)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Logging:** [Winston](https://github.com/winstonjs/winston)

### Database & Infrastructure
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **Email:** [Resend](https://resend.com/) (Integrated)

---

## 🔐 Security & Authentication

The platform utilizes **Supabase** for secure, enterprise-grade authentication and data storage.
- **Frontend**: Handles User Sessions, OAuth (Google), and Email verification. Injects JWT Bearer tokens into all API calls via `api-client-react`.
- **Backend Middleware**: The Express.js server verifies JWTs cryptographically before processing requests.
- **Database (RLS)**: Row Level Security is enforced directly inside PostgreSQL. Even if the backend is compromised, data isolation guarantees that `auth.uid() = user_id`.

---

## 📡 Backend API Reference (Express.js)

All API calls are authenticated. You must pass `Authorization: Bearer <JWT_TOKEN>` in the headers.

### Subscriptions Management
* `GET /api/subscriptions` - Fetch all subscriptions for the authenticated user. (Optional queries: `?status=active`, `?category=software`).
* `POST /api/subscriptions` - Create a new subscription record.
* `GET /api/subscriptions/:id` - Retrieve a specific subscription.
* `PUT /api/subscriptions/:id` - Update an existing subscription.
* `DELETE /api/subscriptions/:id` - Remove a subscription from the user's account.

### Dashboard & Analytics
* `GET /api/dashboard/summary` - Returns aggregated financial data (monthly spend, upcoming renewals, trials ending soon).
* `GET /api/dashboard/upcoming` - Returns a list of subscriptions renewing in the next 30 days.
* `GET /api/analytics/spend-by-category` - Groups spending into categories (e.g., Cloud, Streaming).
* `GET /api/analytics/spend-over-time` - Historical 6-month view of subscription costs.

### Utility
* `GET /api/notifications` - Calculates and returns actionable alerts (e.g., "Figma trial expires in 2 days").
* `GET /api/subscriptions/export` - Downloads the user's subscription data as a CSV file.

---

## 🚀 Local Development Setup

### 1. Install Dependencies
Make sure you have Node.js and `pnpm` installed.
```bash
pnpm install
```

### 2. Environment Variables
Ensure your root `.env` file contains your Supabase credentials and active ports:
```env
PORT=8081
FRONTEND_PORT=19318
BASE_PATH="/"
DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
SUPABASE_URL="https://[ID].supabase.co"
SUPABASE_ANON_KEY="eyJhb..."
```

### 3. Run the Backend API
```bash
npx pnpm --filter @workspace/api-server run start
```

### 4. Run the Frontend App
```bash
npx pnpm --filter @workspace/frontend run dev
```

---

## 🤖 Future AI Roadmap (LLM Integration)

To elevate X Subscription from a traditional SaaS to an intelligent, agentic platform, we integrate **Google Gemini 2.5 Pro** directly into the application flow. 

**Upcoming AI Features:**
1. **Invoice Parsing Agent (Vision AI):**
   * Users can upload a PDF or screenshot of an invoice/receipt.
   * Gemini's multimodal capabilities will instantly extract the Service Name, Price, Billing Cycle, and Trial End Date, auto-filling the "New Subscription" form.
2. **Predictive Financial Insights:**
   * An LLM agent running in the background will analyze the user's `$ spend-over-time` analytics to predict future churn probability or alert the user to irregular price hikes in specific software sectors.
3. **Automated Cancellation Workflows:**
   * An intelligent assistant that helps users automatically navigate the complicated cancellation flows of platforms like Adobe or Gym memberships.
4. **Smart Categorization:**
   * When a user types "GitHub Copilot", Gemini will automatically categorize it as `Developer Tools` and suggest average market pricing based on current trends.
