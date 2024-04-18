import { DownloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { AnchorHTMLAttributes } from "react";

const DownloadResumeButton = ({
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      href="/resume.pdf"
      download
      target="_blank"
      title="resume.pdf"
      className={`flex w-fit gap-4 rounded-3xl border border-dashed border-sky-400 p-6 py-4 transition-all duration-300 ease-in-out hover:bg-slate-50 hover:text-black ${className}`}
      {...props}
    >
      <DownloadIcon className="h-8 w-8" />
      <span className="text-2xl"> Get resume</span>
    </Link>
  );
};

export default DownloadResumeButton;
