"use client";
import { listExperience } from "@/lib/init";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import ExperienceCard from "../experience/ExperienceCard";

const Experiences = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="experiences" className="scroll-mt-28">
      <h2 className="title-section-gradient">Work Experience</h2>

      <div ref={containerRef} className="relative mx-auto max-w-3xl">
        {/* Animated vertical line */}
        <div className="absolute left-4 top-0 hidden h-full w-px bg-white/10 sm:block">
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute inset-0 bg-gradient"
          />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-10 sm:pl-12">
          {listExperience.map((exp, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute -left-[2.85rem] top-6 hidden size-4 rounded-full border-2 border-violet-500 bg-background sm:block"
              />
              <ExperienceCard data={exp} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
