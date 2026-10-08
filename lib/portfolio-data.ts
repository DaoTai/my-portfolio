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
  logo: string;
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
        img: "/next-js.png",
      },
      {
        name: "React",
        img: "/react-js.png",
      },
      {
        name: "Tailwind",
        img: "/tailwind-css.png",
      },
      {
        name: "shadcn/ui",
        img: "/shadcn-ui.png",
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
        img: "/node-js.png",
      },
      {
        name: "NestJS",
        img: "/nest-js.png",
      },
      {
        name: "Express",
        img: "/express-js.png",
      },
      {
        name: "Prisma",
        img: "/prisma.png",
      },
      {
        name: "Socket.io",
        img: "/socket.png",
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
        img: "/postgresql.png",
      },
      {
        name: "MongoDB",
        img: "/mongo-db.png",
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
        img: "/tanstack.png",
      },
      {
        name: "Redux",
        img: "/redux.png",
      },
      {
        name: "Zustand",
        img: "/zustand.jpg",
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
        img: "/docker.png",
      },
      {
        name: "Ubuntu",
        img: "/ubuntu.png",
      },
      {
        name: "AWS S3",
        img: "/aws-s3.png",
      },
      {
        name: "AWS EC2",
        img: "/aws-ec2.png",
      },
      {
        name: "Firebase",
        img: "/firebase.png",
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
        img: "/git.png",
      },
      {
        name: "WebRTC",
        img: "/web-rtc.png",
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
    logo: "/project-images/next-vault/logo.png",
    images: [
      "/project-images/next-vault/1.jpg",
      "/project-images/next-vault/2.jpg",
      "/project-images/next-vault/3.jpg",
      "/project-images/next-vault/4.jpg",
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
    role: "Full-stack Developer",
    logo: "/project-images/bullbit/logo.png",
    images: [
      "/project-images/bullbit/1.png",
      "/project-images/bullbit/2.png",
      "/project-images/bullbit/3.png",
      "/project-images/bullbit/4.png",
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
      "/project-images/interra/1.jpg",
      "/project-images/interra/2.jpg",
      "/project-images/interra/3.png",
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
      "/project-images/dream-fly/1.png",
      "/project-images/dream-fly/3.png",
      "/project-images/dream-fly/4.png",
      "/project-images/dream-fly/5.png",
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
    logo: "/project-images/hoofdao/logo.png",
    images: [
      "/project-images/hoofdao/8.png",
      "/project-images/hoofdao/7.png",
      "/project-images/hoofdao/1.png",
      "/project-images/hoofdao/2.png",
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
    logo: "/project-images/seagate/logo.png",
    images: ["/project-images/seagate/1.jpg"],
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
];

/** Rotating hero taglines, typed out one word per line in the hero card. */
export const HERO_TAGLINES: string[] = [
  "Build Scalable Web Experiences",
  "Ship Real-time Systems",
  "Craft Web3 Platforms",
  "Design Robust NestJS APIs",
  "Pixel-perfect Next.js Interfaces",
];
