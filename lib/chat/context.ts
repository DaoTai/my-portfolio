import "server-only";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { listExperience } from "@/lib/init";
import { PROJECTS, TECH_DESCRIPTIONS, TECH_GROUPS } from "@/lib/portfolio-data";
import { buildChatInstructions } from "./instructions";

/** Built once per server instance from the same data the page renders. */
export const CHAT_INSTRUCTIONS = buildChatInstructions({
  profile: {
    fullName: siteConfig.fullName,
    name: siteConfig.name,
    aliases: ["Kendrick"],
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    email: siteConfig.email,
    github: siteConfig.links.github,
    linkedin: siteConfig.links.linkedin,
    resumeUrl: absoluteUrl(siteConfig.resume),
    websiteUrl: siteConfig.url,
    availability: siteConfig.availability,
  },
  experience: listExperience,
  techGroups: TECH_GROUPS,
  techDescriptions: TECH_DESCRIPTIONS,
  projects: PROJECTS,
});
