import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import {
  GithubIcon,
  GmailIcon,
  LinkedinIcon,
} from "@/components/common/BrandIcons";
import { Reveal } from "@/components/common/Reveal";
import { TiltCard } from "@/components/common/TiltCard";
import { siteConfig } from "@/lib/config";
import { gmailComposeUrl } from "@/lib/contact";
import { CoffeeButton } from "./CoffeeButton";
import { ContactBackground } from "./ContactBackground";
import { ContactLink } from "./ContactLink";
import "./Contact.css";
import { Logo } from "../SiteHeader";

const CONTACT_BG = {
  background:
    "radial-gradient(ellipse 50% 80% at 10% 100%, rgba(var(--glow3),0.14), transparent 70%), var(--bg)",
};

const CONTACT_LINKS = [
  {
    href: gmailComposeUrl(),
    label: "Gmail",
    value: siteConfig.email,
    icon: <GmailIcon size={16} />,
    // Longest value: give it the full row so it never truncates beside the others.
    className: "col-span-full",
  },
  {
    href: siteConfig.links.github,
    label: "GitHub",
    value: "github.com/youngcrizzal",
    icon: <GithubIcon />,
  },
  {
    href: siteConfig.links.linkedin,
    label: "LinkedIn",
    value: "in/dao-tai",
    icon: <LinkedinIcon size={16} />,
  },
];

const LETS_TALK_HREF = gmailComposeUrl({
  subject: "Let’s work together",
  body: "Hi Tai,\n\n",
});

const Contact = () => {
  return (
    <section
      id="contact"
      data-screen-label="Contact"
      style={CONTACT_BG}
      className="relative overflow-hidden"
    >
      <ContactBackground />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-10 px-8 pb-14 pt-20">
        <Reveal className="flex flex-col gap-3.5">
          <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
            <span className="h-px w-[18px] bg-pf-g2" />
            Get In Touch
          </span>
          <h2 className="m-0 max-w-[460px] font-display text-[clamp(26px,2.8vw,34px)] font-semibold leading-[1.25] tracking-[-0.02em] text-pf-text">
            I’m always interested in hearing about new projects and
            opportunities.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <TiltCard
            max={5}
            className="flex flex-col gap-[22px] rounded-[18px] border border-pf-ink/10 bg-pf-ink/[0.025] p-6 shadow-[0_30px_70px_-34px_rgba(var(--glow3),0.5)]"
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px]">
              {CONTACT_LINKS.map((link) => (
                <ContactLink key={link.label} {...link} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 [transform-style:preserve-3d]">
              <a
                href={LETS_TALK_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-[10px] bg-pf-text px-6 py-3 text-sm font-bold text-pf-bg [transform:translateZ(30px)] [transition:background-color_.3s,box-shadow_.3s] hover:bg-pf-invhover hover:text-pf-bg hover:shadow-[0_14px_40px_-10px_rgba(var(--glow3),0.8)]"
              >
                Let’s Talk <span aria-hidden="true">→</span>
              </a>
              <CoffeeButton />
            </div>
          </TiltCard>
        </Reveal>
      </div>

      <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 border-t border-pf-ink/[0.06] px-8 pb-8 pt-6 text-[13px] text-pf-t6">
        <div className="flex items-center gap-3.5">
          <Logo />
          <span>Kendrick</span>
          <span>·</span>
          <span>Software Engineering</span>
        </div>
        <span>
          © <AnimatedNumber value={2026} format={{ useGrouping: false }} />
        </span>
      </div>
    </section>
  );
};

export default Contact;
