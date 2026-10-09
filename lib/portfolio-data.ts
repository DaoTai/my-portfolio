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
      "Web3 prestige-collecting platform for bidding on fractional allocations of tokenized real-world assets.",
    summary:
      "Tokenize. Fractionalize. Bid & Own. NextVault is a Web3 prestige-collecting platform where users bid on curated fractional allocations or claim sole custodianship of provenance-backed masterpieces and investment-grade real-world assets, spanning both user and admin applications.",
    responsibilities: [
      "Developed the user-facing and admin frontend applications for the tokenized asset marketplace using NextJS.",
      "Built consignment creation flows allowing owners to submit real-world assets for tokenization and fractionalization.",
      "Implemented auction and bidding interfaces supporting both fractional allocation bids and sole custodianship purchases.",
      "Integrated Privy for embedded wallet creation, social/email login, and wallet-based authentication.",
      "Built on-chain interaction flows via Privy for minting/buying NFTs to unlock bidding rights, placing bids in USDC on Base, and withdrawing funds.",
      "Developed asset management dashboards covering owned allocations, consignment status, and transaction/bid history.",
      "Implemented account features including linked email management and profile settings.",
      "Collaborated on admin-side tooling for asset verification, auction oversight, and platform operations.",
    ],
    highlights: [
      "Wallet and embedded-auth integration with Privy",
      "On-chain bidding and payments in USDC on Base",
      "Fractional ownership and consignment workflows",
      "State management with Zustand & TanStack Query",
      "Modern component architecture with shadcn/ui",
      "Fluid UI animations with Motion",
      "Real-world asset (RWA) tokenization platform",
      "Separate user and admin application experiences",
    ],
  },
  {
    name: "Bullbit",
    role: "Software Engineering",
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
      "Crypto exchange with spot and futures trading, wallet management and real-time market data.",
    summary:
      "Bullbit is a cryptocurrency exchange platform that allows users to trade digital assets. It provides a secure and user-friendly interface for buying, selling, and managing cryptocurrencies, along with real-time market data and trading features. Spot trading, Futures, wallet management, and market data visualization are some of the key features of the platform.",
    responsibilities: [
      "Developed and maintained the frontend application using NextJS and ReactJS.",
      "Built responsive and user-friendly interfaces for trading, account management, and market data visualization.",
      "Integrated real-time market data and trading functionalities using WebSocket and RESTful APIs.",
      "Implemented authentication systems, user profile management, and secure transaction workflows.",
      "Collaborated closely with backend services to ensure seamless integration and optimal performance.",
      "Maintained and scaled the back-end services with Microservices architecture",
    ],
    highlights: [
      "Real-time market data integration",
      "Secure authentication workflows with CSRF protection",
      "Responsive trading interfaces",
      "2FA implementation for enhanced security",
      "State management with Zustand & TanStack Query",
      "Microservices architecture for backend scalability",
      "Trading views with advanced charting and order book visualization with TradingView",
      "Animated UI interactions and performance optimizations with framer-motion",
      "Docker-based deployment and environment configuration",
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
      "Multi-chain trading terminal across Solana, BNB Chain, Ethereum and Arbitrum.",
    summary:
      "A modern multi-chain trading platform inspired by advanced crypto trading terminals, enabling users to trade assets across Solana, BNB Chain, Ethereum, Arbitrum, and other EVM-compatible ecosystems through system-managed wallet infrastructure.",
    responsibilities: [
      "Developed and optimized the frontend trading application using ReactJS.",
      "Integrated backend APIs for token trading, wallet interactions, market data, and portfolio management.",
      "Built high-performance real-time interfaces handling large-scale socket data streams and frequent UI updates.",
      "Optimized rendering performance for large datasets including token tables, transaction histories, and live trading activities.",
      "Implemented wallet connection flows for Solana and EVM-compatible chains.",
      "Collaborated closely with backend and blockchain services to support seamless multi-chain trading experiences.",
      "Designed and maintained responsive, modern, and trading-focused UI/UX experiences.",
    ],
    highlights: [
      "Real-time socket-based trading updates",
      "High-performance rendering optimization",
      "Large-scale data virtualization with TanStack Virtual",
      "Advanced table management with TanStack Table",
      "Server-state management with TanStack Query",
      "State management with Zustand",
      "Multi-chain wallet integration",
      "Solana wallet connection with @solana/wallet-adapter-wallets",
      "EVM wallet integration with Reown AppKit",
      "Modern responsive trading dashboard UI",
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
      "Travel lottery platform where users buy tickets for a chance to win international trips.",
    summary:
      "A travel lottery platform featuring user and admin applications where users can purchase tickets for a chance to win international travel experiences through randomized prize selection systems.",
    responsibilities: [
      "Developed and maintained both customer-facing and admin CMS applications.",
      "Built responsive and visually engaging user interfaces focused on conversion and user engagement.",
      "Implemented authentication systems supporting email/password, Google, and Facebook login flows.",
      "Integrated ticket purchasing workflows, account management, and prize participation systems.",
      "Developed admin dashboard interfaces for managing users, campaigns, tickets, and winner selection operations.",
      "Optimized SEO structure and frontend performance for improved discoverability and user experience.",
      "Collaborated closely with backend services to support real-time campaign and ticket management.",
      "Participated in Docker-based deployment and environment configuration workflows.",
    ],
    highlights: [
      "Modern travel booking UI/UX",
      "SEO-focused frontend architecture",
      "Social authentication integration",
      "Interactive ticket purchasing flows",
      "Admin CMS dashboard system",
      "Responsive and conversion-focused design",
      "Performance-optimized frontend",
      "Docker-based deployment workflow",
      "State management with Zustand & TanStack Query",
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
      "Decentralized horse racing prediction platform with NFT assets on BNB Chain.",
    summary:
      "A decentralized horse racing prediction platform featuring a modern web application and admin CMS for managing NFT assets, race prediction systems, financial operations, and user activities on the BNB Chain ecosystem.",
    responsibilities: [
      "Developed and maintained the main web application and admin CMS using ReactJS.",
      "Built responsive and visually polished dashboard interfaces for managing users, NFT assets, race predictions, and platform operations.",
      "Implemented multilingual support and translation systems for more than 10 countries.",
      "Integrated JWT-based authentication and role-based access control workflows.",
      "Developed backend APIs focused on item management, CMS operations, and administrative functionalities.",
      "Integrated blockchain-related frontend interactions using viem.",
      "Collaborated closely with backend and blockchain services to support decentralized platform workflows.",
    ],
    highlights: [
      "Modern admin dashboard and CMS architecture",
      "Responsive and polished UI/UX design",
      "Multi-language internationalization support",
      "Role-based access control system",
      "JWT authentication workflows",
      "BNB Chain integration",
      "Blockchain interaction with viem",
      "State management with Zustand",
      "Server-state handling with TanStack Query",
      "Modern component architecture with shadcn/ui",
      "RESTful API development with NestJS and Prisma",
    ],
  },
  {
    name: "Seagate",
    role: "Frontend Developer",
    logo: "/project-images/seagate/logo.webp",
    images: ["/project-images/seagate/1.webp"],
    tags: ["Next.js", "Zustand", "Web3"],
    blurb:
      "Investment platform for launching Initial Package Offerings for DePIN projects.",
    summary:
      "A decentralized investment platform designed for launching Initial Package Offerings (IPO) for DePIN projects through Web3-powered investment workflows.",
    responsibilities: [
      "Developed and maintained the frontend application using NextJS.",
      "Built responsive UI components and investment dashboards.",
      "Implemented authentication flows, QR code utilities, and token-related user interfaces.",
      "Integrated state management and frontend business logic for investment workflows.",
      "Collaborated closely with backend services and blockchain-related integrations.",
    ],
    highlights: [
      "Modern responsive UI architecture",
      "Web3-oriented frontend workflows",
      "Authentication and security integrations",
      "State management with Zustand",
      "Optimized user experience with NextJS",
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
      "Premium booking platform for hotel and flight reservations with membership and voucher systems.",
    summary:
      "A premium booking platform ecosystem including customer-facing landing pages and CMS systems for hotel and flight reservations, membership management, vouchers, and account operations.",
    responsibilities: [
      "Developed and maintained both booking platform interfaces and admin CMS systems using NextJS.",
      "Built complex flight search and booking interfaces integrated with third-party provider APIs.",
      "Handled large-scale and highly dynamic flight data with complex business logic processing to ensure accurate pricing, schedules, and booking information.",
      "Optimized rendering performance for heavy datasets and real-time UI updates using React 19 features such as useTransition and memoization strategies.",
      "Implemented smooth and responsive user experiences for booking flows, filtering systems, and account management.",
      "Integrated membership systems, voucher workflows, and account-related functionalities.",
      "Collaborated closely with backend and third-party service providers to ensure reliable booking operations.",
    ],
    highlights: [
      "Complex flight booking workflows",
      "Large-scale data processing",
      "High-performance rendering optimization",
      "React 19 performance strategies",
      "Third-party API integration",
      "Modern booking dashboard UI",
      "Responsive and smooth UX",
      "State management with Zustand & TanStack Query",
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
      "Real-time Web3 social trading platform on Solana for creating and trading custom tokens.",
    summary:
      "A real-time Web3 social trading platform on Solana where users can create custom tokens, interact with communities, and trade assets with integrated reward mechanisms.",
    responsibilities: [
      "Developed and maintained the core frontend application using ReactJS.",
      "Built responsive and interactive UI experiences for token creation, trading, and community engagement.",
      "Integrated real-time features including chat systems, live updates, and token activity feeds using WebSocket.",
      "Implemented token-related backend features including profile management, token interactions, and social functionalities.",
      "Integrated TradingView charts for real-time market visualization.",
      "Collaborated on Web3 workflows and Solana-based transaction interactions.",
    ],
    highlights: [
      "Real-time communication with WebSocket",
      "Interactive trading dashboard",
      "Social features including chat and stickers",
      "Solana ecosystem integration",
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
      "Decentralized reward platform on Telegram Mini Apps with NFT staking and TON-based rewards.",
    summary:
      "A decentralized reward platform integrated with Telegram Mini Apps, allowing users to purchase NFT-based assets, stake into reward pools, and earn TON-based daily rewards.",
    responsibilities: [
      "Designed and developed the entire backend architecture.",
      "Implemented Telegram Mini App authentication integrated with TON wallet verification.",
      "Built secure authentication and session handling systems.",
      "Developed TON blockchain transaction scanning and wallet monitoring services.",
      "Implemented staking pool systems and automated reward distribution logic.",
      "Handled item purchasing, extension, and reward management workflows.",
      "Optimized backend performance using Redis caching and real-time socket communication.",
      "Integrated Telegram Bot services for notifications and platform interactions.",
    ],
    highlights: [
      "TON blockchain integration",
      "Real-time transaction scanning",
      "Event-driven backend workflows",
      "Redis caching strategies",
      "Secure wallet authentication",
      "Telegram Mini App ecosystem",
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
      "Fantasy football platform across Web, Mobile and Telegram with real-time game sync.",
    summary:
      "A fantasy football platform inspired by Fantasy Premier League, supporting Web, Mobile, and Telegram Mini App experiences with real-time game synchronization.",
    responsibilities: [
      "Developed backend services and APIs for gameplay systems and user interactions.",
      "Implemented automated synchronization systems for Fantasy Premier League data using scheduled cron jobs.",
      "Built scalable backend logic for player statistics, team management, and ranking systems.",
      "Integrated Redis caching for performance optimization.",
      "Developed Telegram Mini App and bot-related backend integrations.",
    ],
    highlights: [
      "Cronjob-based data synchronization",
      "Realtime game data processing",
      "Redis performance optimization",
      "Telegram ecosystem integration",
      "Scalable backend APIs",
    ],
  },
  {
    name: "EST Edu",
    role: "Software Engineering",
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
      "Interactive e-learning platform with live video sessions and AI-powered career prediction.",
    summary:
      "An interactive e-learning platform that combines structured programming courses, real-time communication, video calls, and AI-powered career prediction systems.",
    responsibilities: [
      "Designed and developed both frontend and backend systems.",
      "Built course management, lesson management, and user authentication systems.",
      "Implemented real-time chat and communication features using Socket.io.",
      "Integrated WebRTC video calling for live learning sessions.",
      "Developed AI-powered career prediction functionality using machine learning services.",
      "Built dashboards, notifications, and interactive analytics systems.",
      "Designed MongoDB database structures and backend APIs.",
    ],
    highlights: [
      "Realtime communication systems",
      "WebRTC video integration",
      "AI-powered recommendation system",
      "Full-stack architecture",
      "Interactive analytics dashboard",
      "Scalable education platform",
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
      "Medical clinic platform with a public landing page and an internal CRM for content management.",
    summary:
      "A medical clinic platform including a public landing page and an internal CRM system for managing articles, banners, and medical content.",
    responsibilities: [
      "Designed and developed backend APIs for both landing page and admin CRM systems.",
      "Built content management features for articles, banners, and doctor information.",
      "Implemented authentication, validation, and CRUD management workflows.",
      "Designed MongoDB database schemas and integrated API documentation using Swagger.",
    ],
    highlights: [
      "RESTful API architecture",
      "Content management system (CMS)",
      "MongoDB database design",
      "Authentication and validation workflows",
      "Swagger API documentation",
    ],
  },
  {
    name: "Bwai Tech",
    role: "Software Engineering",
    images: [
      "/project-images/bwai-tech-1.webp",
      "/project-images/bwai-tech-2.webp",
      "/project-images/bwai-tech-admin-1.webp",
      "/project-images/bwai-tech-admin-2.webp",
      "/project-images/bwai-tech-admin-3.webp",
    ],
    tags: ["Admin CMS", "REST API", "Responsive UI"],
    blurb:
      "Corporate website and admin system for managing products, careers and media content.",
    summary:
      "A corporate website and admin management system for managing company products, careers, classes, and media content.",
    responsibilities: [
      "Developed frontend landing pages and backend management systems.",
      "Built admin dashboard features for managing products, careers, classes, and videos.",
      "Implemented CRUD operations, form validation, and content management workflows.",
      "Collaborated on responsive UI development and API integrations.",
    ],
    highlights: [
      "Admin dashboard system",
      "Responsive corporate website",
      "Content management workflows",
      "Form validation and API integration",
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
