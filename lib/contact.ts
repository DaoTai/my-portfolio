import { siteConfig } from "@/lib/config";

type ComposeOptions = { subject?: string; body?: string };

/** Opens Gmail's web composer addressed to me, optionally prefilled. */
export const gmailComposeUrl = ({ subject, body }: ComposeOptions = {}) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: siteConfig.email,
  });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
};
