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
    imageUri: "/html.png",
    name: "HTML5",
  },
  {
    imageUri: "/css.png",
    name: "CSS3",
  },
  {
    imageUri: "/sass.png",
    name: "SASS",
  },
  {
    imageUri: "/javascript.png",
    name: "JAVASCRIPT",
  },
  {
    imageUri: "/typescript.png",
    name: "TYPESCRIPT",
  },
  {
    imageUri: "/react-js.png",
    name: "REACT JS",
  },
  {
    imageUri: "/next-js.png",
    name: "NEXT JS",
  },
  {
    imageUri: "/redux.png",
    name: "REDUX",
  },
  {
    imageUri: "/node-js.png",
    name: "NODE JS",
  },
  {
    imageUri: "/express-js.png",
    name: "EXPRESS JS",
  },
  {
    imageUri: "/nest-js.png",
    name: "NEST JS",
  },
  {
    imageUri: "/mongo-db.png",
    name: "MongoDB",
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
    imageUri: "/shadcn-ui.png",
    name: "Shadcn UI",
  },
  {
    imageUri: "/git.png",
    name: "Git",
  },
  {
    imageUri: "/socket.png",
    name: "Socket",
  },
  {
    imageUri: "/web-rtc.png",
    name: "WebRTC",
  },
  {
    imageUri: "/docker.png",
    name: "Docker",
  },
];

export const listProject: IProject[] = [
  {
    name: "EST Edu",
    summary:
      "Build a web app for users to learn programming online with videos, exercises. Users can not only comment on lessons but also chat and video call by Socket and WebRTC. Moreover, they can predict suitable career by AI feature",
    endTime: "now",
    startTime: "9-2023",
    uri: "https://est-edu.vercel.app",
    features: [
      "Create, update, delete, search, authorize accounts",
      "Create, update, delete, search, authorize courses",
      "Create, update, delete, search lessons",
      "Create, update, delete, search questions",
      "Create, update, delete, search members",
      "Create, update, delete, search group chats",
      "Create, update, delete CV",
      "Create, delete comments",
      "Create, delete messages",
      "Update profile",
      "Register or cancel course / video call",
      "Toggle webcam, mic or share screen in video room",
      "Statistical with charts",
      "Predict suitable job",
      "Receive notifications",
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
