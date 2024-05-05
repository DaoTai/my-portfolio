import { EnvelopeOpenIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import DownloadResumeButton from "../common/DownloadResumeButton";
import Facebook from "../icons/Facebook";
import Location from "../icons/Location";

const About = () => {
  return (
    <div
      id="about"
      className="grid scroll-mt-16 grid-cols-1 gap-4 md:grid-cols-2"
    >
      {/* Text information */}
      <div className="order-2  space-y-8 md:order-1 ">
        <h1 className="text-center text-4xl sm:text-left sm:text-6xl 2xl:text-8xl">
          Hello! I’m Dao Duc Tai
        </h1>
        <p className="tex-white mx-auto w-fit rounded-full bg-gradient px-8 py-2 text-center text-3xl leading-normal  text-white sm:mx-0 md:text-4xl lg:text-5xl">
          A Web Developer
        </p>
        {/* List link social */}
        <div className="space-y-4">
          <Link
            href="mailto:daotai.work@gmai.com"
            className="flex w-fit items-center gap-4 text-xl"
          >
            <EnvelopeOpenIcon className="h-10 w-10 rounded-full bg-gradient p-2 text-white " />
            <span>daotai.work@gmai.com</span>
          </Link>
          <Link
            href="https://github.com/DaoTai"
            title="https://github.com/DaoTai"
            target="_blank"
            className="flex w-fit items-center gap-4 text-xl"
          >
            <GitHubLogoIcon className="h-10 w-10 rounded-full bg-gradient p-2 text-white " />
            <span>https://github.com/DaoTai</span>
          </Link>

          <Link
            href="https://www.facebook.com/YC011"
            title="https://www.facebook.com/YC011"
            target="_blank"
            className="flex w-fit items-center gap-4 text-xl"
          >
            <Facebook className="h-10 w-10 rounded-full bg-gradient p-2 text-white " />
            <span>https://www.facebook.com/YC011</span>
          </Link>

          <div className="flex items-center gap-4 text-xl">
            <Location className="h-10 w-10 rounded-full bg-gradient p-2 text-white " />
            <span>HaDong, HaNoi</span>
          </div>
        </div>
        {/* Download resume */}
        <DownloadResumeButton className="w-full justify-center sm:w-fit" />
      </div>

      {/* Avatar */}
      <Image
        unoptimized
        src="/avatar.jpg"
        width={300}
        height={300}
        alt="avatar"
        className="order-2 mx-auto hidden h-fit max-h-[80vh] w-full object-cover drop-shadow-2xl md:order-1 md:block md:h-[70%]"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
      />
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
