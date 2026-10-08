import type { ReactNode } from "react";

type ContactLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
};

export const ContactLink = ({
  href,
  icon,
  label,
  value,
  className = "",
}: ContactLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group flex min-w-0 items-center gap-3 text-pf-text2 transition-colors hover:text-pf-text ${className}`}
  >
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-pf-ink/[0.14] transition-colors group-hover:border-pf-g2">
      {icon}
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="text-xs text-pf-t7">{label}</span>
      <span className="truncate text-sm">{value}</span>
    </span>
  </a>
);
