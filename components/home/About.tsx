import {
  EnvelopeOpenIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import DownloadResumeButton from "../common/DownloadResumeButton";
import { TypewriterText } from "../common/TypeWriter";
import Facebook from "../icons/Facebook";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const About = () => {
  const skills = [
    "👨‍💻 Web Developer with a strong focus on modern web technologies in the Node.js ecosystem.",
    "⚙️ I specialize in TypeScript-based frameworks such as Next.js and NestJS, with hands-on experience in both SQL and NoSQL databases.",
    "🦄 I'm also actively involved in building Web3 and blockchain applications on platforms like TON, Solana, and EVM-compatible chains.",
    "💡 I work well both independently and in collaborative team environments, and I’m confident in self-learning and quickly adapting to new technologies.",
    "🚀 I’m passionate about creating scalable, secure, and high-performance web solutions that bridge modern web and decentralized technologies.",
  ];

  const socials = [
    {
      href: "mailto:daotai.work@gmai.com",
      label: "Email",
      icon: (
        <EnvelopeOpenIcon className="size-11 rounded-full bg-gradient p-2 text-white" />
      ),
    },
    {
      href: "https://github.com/DaoTai",
      label: "GitHub",
      icon: (
        <GitHubLogoIcon className="size-11 rounded-full bg-gradient p-2 text-white" />
      ),
    },
    {
      href: "https://www.facebook.com/YC011",
      label: "Facebook",
      icon: (
        <Facebook className="size-11 rounded-full bg-gradient p-2 text-white" />
      ),
    },
    {
      href: "https://www.linkedin.com/in/dao-tai-61757325a",
      label: "LinkedIn",
      icon: (
        <LinkedInLogoIcon className="size-11 rounded-full bg-gradient p-2 text-white" />
      ),
    },
  ];

  return (
    <div
      id="about"
      className="grid scroll-mt-16 grid-cols-1 gap-4 md:grid-cols-3"
    >
      {/* Text information */}
      <div className="order-2 space-y-8 md:order-1 md:col-span-2">
        <TypewriterText
          text="Hi there! I'm Dao Tai"
          className="mx-auto flex justify-center text-4xl font-bold sm:inline-block sm:justify-start sm:text-5xl 2xl:text-6xl"
        />

        <TypewriterText
          text="Fullstack Developer"
          delayPerChar={0.06}
          className=" flex w-fit justify-center rounded-full bg-gradient px-6 py-2 text-3xl text-white sm:justify-start md:text-4xl lg:text-5xl"
        />

        <motion.ul
          className="space-y-4 text-xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {skills.map((text, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
              whileHover={{ scale: 1.02 }}
              className="text-xl font-semibold text-slate-700 dark:text-slate-300"
            >
              {text}
            </motion.li>
          ))}
        </motion.ul>

        {/* List link social */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          {socials.map((item, i) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: [-10, 10, -6, 6, -2, 2, 0] }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, 5, -5, 5, 0],
                    filter: "constrast(1.2)",
                  }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    className="flex w-fit items-center gap-4 text-xl"
                  >
                    {item.icon}
                  </Link>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {/* Download resume */}
        <DownloadResumeButton className="w-full justify-center sm:w-fit" />
      </div>

      {/* Avatar */}
      <div className="order-1 mx-auto hidden md:order-2 md:col-span-1 md:block">
        <Image
          unoptimized
          src="/avatar.jpg"
          width={300}
          height={300}
          alt="avatar"
          className="h-fit max-h-[60vh] w-full object-cover drop-shadow-2xl"
          style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
        />
      </div>
      {/* Avatar mobile */}
      <Image
        unoptimized
        src="/avatar.jpg"
        width={300}
        height={300}
        alt="avatar"
        className="order-1 mx-auto block size-60 rounded-full border object-cover drop-shadow-2xl md:hidden"
      />
    </div>
  );
};

export default About;
