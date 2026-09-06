import { Mail, MapPin, ExternalLink } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import DownloadResumeButton from "../common/DownloadResumeButton";
import Github from "../icons/Github";
import Linkedin from "../icons/Linkedin";

const contacts = [
  {
    href: "mailto:daotai.work@gmail.com",
    label: "Email",
    value: "daotai.work@gmail.com",
    icon: Mail,
    isSvg: false,
  },
  {
    href: "https://github.com/DaoTai",
    label: "GitHub",
    value: "github.com/DaoTai",
    icon: Github,
    isSvg: true,
  },
  {
    href: "https://www.linkedin.com/in/dao-tai-61757325a",
    label: "LinkedIn",
    value: "linkedin.com/in/dao-tai",
    icon: Linkedin,
    isSvg: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
} as const;

const Resume = () => {
  return (
    <section id="contact" className="relative scroll-mt-28 overflow-hidden">
      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="mb-3 text-center text-4xl font-bold md:text-5xl">
            <span className="bg-[linear-gradient(90deg,#06b6d4,#22d3ee)] bg-clip-text text-transparent">
              Get
            </span>{" "}
            <span className="bg-[linear-gradient(90deg,#a78bfa,#8b5cf6)] bg-clip-text text-transparent">
              In
            </span>{" "}
            <span className="bg-[linear-gradient(90deg,#06b6d4,#22d3ee)] bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-center text-base text-foreground/75">
            I&apos;m always interested in hearing about new projects and
            opportunities.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl px-4">
          {/* Contact Icons Baseline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-10 grid w-fit grid-cols-2 gap-8 md:grid-cols-4"
          >
            {contacts.map(({ href, label, value, icon: Icon, isSvg }, i) => (
              <motion.div key={label} variants={itemVariants}>
                <Link
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  title={value}
                  className="group relative flex flex-col items-center gap-2 transition-all duration-300"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                    className="flex size-12 items-center justify-center rounded-xl bg-gradient text-white shadow-lg transition-all duration-300 group-hover:shadow-violet-500/50"
                  >
                    {isSvg ? <Icon className="h-5 w-5" /> : <Icon size={20} />}
                  </motion.div>

                  {/* Label */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/75 transition-colors group-hover:text-teal-500">
                    {label}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative mb-12"
          >
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-transparent to-indigo-500/10 p-8 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10" />

              <div className="relative flex flex-col items-center gap-6">
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold text-black/75 dark:text-white">
                    Ready to work together?
                  </h3>
                  <p className="text-sm text-foreground/75">
                    Get my resume or reach out through any of the channels
                    above.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DownloadResumeButton className="border-violet-500/50 bg-gradient text-white shadow-lg shadow-violet-500/30 hover:text-white hover:opacity-90" />
                </motion.div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

export default Resume;
