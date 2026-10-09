import { ArrowUpRight, FileText, Globe } from "lucide-react";
import type { ReactNode } from "react";
import {
  GithubIcon,
  GmailIcon,
  LinkedinIcon,
} from "@/components/common/BrandIcons";
import { absoluteUrl, siteConfig } from "@/lib/config";
import {
  buildPreviewTargets,
  type PreviewKind,
  type PreviewTarget,
} from "@/lib/chat/link-previews";

export const PREVIEW_TARGETS = buildPreviewTargets({
  name: siteConfig.name,
  email: siteConfig.email,
  github: siteConfig.links.github,
  linkedin: siteConfig.links.linkedin,
  resumeUrl: absoluteUrl(siteConfig.resume),
  websiteUrl: siteConfig.url,
});

const ICONS: Record<PreviewKind, ReactNode> = {
  linkedin: <LinkedinIcon size={16} />,
  email: <GmailIcon size={16} />,
  github: <GithubIcon size={17} />,
  resume: <FileText aria-hidden="true" size={17} />,
  website: <Globe aria-hidden="true" size={17} />,
};

export const LinkPreview = ({ preview }: { preview: PreviewTarget }) => {
  const external = !preview.href.startsWith("mailto:");
  return (
    <a
      href={preview.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-3 rounded-2xl border border-pf-ink/10 bg-pf-bg3 p-2.5 pr-3 transition-colors hover:border-pf-g3"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-pf-ink/[0.06] text-pf-text">
        {ICONS[preview.kind]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium leading-tight text-pf-text">
          {preview.title}
        </span>
        <span className="block truncate text-xs leading-tight text-pf-t6">
          {preview.subtitle}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        size={15}
        className="shrink-0 text-pf-t6 transition-colors group-hover:text-pf-text"
      />
    </a>
  );
};
