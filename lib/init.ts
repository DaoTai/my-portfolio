import { Component, FileText, Monitor, RefreshCcw, Rocket } from "lucide-react";

export const navigations: INavigation[] = [
  { name: "About me", href: "#about", icon: Rocket },
  { name: "Techstack", href: "#skills", icon: Component },
  { name: "Projects", href: "#projects", icon: Monitor },
  { name: "Experiences", href: "#experiences", icon: RefreshCcw },
  { name: "Contact", href: "#contact", icon: FileText },
];

export const stats: IStat[] = [
  { label: "Years Experience", value: 4, suffix: "+" },
  { label: "Projects Shipped", value: 9, suffix: "+" },
  { label: "Technologies", value: 22, suffix: "+" },
];

export const techStack: ITech[] = [
  { imageUri: "/next-js.png", name: "Next JS", category: "frontend" },
  {
    imageUri: "/react-js.png",
    name: "React JS & React Native",
    category: "frontend",
  },
  { imageUri: "/tailwind-css.png", name: "Tailwind", category: "frontend" },
  { imageUri: "/shadcn-ui.png", name: "Shadcn UI", category: "frontend" },
  { imageUri: "/mantine.png", name: "Mantine UI", category: "frontend" },
  { imageUri: "/ant-design.svg", name: "Ant Design", category: "frontend" },
  { imageUri: "/mui.png", name: "Material UI", category: "frontend" },
  {
    imageUri: "/tanstack.png",
    name: "Tanstack Ecosystem",
    category: "frontend",
  },
  { imageUri: "/redux.png", name: "Redux Ecosystem", category: "frontend" },
  { imageUri: "/zustand.jpg", name: "Zustand", category: "frontend" },
  { imageUri: "/node-js.png", name: "Node JS", category: "backend" },
  { imageUri: "/nest-js.png", name: "Nest JS", category: "backend" },
  { imageUri: "/express-js.png", name: "Express JS", category: "backend" },
  { imageUri: "/mongo-db.png", name: "MongoDB", category: "backend" },
  { imageUri: "/postgresql.png", name: "PostgreSQL", category: "backend" },
  { imageUri: "/redis.svg", name: "Redis", category: "backend" },
  { imageUri: "/rabbitmq.svg", name: "RabbitMQ", category: "backend" },
  { imageUri: "/prisma.png", name: "Prisma", category: "backend" },
  { imageUri: "/socket.png", name: "Socket.io", category: "backend" },
  { imageUri: "/docker.png", name: "Docker", category: "tools" },
  { imageUri: "/web-rtc.png", name: "WebRTC", category: "tools" },
  { imageUri: "/metamask.png", name: "MetaMask", category: "tools" },
  { imageUri: "/phantom.jpg", name: "Phantom", category: "tools" },
  { imageUri: "/ton.jpg", name: "Ton", category: "tools" },
  { imageUri: "/ubuntu.png", name: "Ubuntu", category: "tools" },
  { imageUri: "/aws-s3.png", name: "Amazon S3", category: "tools" },
  { imageUri: "/aws-ec2.png", name: "Amazon EC2", category: "tools" },
  { imageUri: "/aws-kms.png", name: "Amazon KMS", category: "tools" },
  { imageUri: "/firebase.png", name: "Firebase", category: "tools" },
  { imageUri: "/claude.svg", name: "Claude", category: "tools" },
];

export const listProject: IProject[] = [
  {
    name: "Ponz",
    role: "Frontend Developer",
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
    technicalHighlights: [
      "Real-time communication with WebSocket",
      "Interactive trading dashboard",
      "Social features including chat and stickers",
      "Solana ecosystem integration",
      "Cloud asset storage with AWS S3",
    ],
    previewImages: [
      "/project-images/ponz/1.jpg",
      "/project-images/ponz/2.jpg",
      "/project-images/ponz/4.png",
      "/project-images/ponz/5.jpg",
      "/project-images/ponz/6.png",
      "/project-images/ponz/7.png",
      "/project-images/ponz/8.png",
    ],
  },
  {
    name: "Node Farm",
    role: "Backend Developer",
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
    technicalHighlights: [
      "TON blockchain integration",
      "Real-time transaction scanning",
      "Event-driven backend workflows",
      "Redis caching strategies",
      "Secure wallet authentication",
      "Telegram Mini App ecosystem",
    ],
    previewImages: [
      "/project-images/node-farm/3.jpg",
      "/project-images/node-farm/2.jpg",
      "/project-images/node-farm/1.jpg",
    ],
  },
  {
    name: "DFantasy",
    role: "Backend Developer",
    summary:
      "A fantasy football platform inspired by Fantasy Premier League, supporting Web, Mobile, and Telegram Mini App experiences with real-time game synchronization.",
    responsibilities: [
      "Developed backend services and APIs for gameplay systems and user interactions.",
      "Implemented automated synchronization systems for Fantasy Premier League data using scheduled cron jobs.",
      "Built scalable backend logic for player statistics, team management, and ranking systems.",
      "Integrated Redis caching for performance optimization.",
      "Developed Telegram Mini App and bot-related backend integrations.",
    ],
    technicalHighlights: [
      "Cronjob-based data synchronization",
      "Realtime game data processing",
      "Redis performance optimization",
      "Telegram ecosystem integration",
      "Scalable backend APIs",
    ],
    previewImages: [
      "/project-images/dfantasy/2.jpg",
      "/project-images/dfantasy/1.jpg",
      "/project-images/dfantasy/3.jpg",
    ],
  },
  {
    name: "Seagate",
    role: "Frontend Developer",
    summary:
      "A decentralized investment platform designed for launching Initial Package Offerings (IPO) for DePIN projects through Web3-powered investment workflows.",
    responsibilities: [
      "Developed and maintained the frontend application using NextJS.",
      "Built responsive UI components and investment dashboards.",
      "Implemented authentication flows, QR code utilities, and token-related user interfaces.",
      "Integrated state management and frontend business logic for investment workflows.",
      "Collaborated closely with backend services and blockchain-related integrations.",
    ],
    technicalHighlights: [
      "Modern responsive UI architecture",
      "Web3-oriented frontend workflows",
      "Authentication and security integrations",
      "State management with Zustand",
      "Optimized user experience with NextJS",
    ],
    previewImages: [
      "/project-images/seagate/1.jpg",
      "https://seagate-2.gitbook.io/~gitbook/image?url=https%3A%2F%2F447930709-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FSYKoAoNxCF2An0RlRQRi%252Fuploads%252FKlyw1V50EH9gzSpKCevH%252FScreenshot%25202024-08-16%2520at%252017.00.15.png%3Falt%3Dmedia%26token%3Dd9dd234b-4853-4d2c-84ef-a427ada50890&width=1248&dpr=1&quality=100&sign=13009b9b&sv=2",
    ],
  },
  {
    name: "EST Edu",
    role: "Full-stack Developer",
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
    technicalHighlights: [
      "Realtime communication systems",
      "WebRTC video integration",
      "AI-powered recommendation system",
      "Full-stack architecture",
      "Interactive analytics dashboard",
      "Scalable education platform",
    ],
    previewImages: [
      "/project-images/est-edu-1.jpg",
      "/project-images/est-edu-2.jpg",
      "/project-images/est-edu-3.jpg",
      "/project-images/est-edu-4.jpg",
      "/project-images/est-edu-5.jpg",
      "/project-images/est-edu-6.jpg",
      "/project-images/est-edu-7.jpg",
    ],
  },
  {
    name: "Van Thanh Clinic",
    role: "Backend Developer",
    summary:
      "A medical clinic platform including a public landing page and an internal CRM system for managing articles, banners, and medical content.",
    responsibilities: [
      "Designed and developed backend APIs for both landing page and admin CRM systems.",
      "Built content management features for articles, banners, and doctor information.",
      "Implemented authentication, validation, and CRUD management workflows.",
      "Designed MongoDB database schemas and integrated API documentation using Swagger.",
    ],
    technicalHighlights: [
      "RESTful API architecture",
      "Content management system (CMS)",
      "MongoDB database design",
      "Authentication and validation workflows",
      "Swagger API documentation",
    ],
    previewImages: [
      "/project-images/pk-bs-thanh-1.jpg",
      "/project-images/pk-bs-thanh-2.jpg",
      "/project-images/pk-bs-thanh-3.jpg",
      "/project-images/admin-pk-bs-thanh-1.jpg",
      "/project-images/admin-pk-bs-thanh-2.jpg",
    ],
  },
  {
    name: "Bwai Tech",
    role: "Full-stack Developer",
    summary:
      "A corporate website and admin management system for managing company products, careers, classes, and media content.",
    responsibilities: [
      "Developed frontend landing pages and backend management systems.",
      "Built admin dashboard features for managing products, careers, classes, and videos.",
      "Implemented CRUD operations, form validation, and content management workflows.",
      "Collaborated on responsive UI development and API integrations.",
    ],
    technicalHighlights: [
      "Admin dashboard system",
      "Responsive corporate website",
      "Content management workflows",
      "Form validation and API integration",
      "Full-stack web development",
    ],
    previewImages: [
      "/project-images/bwai-tech-1.png",
      "/project-images/bwai-tech-2.png",
      "/project-images/bwai-tech-admin-1.png",
      "/project-images/bwai-tech-admin-2.jpg",
      "/project-images/bwai-tech-admin-3.jpg",
    ],
  },
];

export const listExperience: IExperience[] = [
  {
    companyName: "USOL VIETNAM",
    comanyLogo: "/experience/usol-v.jpg",
    positionWork: "Web Development Intern",
    startTime: "June 2023",
    endTime: "August 2023",
    summary:
      "I am joined to train and develop software project with professional Japanese workflow. My responsibility is handle client side logic by NextJS, RTK Query, MUI for a web app. Additionally, I have experience as a team leader, overseeing a team of 3 members. Finally, I completed and achieved certificate of company.",
    tags: ["NextJS", "RTK Query", "MUI", "TailwindCSS"],
  },
  {
    companyName: "BWAI TECH",
    comanyLogo: "/experience/bwai-tech.png",
    positionWork: "Web Developer",
    startTime: "February 2024",
    endTime: "April 2024",
    summary:
      "I joined to become a Web developer. My primary responsibility is design and build front-end, back-end for both company projects and clients with some tools and technologies like Figma, NextJS, NestJS, MongoDB, ...",
    tags: [
      "Figma",
      "NextJS",
      "RTK Query",
      "ShadcnUI",
      "TailwindCSS",
      "ExpressJS",
      "NestJS",
      "MongoDB",
      "Swagger",
    ],
  },
];
