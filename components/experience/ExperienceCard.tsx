import Image from "next/image";
import * as motion from "motion/react-client";

const ExperienceCard = ({
  data,
  index,
}: {
  data: IExperience;
  index: number;
}) => {
  const { comanyLogo, companyName, endTime, positionWork, startTime, summary, tags } = data;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
        <div className="flex flex-wrap gap-4 sm:flex-nowrap">
          {/* Company logo */}
          <div className="shrink-0">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-background/50 p-1">
              <Image
                unoptimized
                alt={companyName}
                src={comanyLogo}
                width={80}
                height={80}
                className="h-20 w-20 rounded-lg object-contain sm:h-24 sm:w-24"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-2">
            <div>
              <h3 className="font-display text-xl font-bold">{companyName}</h3>
              <p className="font-semibold text-violet-400 dark:text-violet-300">{positionWork}</p>
            </div>

            {/* Date badge */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gradient px-3 py-0.5 text-xs font-semibold text-white">
                {startTime}
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-full bg-gradient px-3 py-0.5 text-xs font-semibold text-white">
                {endTime}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-foreground/75">{summary}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400 dark:text-violet-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
