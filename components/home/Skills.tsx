import { techStack } from "@/lib/init";
import * as motion from "motion/react-client";
import Image from "next/image";
const Skills = () => {
  return (
    <div id="skills" className="scroll-mt-20">
      <h1 className="title-section-gradient">Technical Skills</h1>
      {/* Tech stack */}
      <div className="grid  grid-cols-2 gap-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {techStack.map(({ imageUri, name }, i) => (
          <motion.div
            key={i}
            drag
            dragElastic={0.5}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            whileTap={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1, rotate: [0, 3, -3, 3, 0] }}
            transition={{
              type: "keyframes",
              duration: 0.8,
              ease: "easeInOut",
              delay: i * 0.05,
            }}
            className="flex cursor-grab flex-col items-center gap-2 rounded-sm border border-transparent p-2 text-center transition-all duration-300 ease-in-out hover:border-violet-500 active:cursor-grabbing"
          >
            <Image
              unoptimized
              src={imageUri}
              alt="icon"
              placeholder="blur"
              blurDataURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm4zBvW3pMXoaLmy2JX2LsUWSPVqC7GsrKU8MrzgUMQ&s"
              width={80}
              height={80}
              className="aspect-square size-14 rounded-full border bg-gradient object-cover p-2 shadow-2xl drop-shadow-2xl sm:size-28 "
            />
            <div className="rounded-full border bg-gradient px-4 py-1 backdrop-blur-3xl">
              <b className="truncate text-[12px] font-bold uppercase text-white sm:text-base">
                {name}
              </b>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
