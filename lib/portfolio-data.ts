// Content for the portfolio page, ported from the Claude Design file Portfolio.dc.html.

export type NavItem = { id: string; label: string };
export type Tech = { name: string; img: string };
export type TechGroup = {
  code: string;
  title: string;
  desc: string;
  items: Tech[];
};
export type Project = {
  name: string;
  role: string;
  logo?: string;
  images: string[];
  tags: string[];
  blurb: string;
  summary: string;
  responsibilities: string[];
  highlights: string[];
};

export const NAV: NavItem[] = [
  {
    id: "top",
    label: "About me",
  },
  {
    id: "stack",
    label: "Techstack",
  },
  {
    id: "about",
    label: "Expertise",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "contact",
    label: "Contact",
  },
];

export const TECH_GROUPS: TechGroup[] = [
  {
    code: "FE",
    title: "Frontend",
    desc: "Responsive, component-driven interfaces.",
    items: [
      {
        name: "Next.js",
        img: "/next-js.webp",
      },
      {
        name: "React",
        img: "/react-js.webp",
      },
      {
        name: "Tailwind",
        img: "/tailwind-css.webp",
      },
      {
        name: "shadcn/ui",
        img: "/shadcn-ui.webp",
      },
      {
        name: "Mantine UI",
        img: "/mantine.webp",
      },
      {
        name: "Ant Design",
        img: "/ant-design.svg",
      },
      {
        name: "Material UI",
        img: "/mui.webp",
      },
    ],
  },
  {
    code: "BE",
    title: "Backend",
    desc: "APIs, real-time and event-driven services.",
    items: [
      {
        name: "Node.js",
        img: "/node-js.webp",
      },
      {
        name: "NestJS",
        img: "/nest-js.webp",
      },
      {
        name: "Express",
        img: "/express-js.webp",
      },
      {
        name: "Prisma",
        img: "/prisma.webp",
      },
      {
        name: "Socket.io",
        img: "/socket.webp",
      },
      {
        name: "RabbitMQ",
        img: "/rabbitmq.svg",
      },
    ],
  },
  {
    code: "DB",
    title: "Databases",
    desc: "Storage, caching and pub/sub.",
    items: [
      {
        name: "PostgreSQL",
        img: "/postgresql.webp",
      },
      {
        name: "MongoDB",
        img: "/mongo-db.webp",
      },
      {
        name: "Redis",
        img: "/redis.svg",
      },
    ],
  },
  {
    code: "ST",
    title: "State Management",
    desc: "Client and server state.",
    items: [
      {
        name: "TanStack",
        img: "/tanstack.webp",
      },
      {
        name: "Redux",
        img: "/redux.webp",
      },
      {
        name: "Zustand",
        img: "/zustand.webp",
      },
    ],
  },
  {
    code: "OP",
    title: "DevOps & Cloud",
    desc: "Containers, servers and cloud services.",
    items: [
      {
        name: "Docker",
        img: "/docker.webp",
      },
      {
        name: "Ubuntu",
        img: "/ubuntu.webp",
      },
      {
        name: "AWS S3",
        img: "/aws-s3.webp",
      },
      {
        name: "AWS EC2",
        img: "/aws-ec2.webp",
      },
      {
        name: "Firebase",
        img: "/firebase.webp",
      },
      {
        name: "Amazon KMS",
        img: "/aws-kms.webp",
      },
    ],
  },
  {
    code: "TL",
    title: "Tools & Others",
    desc: "Workflow, media and AI.",
    items: [
      {
        name: "Git",
        img: "/git.webp",
      },
      {
        name: "WebRTC",
        img: "/web-rtc.webp",
      },
      {
        name: "Claude",
        img: "/claude.svg",
      },
      {
        name: "MetaMask",
        img: "/metamask.webp",
      },
      {
        name: "Phantom",
        img: "/phantom.webp",
      },
      {
        name: "TON",
        img: "/ton.webp",
      },
    ],
  },
];

export const TECH_DESCRIPTIONS: Record<string, string> = {
  "Next.js":
    "React framework powering SSR, SSG, and file-based routing for production-grade web apps with optimal performance.",
  React:
    "Declarative UI library for building component-driven web and cross-platform mobile applications.",
  Tailwind:
    "Utility-first CSS framework for building custom, responsive UIs with speed and design consistency.",
  "shadcn/ui":
    "Accessible, composable component library built on Radix UI primitives and styled with Tailwind CSS.",
  "Mantine UI":
    "Full-featured React component library with built-in hooks, accessibility, and comprehensive theming support.",
  "Ant Design":
    "Enterprise-grade React UI system with a rich component set and a comprehensive design language.",
  "Material UI":
    "Google Material Design–based React component library for building polished, consistent web interfaces.",
  "Node.js":
    "JavaScript runtime built on V8 for scalable, non-blocking server-side and network applications.",
  NestJS:
    "Progressive Node.js framework with modular architecture and built-in support for DI, guards, and pipes.",
  Express:
    "Minimalist, unopinionated web framework for Node.js with fast routing and flexible middleware composition.",
  Prisma:
    "Type-safe ORM with an intuitive schema, auto-generated client, and first-class database migration support.",
  "Socket.io":
    "Real-time bidirectional communication library enabling live data streaming and collaborative features.",
  RabbitMQ:
    "Message broker enabling reliable, asynchronous event-driven communication between distributed services.",
  PostgreSQL:
    "Powerful open-source relational database with advanced SQL, JSONB support, and strong ACID compliance.",
  MongoDB:
    "NoSQL document database built for flexible schema design and high-volume read/write operations.",
  Redis:
    "In-memory data store used for caching, session management, and real-time pub/sub messaging.",
  TanStack:
    "Powerful headless toolkit covering data fetching (Query), tables (Table), and virtual scrolling (Virtual).",
  Redux:
    "Predictable state container with Redux Toolkit for scalable, maintainable application state management.",
  Zustand:
    "Minimalist, high-performance global state library with a simple hook-based API for React.",
  Docker:
    "Container platform for packaging, shipping, and running apps consistently across any environment.",
  Ubuntu:
    "Linux distribution used for cloud server provisioning, deployment, and infrastructure management.",
  "AWS S3":
    "Scalable object storage for static files, media assets, and application data with high durability.",
  "AWS EC2":
    "Cloud compute service for deploying, scaling, and managing virtual server infrastructure on AWS.",
  Firebase:
    "Google's backend platform for real-time database, authentication, hosting, and serverless cloud functions.",
  "Amazon KMS":
    "Managed encryption key service for securing data at rest and in transit across AWS services.",
  Git: "Distributed version control for branching, code review, and collaborative development workflows.",
  WebRTC:
    "Browser-native API for real-time peer-to-peer audio, video, and data streaming without plugins.",
  Claude:
    "Anthropic's AI model integrated to deliver intelligent, context-aware features within modern applications.",
  MetaMask:
    "Browser wallet for connecting to EVM networks, signing transactions and authenticating users in dApps.",
  Phantom:
    "Multi-chain wallet for Solana, used to connect, sign and send transactions from web and mobile apps.",
  TON: "The Open Network wallet integration for TON authentication, transaction verification and on-chain interactions.",
};

export const PROJECTS: Project[] = [
  {
    name: "FC Văn Phú Reborn",
    role: "Fullstack Developer",
    logo: "/project-images/van-phu-reborn/logo.webp",
    images: [
      "/project-images/van-phu-reborn/01-hero.webp",
      "/project-images/van-phu-reborn/02-chatbot.webp",
      "/project-images/van-phu-reborn/03-squad.webp",
      "/project-images/van-phu-reborn/04-squad-picker.webp",
      "/project-images/van-phu-reborn/05-nextmatch-weather.webp",
      "/project-images/van-phu-reborn/06-history.webp",
      "/project-images/van-phu-reborn/07-squad-picker-final.webp",
    ],
    tags: ["React 19", "Vite SSR", "AI SDK", "Vercel"],
    blurb:
      "Bilingual football club site with an AI assistant chatbot, SSR-prerendered SEO, and a drag-and-drop lineup builder for members.",
    summary:
      "A bilingual (VI/EN) fan site for FC Văn Phú Reborn, built in React 19 with a custom Vite SSR pipeline that prerenders every route per language into static HTML for crawlers and social link previews. Shipped an on-site AI chatbot (Vercel AI SDK + OpenRouter) that answers visitor questions grounded in the club's own data, plus a members-only drag-and-drop squad/lineup picker and live match-day weather.",
    responsibilities: [
      "Built a streaming AI chatbot: Vercel AI SDK `streamText` over OpenRouter with multi-key and multi-model fallback, per-IP rate limiting, request-size/body guards, UI-message validation, and a hand-built knowledge base (club facts, squad, schedule, timeline) injected into the system prompt so answers stay grounded instead of hallucinated.",
      "Wrote the chat request/response pipeline as a plain Web Request→Response handler shared verbatim between the Vercel serverless function (api/chat.ts) and the Vite dev server middleware, so local dev and production run identical logic.",
      "Built a custom React SSR + prerendering pipeline (vite build --ssr + a Node prerender script) that bakes per-language, per-route static HTML, injects per-page <head> SEO tags, and generates sitemap.xml/robots.txt with hreflang alternates directly from the router's route table, failing the build if a route is missing its Vercel rewrite.",
      "Implemented a members-only drag-and-drop lineup picker (dnd-kit) with a formation pitch, roster panel, pointer-based custom drag ghost, and a hashed-access-key gate that keeps the real secret out of the client bundle.",
      "Built the live match section: next-kickoff scheduling logic and an Open-Meteo weather forecast hook showing conditions for the exact kickoff time.",
      "Performance-tuned the build: route-level code splitting with retrying lazy imports, manual vendor chunking (react/react-dom/router, swiper) for long-term browser caching, and an image pipeline that converts assets to WebP and prunes superseded PNG/JPG originals from the deploy.",
      "Built animated UI sections (hero, history timeline/story map, memories, highlights, squad cards) with scroll-reveal, parallax, tilt, and particle/meteor effects, plus i18n via a language context and bilingual content dictionaries.",
      "Covered chat guards, rate limiting, key parsing, weather, lineup, and typewriter/reveal logic with Vitest unit tests.",
    ],
    highlights: [
      "Vercel AI SDK streaming chatbot grounded on custom knowledge base",
      "Multi-key/multi-model fallback + per-IP rate limiting for a free-tier LLM API",
      "Custom React SSR prerendering for per-language SEO (sitemap, hreflang, meta tags)",
      "Shared handler code between Vercel serverless function and Vite dev middleware",
      "Drag-and-drop lineup builder with dnd-kit and a hashed members-only access gate",
      "Vendor chunking, lazy-loaded routes, and WebP image pipeline for performance",
      "Bilingual (VI/EN) content and routing",
      "Vitest unit tests across chat safety logic, weather, and lineup",
    ],
  },

  {
    name: "Fast Food Shop",
    role: "Fullstack Developer",
    logo: "/project-images/yo-food/logo.webp",
    images: [
      "/project-images/yo-food/01-home.webp",
      "/project-images/yo-food/02-menu.webp",
      "/project-images/yo-food/03-product-detail.webp",
      "/project-images/yo-food/04-checkout.webp",
      "/project-images/yo-food/05-order-tracking.webp",
      "/project-images/yo-food/06-admin-dashboard.webp",
      "/project-images/yo-food/07-ai-assistant.webp",
      "/project-images/yo-food/08-storefront.webp",
      "/project-images/yo-food/09-menu-filters.webp",
      "/project-images/yo-food/10-payment-pending.webp",
      "/project-images/yo-food/11-order-history.webp",
      "/project-images/yo-food/12-reviews.webp",
      "/project-images/yo-food/13-wallet-payment.webp",
      "/project-images/yo-food/14-payment-confirmed.webp",
      "/project-images/yo-food/15-admin-order-status.webp",
      "/project-images/yo-food/16-order-notifications.webp",
      "/project-images/yo-food/18-account.webp",
    ],
    tags: [
      "NextJS",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Socket.IO",
      "Stripe",
      "Viem",
      "SendGrid Mail",
      "OpenRouter AI SDK",
      "TanStack Query",
    ],
    blurb:
      "Full-stack fast-food ordering platform with Google/wallet/2FA auth, Stripe and on-chain crypto payments, real-time order tracking, and an SSE-streamed AI shopping assistant.",
    summary:
      "A two-repo ordering platform: a Next.js 16 storefront with an admin console, and a NestJS 11 API. The backend is organized into domain modules and covers passwordless and multi-factor auth, a Redis-backed cart, Stripe and EVM payments, and a dedicated block-scanner process that confirms on-chain transactions. Events flow through RabbitMQ to email and order-status consumers and through Socket.IO to live order and chat channels. The frontend adds a live admin analytics dashboard, a real-time leaderboard, and an AI assistant that streams answers over SSE. The backend assistant uses an OpenRouter key pool with retry and daily budget breakers.",
    responsibilities: [
      "Designed and built the NestJS backend as domain modules (identity, catalog, commerce, payments, notifications, chat, admin, uploads, assistant) with DTO validation, Swagger docs, and Docker Compose for dev and production.",
      "Implemented auth across several flows: Google OAuth 2.0, Ethereum wallet sign-in, JWT, and TOTP two-factor authentication with QR setup.",
      "Built the payment layer: Stripe checkout, EVM payments verified by a separate block-scanner process (a nest-commander CLI) with logic that updates orders.",
      "Designed the event pipeline on RabbitMQ with consumers for transactional email (SendGrid) and order and payment events, plus Socket.IO gateways for live order tracking and chat.",
      "Developed the AI shopping assistant backend: an SSE streaming endpoint over the Vercel AI SDK and OpenRouter, a multi-key pool with retry before the first token, a per-key daily call breaker, per-IP and concurrency limits, and Redis-backed conversation history that sanitizes untrusted input.",
      "Separated the assistant's tools by access level, with a guest tier for public catalog lookup and an authenticated tier for cart and order actions.",
      "Built the Next.js App Router storefront with a feature-sliced structure (api, hooks, lib, components, types per domain), TanStack Query for server state, Zustand for the cart, and react-hook-form with Zod validation.",
      "Built the admin console: product and category management with media upload, order status control, rider management, and a Recharts analytics dashboard with date-range presets.",
      "Implemented the real-time public leaderboard and the wallet-based payment flow on the client, including on-chain balance checks with ethers.",
      "Added the animated UI: GSAP scroll effects, a draggable AI assistant mascot, a three.js order-flow scene, and a Tiptap rich-text editor for notes.",
      "Wrote Jest suites for the backend assistant, payment, identity, and commerce services, and Vitest suites for frontend stores, schemas, SSE parsing, and analytics logic.",
    ],
    highlights: [
      "Multi-rail payments: Stripe, EVM on-chain verification via a separate block-scanner process",
      "Passwordless and multi-factor auth: Google OAuth, Ethereum wallet signature, and TOTP 2FA",
      "Event-driven backend on RabbitMQ with Socket.IO for live order tracking and chat",
      "AI assistant with SSE streaming, multi-key OpenRouter failover, daily budget breakers, and guest/auth tool tiers",
      "Redis-backed cart and conversation history",
      "Domain-driven NestJS architecture with Prisma 7, Docker Compose dev and prod setups",
      "Next.js 16 App Router storefront with a feature-sliced frontend and TanStack Query",
      "Admin analytics dashboard and real-time leaderboard",
    ],
  },

  {
    name: "NextVault",
    role: "Frontend Developer",
    logo: "/project-images/next-vault/logo.webp",
    images: [
      "/project-images/next-vault/1.webp",
      "/project-images/next-vault/2.webp",
      "/project-images/next-vault/3.webp",
      "/project-images/next-vault/4.webp",
      "/project-images/next-vault/5.webp",
      "/project-images/next-vault/6.webp",
      "/project-images/next-vault/7.webp",
      "/project-images/next-vault/8.webp",
      "/project-images/next-vault/9.webp",
      "/project-images/next-vault/10.webp",
    ],
    tags: ["ReactJs", "Privy", "Base / USDC"],
    blurb:
      "Web3 auction platform for tokenized real-world assets; built the user marketplace and admin back office in ReactJs.",
    summary:
      "NextVault is a Web3 auction platform for tokenized real-world assets, where collectors bid in USDC on Base and hold NFT-based fractional ownership. Built both frontends in React 19 with TypeScript: the user-facing marketplace and the admin back office. The work covers consignment, auctions, wallet authentication, on-chain bidding and withdrawals, and platform administration.",
    responsibilities: [
      "Built the user-facing marketplace and admin applications in ReactJs with TanStack Router and TanStack Query, giving collectors and platform operators separate, purpose-built experiences.",
      "Integrated Privy in the user app for login, email and social sign-in, embedded wallets, and an MFA gate, so users can start bidding without setting up a wallet first.",
      "Implemented on-chain bidding on Base: USDC allowance approval, placing bids, revoking unused allowance, and withdrawals with gas-fee handling.",
      "Built NFT fractional ownership views, including refund claims that burn NFTs in exchange for USDC.",
      'Built auction browsing, auction detail, results, and "my auctions" pages, plus a winnings view and activity history.',
      "Built consignment flows for asset owners: create, edit, detail, and application tracking.",
      "Built admin tooling for consignment review across specialist, decisioner, and consignor roles, auction creation and management, and business-rule and fee configuration.",
      "Built admin CMS for FAQs, homepage, and legal documents, plus whitelists, blacklists, user management, activity logs, and 2FA authenticator setup.",
    ],
    highlights: [
      "ReactJs user and admin applications",
      "Privy embedded wallets and social login (user app)",
      "On-chain USDC bidding and payments on Base (mainnet and Base Sepolia)",
      "Real-world asset (RWA) tokenization and NFT fractional ownership",
      "TanStack Query and Zustand state management",
      "shadcn/ui-style component architecture",
      "UI animation with Motion (framer-motion) on the user app",
    ],
  },

  {
    name: "Bullbit",
    role: "Fullstack Developer",
    logo: "/project-images/bullbit/logo.webp",
    images: [
      "/project-images/bullbit/1.webp",
      "/project-images/bullbit/2.webp",
      "/project-images/bullbit/3.webp",
      "/project-images/bullbit/4.webp",
      "/project-images/bullbit/5.webp",
      "/project-images/bullbit/6.webp",
      "/project-images/bullbit/7.webp",
      "/project-images/bullbit/8.webp",
      "/project-images/bullbit/9.webp",
      "/project-images/bullbit/mb-1.webp",
      "/project-images/bullbit/mb-2.webp",
      "/project-images/bullbit/mb-3.webp",
      "/project-images/bullbit/mb-4.webp",
      "/project-images/bullbit/mb-5.webp",
    ],
    tags: [
      "React 19",
      "TanStack Start",
      "WebSocket",
      "TradingView",
      "Zustand",
      "React Native",
      "Expo SDK 55",
      "TypeScript",
      "TanStack Query",
      "Crypto Trading",
    ],
    blurb:
      "Crypto exchange with spot and futures trading; built the TanStack Start trading frontend with real-time market data and TradingView charts.",
    summary:
      "Bullbit is a cryptocurrency exchange offering spot and futures trading, wallet management, earn and staking, and account security, running on the CRX Network trading platform (Peatio trading engine and Barong identity). Built the web frontend in React 19 with TanStack Start (SSR) and TanStack Router, streaming live prices, order books and trades over WebSocket and SSE, with TradingView charts for spot and futures markets. Also built the companion mobile app in React Native and Expo (SDK 55), with a dual Ranger WebSocket feed for public market data and private order and trade events, biometric unlock, and session restore from SecureStore.",
    responsibilities: [
      "Built the exchange frontend in React 19 and TanStack Start with file-based routing, covering spot and futures trading, balances (deposit, withdraw, transfer, transaction history) and account screens.",
      "Integrated real-time market data over a WebSocket feed and server-sent events, streaming prices, candlesticks, recent trades and order-book depth into the trading views.",
      "Implemented TradingView charting with custom datafeeds for spot and futures k-line data, plus order-book visualization driven by a Zustand store.",
      "Implemented 2FA setup with QR codes and OTP entry, security-level display, and CSRF token handling on API requests.",
      "Built the admin panel for managing users, currencies, markets, wallets, deposits, withdrawals and orders.",
      "Managed server state with TanStack Query and global client state with Zustand, with forms built on React Hook Form and Zod.",
      "Connected the frontend to Barong and Peatio backend services through a typed Axios client, and localized the UI with i18next in English, Korean, Russian and Chinese.",
      "Configured Vite 8 builds and Vercel deployment.",
    ],
    highlights: [
      "React 19 and TanStack Start (SSR) trading interfaces",
      "Real-time market data over WebSocket and SSE",
      "TradingView charts and order-book visualization",
      "2FA with QR setup and CSRF-protected API requests",
      "Admin panel for users, markets, wallets and orders",
      "TanStack Query and Zustand state management",
      "Vite 8 build and Vercel deployment",
      "UI animation with Motion (Framer Motion)",
      "Real-time order book and trade streams with incremental updates",
      "Session restore on launch: hydrate from SecureStore, then validate with the server in the background",
      "Android APK and AAB builds through EAS profiles and a local Gradle release build",
    ],
  },
  {
    name: "Mekong Cert",
    role: "Front-end Developer",
    logo: "/project-images/mekong-cert/logo.png",
    images: [
      "/project-images/mekong-cert/1.jpg",
      "/project-images/mekong-cert/2.jpg",
      "/project-images/mekong-cert/3.jpg",
      "/project-images/mekong-cert/4.jpg",
    ],
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "React Query",
      "Claude Code",
    ],
    blurb:
      "End-to-end agricultural certification platform (client portal + internal operations system) covering a 5-department testing workflow — shipped in 2 weeks with Claude Code–assisted development.",
    summary:
      "Mekong Cert is a full agricultural certification ecosystem — a LIMS-like internal operations platform paired with a customer-facing portal — that digitizes the complete fruit quality testing lifecycle, from the farmer's export/import request through sampling, lab testing, result issuance and payment reconciliation across 5 internal departments. Delivered both apps end-to-end in just 2 weeks by pairing deep domain modeling with heavy Claude Code–assisted engineering — translating a dense, highly regulated agricultural business process into clean, maintainable Next.js 16 / React 19 code without sacrificing quality.",
    responsibilities: [
      "Owned both frontends end-to-end — the client portal (request submission, registration tracking, document upload, payment) and the internal operations system (user/customer/sampling staff/payment-account CRUD, department queues, approvals, reporting) — delivered as a cohesive product in 2 weeks.",
      "Modeled a complex multi-actor workflow spanning 5 departments and 14+ registration states into a predictable status machine, so every request moves through sampling → testing → result → payment with correct permissions and audit trails at each hop.",
      "Engineered a resilient JWT auth layer: silent token refresh, a request-queue interceptor that holds in-flight calls during refresh and replays them, protected routes with automatic unauthorized redirect, and granular role-based access per department.",
      "Built S3 presigned-url upload flows for test registrations, sampling forms and legal documents, with secure handling of sensitive agricultural export/import paperwork.",
      "Integrated payment transaction tracking, account management and reconciliation reporting that the finance department uses to close out certification cases.",
      "Delivered multi-step registration forms with Zod validation, Vietnamese-localized UX and friendly error states tailored to non-technical lab and sampling staff.",
      "Leveraged Claude Code throughout the build — spec-to-code scaffolding, refactors, test generation and code review — to compress a normally multi-month back-office buildout into a 2-week delivery while keeping TypeScript strict mode green.",
      "Tuned the data layer with Zustand for client state and React Query for server state (cache, invalidation, optimistic updates) so dense admin tables and department queues stay instant under heavy use.",
    ],
    highlights: [
      "2-week end-to-end delivery of a dual-app (customer portal + internal operations system) certification platform",
      "AI-accelerated development with Claude Code at every stage of the pipeline",
      "5 independent department workflows unified by one status machine (14+ states)",
      "JWT auth with silent refresh, request queuing and automatic retry",
      "Role-based access control with department-level permission granularity",
      "S3 presigned-url document uploads for regulated agricultural paperwork",
      "Payment transaction tracking and finance-grade reconciliation reporting",
      "Vietnamese-localized multi-step forms with Zod validation",
      "Next.js 16 + React 19, TypeScript strict mode, Zustand + React Query",
    ],
  },

  {
    name: "DreamFly",
    role: "Frontend Developer",
    logo: "/project-images/dream-fly/logo.svg",
    images: [
      "/project-images/dream-fly/1.webp",
      "/project-images/dream-fly/2.webp",
      "/project-images/dream-fly/3.webp",
      "/project-images/dream-fly/4.webp",
      "/project-images/dream-fly/5.webp",
      "/project-images/dream-fly/6.webp",
      "/project-images/dream-fly/7.webp",
      "/project-images/dream-fly/8.webp",
      "/project-images/dream-fly/9.webp",
    ],
    tags: ["Next.js", "SEO", "Admin CMS"],
    blurb:
      "Travel lottery platform with international trips as prizes; built the customer site and admin CMS in Next.js.",
    summary:
      "DreamFly is a travel lottery platform where users buy tickets for a chance to win international trips, with winners drawn at random. Built both the customer-facing site and the admin CMS, covering social login, ticket purchasing, SEO and campaign management.",
    responsibilities: [
      "Built the customer-facing site and the admin CMS, covering the full flow from ticket purchase to winner selection.",
      "Implemented ticket purchasing, account management and prize participation flows, designed for conversion and engagement.",
      "Implemented authentication with email/password, Google and Facebook login.",
      "Built admin dashboards for managing users, campaigns, tickets and winner selection.",
      "Optimized SEO structure and frontend performance to improve search visibility and page experience.",
      "Worked with backend teams on real-time campaign and ticket management, and contributed to Docker-based deployment and environment configuration.",
    ],
    highlights: [
      "Next.js customer site and admin CMS",
      "SEO-focused frontend architecture",
      "Google and Facebook social login",
      "Ticket purchasing and checkout flows",
      "Conversion-focused responsive design",
      "Zustand and TanStack Query state management",
      "Docker-based deployment",
    ],
  },
  {
    name: "Interra",
    role: "Frontend Developer",
    logo: "/project-images/interra/logo.svg",
    images: [
      "/project-images/interra/full.webp",
      "/project-images/interra/1.webp",
      "/project-images/interra/2.webp",
      "/project-images/interra/3.webp",
    ],
    tags: ["React", "TanStack", "Solana / EVM"],
    blurb:
      "Multi-chain trading terminal for Solana and EVM chains; built the React frontend for high-volume real-time data.",
    summary:
      "Interra is a multi-chain crypto trading terminal for trading assets across Solana, BNB Chain, Ethereum, Arbitrum and other EVM-compatible networks through system-managed wallets. Built the React trading frontend, with a focus on keeping the UI fast under constant real-time socket updates and large data sets.",
    responsibilities: [
      "Built the React trading frontend for a terminal spanning Solana, BNB Chain, Ethereum, Arbitrum and other EVM chains.",
      "Engineered real-time interfaces that handle large socket data streams and frequent UI updates without slowing down the trading view.",
      "Optimized rendering for large token tables, transaction histories and live trading activity using TanStack Virtual and TanStack Table.",
      "Implemented wallet connection flows for Solana with @solana/wallet-adapter and for EVM chains with Reown AppKit.",
      "Integrated backend APIs for token trading, wallet interactions, market data and portfolio management, working with backend and blockchain teams on cross-chain trading flows.",
      "Designed and maintained a responsive trading dashboard UI.",
    ],
    highlights: [
      "React trading terminal UI",
      "Real-time socket-based trading updates",
      "List virtualization with TanStack Virtual",
      "Data tables with TanStack Table",
      "TanStack Query and Zustand state management",
      "Solana wallet integration with @solana/wallet-adapter",
      "EVM wallet integration with Reown AppKit",
      "Rendering performance optimization",
    ],
  },
  {
    name: "HoofDAO",
    role: "Frontend Developer",
    logo: "/project-images/hoofdao/logo.webp",
    images: [
      "/project-images/hoofdao/8.webp",
      "/project-images/hoofdao/7.webp",
      "/project-images/hoofdao/1.webp",
      "/project-images/hoofdao/2.webp",
      "/project-images/hoofdao/full.webp",
      "/project-images/hoofdao/4.webp",
      "/project-images/hoofdao/5.webp",
      "/project-images/hoofdao/6.webp",
    ],
    tags: ["React", "viem", "NestJS"],
    blurb:
      "Horse racing prediction platform with NFTs on BNB Chain; built the React app and admin CMS plus NestJS APIs.",
    summary:
      "HoofDAO is a decentralized horse racing prediction platform on BNB Chain, with a web application and an admin CMS for managing NFT assets, race predictions, financial operations and user activity. Built the React web app and admin CMS, and also developed NestJS APIs for item management and admin features.",
    responsibilities: [
      "Built the main web application and admin CMS in React, including dashboards for users, NFT assets, race predictions and platform operations.",
      "Implemented multilingual support for users in more than 10 countries.",
      "Integrated JWT authentication and role-based access control so admin users only see the tools their role allows.",
      "Developed backend REST APIs with NestJS and Prisma for item management, CMS operations and admin features.",
      "Integrated BNB Chain interactions on the frontend using viem.",
      "Worked with backend and blockchain teams to connect the web app and CMS to the platform’s decentralized workflows.",
    ],
    highlights: [
      "React web app and admin CMS",
      "Internationalization (i18n) for 10+ countries",
      "JWT authentication and role-based access control",
      "BNB Chain integration with viem",
      "REST API development with NestJS and Prisma",
      "Zustand and TanStack Query state management",
      "shadcn/ui component architecture",
    ],
  },

  {
    name: "Regent Reserve",
    role: "Frontend Developer",
    logo: "/project-images/regent-reserve/logo.webp",
    images: [
      "/project-images/regent-reserve/7.webp",
      "/project-images/regent-reserve/8.webp",
      "/project-images/regent-reserve/9.webp",
      "/project-images/regent-reserve/1.webp",
      "/project-images/regent-reserve/2.webp",
      "/project-images/regent-reserve/3.webp",
      "/project-images/regent-reserve/4.webp",
      "/project-images/regent-reserve/5.webp",
      "/project-images/regent-reserve/6.webp",
    ],
    tags: ["Next.js", "React 19", "Booking APIs"],
    blurb:
      "Premium hotel and flight booking platform; built the Next.js booking site, admin CMS, and high-volume flight search.",
    summary:
      "Regent Reserve is a premium booking ecosystem for hotel and flight reservations, with membership, voucher, and account management. Built both the customer-facing booking platform and the admin CMS in Next.js, including flight search over large, highly dynamic third-party provider data.",
    responsibilities: [
      "Built complex flight search and booking interfaces in Next.js on top of third-party provider APIs, covering search, filtering, and checkout.",
      "Engineered business logic for large-scale, highly dynamic flight data so pricing, schedules, and booking details stay accurate.",
      "Optimized rendering of heavy datasets and real-time UI updates with React 19 useTransition and memoization, keeping search and filtering responsive.",
      "Delivered both the customer booking platform and the admin CMS, giving operators tools to manage reservations, members, and accounts.",
      "Integrated membership, voucher, and account management workflows into the booking journey.",
      "Managed client and server state with Zustand and TanStack Query for smooth booking flows and filtering.",
      "Worked with backend and third-party service providers to keep booking operations reliable.",
    ],
    highlights: [
      "Next.js booking platform and admin CMS",
      "React 19 useTransition and memoization",
      "Third-party flight provider API integration",
      "Large-scale dynamic data processing",
      "State management with Zustand",
      "Server-state handling with TanStack Query",
      "Complex flight booking workflows",
      "Membership and voucher systems",
    ],
  },
  {
    name: "Ponz",
    role: "Frontend Developer",
    logo: "/project-images/ponz/logo.svg",
    images: [
      "/project-images/ponz/1.webp",
      "/project-images/ponz/2.webp",
      "/project-images/ponz/4.webp",
      "/project-images/ponz/5.webp",
      "/project-images/ponz/6.webp",
      "/project-images/ponz/7.webp",
      "/project-images/ponz/8.webp",
    ],
    tags: ["React", "WebSocket", "Solana", "Mantine UI", "TradingView"],
    blurb:
      "Real-time Solana social trading platform; built the React frontend for token creation, trading, and live chat.",
    summary:
      "Ponz is a real-time Web3 social trading platform on Solana where users create custom tokens, engage with communities, and trade assets with built-in rewards. Owned the core React frontend, real-time WebSocket features, and TradingView charting, and also implemented supporting backend features for profiles and social interactions.",
    responsibilities: [
      "Owned the core React frontend for token creation, trading, and community engagement on Solana.",
      "Built real-time chat, live updates, and token activity feeds over WebSocket, so traders see market and community activity as it happens.",
      "Integrated TradingView charts for real-time market visualization inside the trading dashboard.",
      "Implemented backend features for profile management, token interactions, and social functionality, including chat and stickers.",
      "Built Web3 workflows for Solana-based transaction interactions from the trading UI.",
      "Delivered responsive, interactive UI across token creation, trading, and community screens.",
      "Integrated AWS S3 cloud storage for user and token assets.",
    ],
    highlights: [
      "React trading dashboard",
      "Real-time communication with WebSocket",
      "TradingView chart integration",
      "Solana transaction workflows",
      "Social features: chat and stickers",
      "Cloud asset storage with AWS S3",
    ],
  },
  {
    name: "Node Farm",
    role: "Backend Developer",
    images: [
      "/project-images/node-farm/4.webp",
      "/project-images/node-farm/3.webp",
      "/project-images/node-farm/2.webp",
      "/project-images/node-farm/1.webp",
    ],
    tags: ["TON", "Telegram Mini App", "Redis"],
    blurb:
      "Telegram Mini App reward platform with NFT staking and TON rewards; designed and built the entire backend.",
    summary:
      "Node Farm is a decentralized reward platform inside Telegram Mini Apps where users buy NFT-based assets, stake them into reward pools, and earn daily TON rewards. Designed and built the entire backend, from TON wallet authentication and on-chain transaction scanning to staking pools and automated reward distribution.",
    responsibilities: [
      "Architected and built the entire backend for a Telegram Mini App reward platform.",
      "Engineered TON blockchain transaction scanning and wallet monitoring services that detect on-chain activity and drive platform workflows.",
      "Implemented staking pools and automated reward distribution logic for daily TON-based rewards.",
      "Built Telegram Mini App authentication with TON wallet verification, plus secure session handling.",
      "Delivered item purchasing, extension, and reward management workflows for NFT-based assets.",
      "Optimized backend performance with Redis caching and real-time socket communication.",
      "Integrated Telegram Bot services for user notifications and platform interactions.",
    ],
    highlights: [
      "TON blockchain integration",
      "On-chain transaction scanning and wallet monitoring",
      "Staking pools and automated reward distribution",
      "Telegram Mini App authentication with TON wallet verification",
      "Redis caching strategies",
      "Event-driven backend workflows",
      "Telegram Bot integration",
    ],
  },
  {
    name: "DFantasy",
    role: "Backend Developer",
    logo: "/project-images/dfantasy/logo.svg",
    images: [
      "/project-images/dfantasy/2.webp",
      "/project-images/dfantasy/1.webp",
      "/project-images/dfantasy/3.webp",
    ],
    tags: ["Node.js", "Redis", "Cron Jobs"],
    blurb:
      "Fantasy football platform on Web, Mobile and Telegram; built the Node.js backend, data sync and Redis caching.",
    summary:
      "A fantasy football platform inspired by Fantasy Premier League, available on Web, Mobile and as a Telegram Mini App with real-time game synchronization. Owned backend services for gameplay, scheduled Fantasy Premier League data sync, player statistics and rankings, plus the Telegram integrations.",
    responsibilities: [
      "Built backend services and APIs in Node.js for gameplay and user interactions, serving the Web, Mobile and Telegram Mini App clients.",
      "Engineered automated Fantasy Premier League data synchronization with scheduled cron jobs, keeping player and game data current without manual updates.",
      "Implemented backend logic for player statistics, team management and ranking systems, designed to scale with gameplay activity.",
      "Integrated Redis caching for frequently accessed game data, improving API performance.",
      "Delivered the backend for the Telegram Mini App and Telegram bot integrations, extending the product into the Telegram ecosystem.",
      "Implemented real-time game data processing so scores and standings stay in sync across platforms.",
    ],
    highlights: [
      "Node.js backend APIs",
      "Cron job data synchronization",
      "Real-time game data processing",
      "Redis caching",
      "Telegram Mini App and bot integration",
      "Ranking and statistics engine",
      "Multi-platform backend (Web, Mobile, Telegram)",
    ],
  },
  {
    name: "Seagate",
    role: "Frontend Developer",
    logo: "/project-images/seagate/logo.webp",
    images: ["/project-images/seagate/1.webp"],
    tags: ["Next.js", "Zustand", "Web3"],
    blurb:
      "Web3 investment platform for DePIN Initial Package Offerings; built the Next.js frontend and investor dashboards.",
    summary:
      "Seagate is a decentralized investment platform for launching Initial Package Offerings (IPOs) for DePIN projects through Web3-powered investment workflows. Owned the Next.js frontend, from investment dashboards and authentication to token-facing interfaces, working alongside backend and blockchain integrations.",
    responsibilities: [
      "Owned the frontend application in Next.js, delivering the end-to-end investment experience for DePIN project offerings.",
      "Built responsive investment dashboards and reusable UI components so investors can follow offerings and holdings on any device.",
      "Implemented authentication flows and security integrations to protect user accounts and investment actions.",
      "Engineered investment workflow logic and client state with Zustand, keeping multi-step investment flows consistent across the app.",
      "Delivered token-related interfaces and QR code utilities supporting Web3 investment actions.",
      "Connected the UI to backend services and blockchain integrations, surfacing live investment data to users.",
    ],
    highlights: [
      "Next.js application architecture",
      "Web3 investment workflows",
      "State management with Zustand",
      "Authentication and security integrations",
      "Responsive investment dashboards",
      "QR code utilities",
      "Token-related UI",
    ],
  },
  {
    name: "EST Edu",
    role: "Full-Stack Developer",
    images: [
      "/project-images/est-edu/full.webp",
      "/project-images/est-edu/est-edu-1.webp",
      "/project-images/est-edu/est-edu-2.webp",
      "/project-images/est-edu/est-edu-8.webp",
      "/project-images/est-edu/est-edu-3.webp",
      "/project-images/est-edu/est-edu-4.webp",
      "/project-images/est-edu/est-edu-5.webp",
      "/project-images/est-edu/est-edu-6.webp",
      "/project-images/est-edu/est-edu-7.webp",
      "/project-images/est-edu/est-edu-9.webp",
    ],
    tags: ["Socket.io", "WebRTC", "AI"],
    blurb:
      "E-learning platform with live video, real-time chat and AI career prediction; built frontend and backend end to end.",
    summary:
      "An interactive e-learning platform combining structured programming courses, real-time chat, live video sessions and AI-powered career prediction. Designed and built both the frontend and backend, from course management and authentication to WebRTC video calls and the MongoDB data model.",
    responsibilities: [
      "Architected and built the full stack, both frontend and backend, covering course delivery, communication and analytics.",
      "Integrated WebRTC video calling for live learning sessions.",
      "Implemented real-time chat and communication features with Socket.io.",
      "Built AI-powered career prediction by integrating machine learning services, giving learners guidance on suitable career paths.",
      "Built course management, lesson management and user authentication systems.",
      "Designed MongoDB database structures and the backend APIs behind every platform feature.",
      "Delivered dashboards, notifications and interactive analytics so users can track learning activity.",
    ],
    highlights: [
      "Full-stack architecture",
      "WebRTC video calling",
      "Socket.io real-time chat",
      "AI-powered career prediction",
      "Machine learning service integration",
      "MongoDB schema design",
      "Interactive analytics dashboards",
      "Authentication and course management",
    ],
  },
  {
    name: "Van Thanh Clinic",
    role: "Backend Developer",
    images: [
      "/project-images/pk-bs-thanh-1.webp",
      "/project-images/pk-bs-thanh-2.webp",
      "/project-images/pk-bs-thanh-3.webp",
      "/project-images/admin-pk-bs-thanh-1.webp",
      "/project-images/admin-pk-bs-thanh-2.webp",
    ],
    tags: ["NestJS", "MongoDB", "Swagger"],
    blurb:
      "Medical clinic landing page and internal CRM; owned the NestJS + MongoDB backend and Swagger-documented APIs.",
    summary:
      "A medical clinic platform made up of a public landing page and an internal CRM for managing articles, banners, doctor profiles and medical content. Owned the backend for both, including API design, MongoDB schemas, authentication and Swagger documentation.",
    responsibilities: [
      "Owned the backend for both the public landing page and the admin CRM, designing and building the RESTful APIs with NestJS.",
      "Designed MongoDB database schemas for articles, banners, doctor information and other medical content.",
      "Built content management features so clinic staff can publish and update articles, banners and doctor profiles.",
      "Implemented authentication and request validation to protect the admin CRM and keep stored data consistent.",
      "Implemented CRUD management workflows for all content types.",
      "Integrated Swagger API documentation, giving frontend developers a clear API reference.",
    ],
    highlights: [
      "NestJS RESTful APIs",
      "MongoDB schema design",
      "Content management system (CMS)",
      "Authentication and validation",
      "CRUD workflows",
      "Swagger API documentation",
    ],
  },
  {
    name: "Bwai Tech",
    role: "Full-Stack Developer",
    images: [
      "/project-images/bwai-tech-1.webp",
      "/project-images/bwai-tech-2.webp",
      "/project-images/bwai-tech-admin-1.webp",
      "/project-images/bwai-tech-admin-2.webp",
      "/project-images/bwai-tech-admin-3.webp",
    ],
    tags: ["Admin CMS", "REST API", "Responsive UI"],
    blurb:
      "Corporate website and admin CMS for products, careers and media; built frontend pages and backend management.",
    summary:
      "A corporate website paired with an admin management system for the company’s products, careers, classes and media content. Built the frontend landing pages and the backend management system, including the admin dashboard and content workflows.",
    responsibilities: [
      "Built the frontend landing pages and the backend management system for the company’s public site.",
      "Delivered admin dashboard features for managing products, careers, classes and videos.",
      "Implemented content management workflows so the team can update site content without code changes.",
      "Implemented CRUD operations and form validation across the admin system.",
      "Worked with the team on responsive UI development and REST API integration across the website and admin dashboard.",
    ],
    highlights: [
      "Admin CMS dashboard",
      "Responsive corporate website",
      "REST API integration",
      "Content management workflows",
      "CRUD operations and form validation",
      "Full-stack web development",
    ],
  },
];

/** Rotating hero taglines, typed out one word per line in the hero card. */
export const HERO_TAGLINES: string[] = [
  "Build Scalable Web Experiences",
  "Ship Real-time Systems",
  "Craft Web3 Platforms",
  "Design Robust NestJS APIs",
  "Pixel-perfect Next.js Interfaces",
];
