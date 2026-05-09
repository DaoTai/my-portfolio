import { Mail, MapPin } from "lucide-react";
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
  {
    href: "#",
    label: "Location",
    value: "Ho Chi Minh City, Vietnam",
    icon: MapPin,
    isSvg: false,
  },
];

const Resume = () => {
  return (
    <section id="contact" className="scroll-mt-20">
      {/* Spotlight bg */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 h-64 w-full max-w-2xl rounded-full bg-gradient opacity-10 blur-3xl" />

      <h2 className="title-section-gradient">Get In Touch</h2>

      <div className="relative mx-auto max-w-3xl space-y-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-base text-muted-foreground"
        >
          I&apos;m open to new opportunities. Whether you have a question or just want to say hi — my inbox is always open!
        </motion.p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contacts.map(({ href, label, value, icon: Icon, isSvg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -3 }}
            >
              <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-background/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient text-white">
                  {isSvg ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="truncate text-sm font-semibold">{value}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Download resume */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex justify-center pt-2"
        >
          <DownloadResumeButton className="border-violet-500/50 bg-gradient text-white hover:opacity-90 hover:text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="pb-8 text-center text-sm text-muted-foreground"
        >
          Built with Next.js · TailwindCSS · Motion
        </motion.p>
      </div>
    </section>
  );
};

export default Resume;
