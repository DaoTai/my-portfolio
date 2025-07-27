import {
  Component1Icon,
  DesktopIcon,
  LoopIcon,
  ResumeIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
export const navigations: INavigation[] = [
  {
    name: "About me",
    href: "#about",
    icon: RocketIcon,
  },
  {
    name: "Skills",
    href: "#skills",
    icon: Component1Icon,
  },
  {
    name: "Projects",
    href: "#projects",
    icon: DesktopIcon,
  },
  {
    name: "Experiences",
    href: "#experiences",
    icon: LoopIcon,
  },
  {
    name: "Resume",
    href: "#resume",
    icon: ResumeIcon,
  },
];

export const techStack: ITech[] = [
  {
    imageUri: "/node-js.png",
    name: "NODE JS",
  },
  {
    imageUri: "/next-js.png",
    name: "NEXT JS",
  },
  {
    imageUri: "/nest-js.png",
    name: "NEST JS",
  },
  {
    imageUri: "/react-js.png",
    name: "REACT JS",
  },
  {
    imageUri: "/express-js.png",
    name: "EXPRESS JS",
  },
  {
    imageUri: "/mongo-db.png",
    name: "MongoDB",
  },
  {
    imageUri: "/postgresql.png",
    name: "PostgreSQL",
  },
  {
    imageUri: "/redis.svg",
    name: "Redis",
  },
  {
    imageUri: "/rabbitmq.svg",
    name: "RabbitMQ",
  },
  {
    imageUri: "/docker.png",
    name: "Docker",
  },
  {
    imageUri: "/web-rtc.png",
    name: "WebRTC",
  },
  {
    imageUri: "/zustand.jpg",
    name: "Zustand",
  },
  {
    imageUri: "/redux.png",
    name: "REDUX",
  },
  {
    imageUri: "/shadcn-ui.png",
    name: "Shadcn UI",
  },
  {
    imageUri: "/socket.png",
    name: "Socket",
  },
  {
    imageUri: "/prisma.png",
    name: "Prisma",
  },
  {
    imageUri: "/mantine.png",
    name: "Mantine UI",
  },
  {
    imageUri: "/ant-design.svg",
    name: "Antd Design",
  },
  {
    imageUri: "/tailwind-css.png",
    name: "Tailwind CSS",
  },
  {
    imageUri: "/mui.png",
    name: "Material UI",
  },
  {
    imageUri: "/metamask.png",
    name: "MetaMask",
  },
  {
    imageUri: "/phantom.jpg",
    name: "Phantom",
  },
];

export const listProject: IProject[] = [
  {
    name: "Ponz",
    summary:
      "Create custom coins instantly and for free. Add automatic SOL rewards every 5 minutes, jackpot, burn, and smart dev lock in 1-click.",
    startTime: "4-2025",
    endTime: "8-2025",
    uri: "",
    teckStack: [
      "ReactJS",
      "NestJS",
      "Solana",
      "Socket",
      "Redis",
      "RabbitMQ",
      "Telegraf",
      "Prisma",
      "AWS3",
      "Mantine UI",
      "TailwindCSS",
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
    features: [
      "Create custom coins with automatic SOL rewards every 5 minutes",
      "Add jackpot functionality to your coin",
      "Burn coins to reduce supply",
      "Smart dev lock to ensure security",
      "Real-time updates with WebSocket",
      "Trade coins with solana",
      "List reels on the platform",
      "Create stickers for your coins, chat with users",
    ],
    videoDemo: "https://youtu.be/U7qZ_qyjgTw",
  },

  {
    name: "Node Farm",
    summary:
      "A decentralized reward system integrated with Telegram Mini App, enabling users to authenticate seamlessly, purchase and stake NFT-based items into various reward pools, and earn daily TON-based returns. The platform features real-time transaction tracking, flexible item management, and an admin dashboard for monitoring user activity, performance ranking, and analytics.",
    startTime: "2-2025",
    endTime: "4-2025",
    uri: "",
    teckStack: [
      "NextJS",
      "NestJS",
      "Ton Client",
      "KMS",
      "Socket",
      "Redis",
      "Prisma",
      "Telegraf",
    ],
    previewImages: [
      "/project-images/node-farm/3.jpg",
      "/project-images/node-farm/2.jpg",
      "/project-images/node-farm/1.jpg",
    ],
    features: [
      "Authentication via Telegram (Mini App & Web-based)",
      "Chatbot commands integration (via Telegram Bot)",
      "Real-time backend transaction scanning by wallet address",
      "Purchase in-game items using TON tokens",
      "Use purchased items to stake into reward pools: Normal, Premium, and Super",
      "Extend item duration using TON or supported tokens",
      "Daily reward distribution based on staking pool type",
      "Convert earned rewards back to equivalent TON",
      "View user activity charts by day, month, or custom date range",
      "Track active user count and engagement over time",
      "Rank users based on performance or total staking rewards",
      "Filter and export statistical reports for analysis",
      "Monitor transactions and TON/token flow across pools",
    ],
  },

  {
    name: "DFantasy",
    summary:
      "It is a football game, same Fantasy of Premier Leaguage. You can pick favorite player to fight other users. This project include Web, Mobile and Tele Mini App versions",
    startTime: "9-2024",
    endTime: "1-2025",
    uri: "https://app.dfantasy.pro",
    teckStack: ["NestJS", "ReactJS", "Ioredis", "Telegraf"],
    previewImages: [
      "/project-images/dfantasy/2.jpg",
      "/project-images/dfantasy/1.jpg",
      "/project-images/dfantasy/3.jpg",
    ],
    features: ["Sync data from Fantasy FPL Apis by Cronjob"],
  },

  {
    name: "Seagate",
    startTime: "5-2024",
    endTime: "9-2024",
    summary: `Sea Gate Fund is a decentralized investment platform designed to facilitate the launch of Initial Packages Offering (IPO) for Decentralized Physical Infrastructure Networks (#DePIN). By utilizing Web3 technology, Sea Gate Fund enables a new financial paradigm, allowing decentralized investments in physical infrastructure projects through tokenized packages, while promoting transparency, security, and community participation.`,
    uri: "https://seagate-2.gitbook.io/seagate-fund/getting-started/publish-your-docs",
    teckStack: [
      "NextJS",
      "NestJS",
      "Antd Design",
      "NextUI",
      "Zustand",
      "AWS3",
      "Nodemailer",
      "Qrcode",
      "otplib",
      "JWT",
    ],
    previewImages: [
      "/project-images/seagate/1.jpg",
      "https://seagate-2.gitbook.io/~gitbook/image?url=https%3A%2F%2F447930709-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FSYKoAoNxCF2An0RlRQRi%252Fuploads%252FKlyw1V50EH9gzSpKCevH%252FScreenshot%25202024-08-16%2520at%252017.00.15.png%3Falt%3Dmedia%26token%3Dd9dd234b-4853-4d2c-84ef-a427ada50890&width=1248&dpr=1&quality=100&sign=13009b9b&sv=2",
    ],
    features: [
      "In-Game Package Sales",
      "Token Integration and Rewards",
      "Affiliate Marketing and Referrals",
      "In-Game Economy Enhancement",
      "Transaction and Reward Transparency",
      "Market Expansion and Reach",
      "Exclusive Content and Early Access",
      "Premium Membership Benefits",
      "Community Engagement and Growth",
    ],
  },
  {
    name: "EST Edu",
    startTime: "9-2023",
    endTime: "now",
    summary:
      "Build an interactive web platform where users can learn programming through structured video lessons and hands-on exercises. Learners can engage with each lesson by commenting, chatting in real time, or even joining live video calls powered by Socket.io and WebRTC. Beyond learning, users can explore personalized career suggestions through an integrated AI-powered career prediction feature — making the journey not just educational, but truly guided and connected.",
    uri: "https://est-edu.vercel.app",
    features: [
      "Manage user accounts – Create, update, delete, search, and authorize access.",
      "Course management – Create, update, delete, search, and approve educational courses.",
      "Lesson management – Easily organize, search, and maintain individual lessons.",
      "Question bank control – Create, edit, remove, and search questions for tests or discussions.",
      "Member directory – Add, update, delete, and find members in the system.",
      "Group chat management – Create, manage, and moderate group conversations.",
      "CV management – Create and update professional CVs for job applications.",
      "Comment system – Post or remove comments across lessons, posts, or discussions.",
      "Message system – Send and delete direct messages between users.",
      "Profile editing – Customize personal details and user preferences.",
      "Course & video call registration – Sign up or cancel participation in courses and live video sessions.",
      "Live room controls – Toggle webcam, mic, or screen sharing during video meetings.",
      "Interactive statistics dashboard – Visualize platform metrics and user activity via charts.",
      "AI-powered job prediction – Get personalized job suggestions based on user profile and activity.",
      "Real-time notifications – Receive instant updates and reminders across the platform.",
    ],
    teckStack: [
      "NextJS 13",
      "MUI",
      "ExpressJS",
      "MongoDB",
      "Socket.io",
      "Simple-peer",
      "JWT",
      "Keras",
      "FlaskAPI",
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
    videoDemo: "https://youtu.be/KkbwgK8uYDw",
  },
  {
    name: "Phong kham bac si Van Thanh",
    summary:
      "Design database, build front-end and back-end for home page of a doctor's clinic.",
    startTime: "3-2024",
    endTime: "4-2024",
    uri: "https://phongkhambacsyvanthanh.com",
    features: ["Search posts", "Search experts"],
    teckStack: [
      "NextJS 14",
      "TailwindCSS",
      "Charka UI",
      "Swiper",
      "NestJS",
      "Swagger",
      "Mongoose",
      "MongoDB",
    ],
    previewImages: [
      "/project-images/pk-bs-thanh-1.jpg",
      "/project-images/pk-bs-thanh-2.jpg",
      "/project-images/pk-bs-thanh-3.jpg",
    ],
  },
  {
    name: "Phong kham bac si Van Thanh Admin",
    summary:
      "Design database, build front-end and back-end for admin page of a doctor's clinic.",
    startTime: "3-2024",
    endTime: "4-2024",
    uri: "https://admin.phongkhambacsyvanthanh.com",
    features: [
      "Create, update, delete, search posts",
      "Create, update, customization",
      "Create, update, delete banners",
      "Create, update, delete experts",
    ],
    teckStack: [
      "ReactJS",
      "Shadcn UI",
      "RTK Query",
      "Zod",
      "React hook form",
      "JWT",
      "NestJS",
      "Swagger",
      "Mongoose",
      "MongoDB",
    ],
    previewImages: [
      "/project-images/admin-pk-bs-thanh-1.jpg",
      "/project-images/admin-pk-bs-thanh-2.jpg",
    ],
  },
  {
    name: "Bwai Tech",
    summary:
      "Design database and build home page for Bwai Tech company. Main contents introduce company's information, products, careers and classes.",
    endTime: "2-2024",
    startTime: "2-2024",
    uri: "https://bwaitech.com",
    features: [],
    teckStack: ["NextJS 14", "TailwindCSS", "Next-intl"],
    previewImages: [
      "/project-images/bwai-tech-1.png",
      "/project-images/bwai-tech-2.png",
    ],
  },
  {
    name: "Bwai Tech Admin",
    summary: "Admin page manage company's products, careers and classes.",
    startTime: "2-2024",
    endTime: "2-2024",
    uri: "https://admin.bwaitech.com",
    features: [
      "Create, update, delete, search products",
      "Create, update, delete, search classes",
      "Create, update, delete, search careers",
      "Create, update, delete, search videos",
    ],
    teckStack: [
      "NextJS 14",
      "TailwindCSS",
      "Formik",
      "Yup",
      "ExpressJS",
      "Joi",
      "MongoDB",
    ],
    previewImages: [
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
