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
    ],
    tags: ["Next.js", "Privy", "Base / USDC"],
    blurb:
      "Web3 marketplace for bidding on tokenized real-world assets; built the user and admin apps in Next.js.",
    summary:
      "NextVault is a Web3 platform where collectors bid on fractional allocations of tokenized real-world assets, or buy sole custodianship of them, with bids paid in USDC on Base. Built the frontend for both the user-facing marketplace and the admin application in Next.js, covering consignment, auctions, wallet authentication and on-chain payments.",
    responsibilities: [
      "Built the user-facing marketplace and admin applications in Next.js, giving collectors and platform operators separate, purpose-built experiences.",
      "Implemented auction and bidding interfaces for both fractional allocation bids and sole custodianship purchases.",
      "Engineered on-chain flows through Privy for minting and buying NFTs that unlock bidding rights, placing bids in USDC on Base, and withdrawing funds.",
      "Integrated Privy for embedded wallet creation, social/email login and wallet-based authentication, so users can start bidding without setting up a wallet first.",
      "Built consignment flows that let asset owners submit real-world assets for tokenization and fractionalization.",
      "Delivered asset management dashboards showing owned allocations, consignment status, and transaction and bid history.",
      "Built admin tooling for asset verification and auction oversight, plus account features such as linked email management and profile settings.",
    ],
    highlights: [
      "Next.js user and admin applications",
      "Privy embedded wallets and social login",
      "On-chain USDC bidding and payments on Base",
      "Real-world asset (RWA) tokenization and fractional ownership",
      "Zustand and TanStack Query state management",
      "shadcn/ui component architecture",
      "UI animation with Motion (framer-motion)",
    ],
  },
  {
    name: "Bullbit",
    role: "Full-Stack Developer",
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
    ],
    tags: ["Next.js", "WebSocket", "Microservices"],
    blurb:
      "Crypto exchange with spot and futures trading; built the Next.js trading frontend and maintained backend microservices.",
    summary:
      "Bullbit is a cryptocurrency exchange offering spot and futures trading, wallet management and real-time market data. Built the trading frontend in Next.js and React, integrating live market data over WebSocket, and also maintained and scaled the platform’s microservices backend.",
    responsibilities: [
      "Built the exchange frontend in Next.js and React, covering spot and futures trading, wallet management and account screens.",
      "Integrated real-time market data and trading functions over WebSocket and REST APIs, so traders see prices and order-book changes as they happen.",
      "Implemented TradingView charting and order-book visualization for the trading views.",
      "Implemented secure authentication with 2FA and CSRF protection, along with user profile management and transaction workflows.",
      "Maintained and scaled backend services built on a microservices architecture.",
      "Worked with backend teams to integrate trading services into the frontend, and set up Docker-based deployment and environment configuration.",
    ],
    highlights: [
      "Next.js and React trading interfaces",
      "Real-time market data over WebSocket",
      "TradingView charts and order-book visualization",
      "2FA and CSRF-protected authentication",
      "Microservices backend architecture",
      "Zustand and TanStack Query state management",
      "Docker-based deployment",
      "UI animation with Motion (framer-motion)",
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
    tags: ["React", "WebSocket", "Solana"],
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
