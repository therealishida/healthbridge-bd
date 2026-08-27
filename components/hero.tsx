"use client";

import Image from "next/image";
import { motion } from "motion/react";
import thailandImg from "@/brandassets/Thailand.jpg";

const headline = "Connecting Bangladeshi Patients to World Class Healthcare";
const words = headline.split(" ");

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center overflow-hidden bg-bg">
      {/* Background image */}
      <Image
        src={thailandImg}
        alt="Bangkok skyline"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-blue-900/60" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <h1 className="max-w-4xl font-display text-[40px] font-medium leading-[1.05] tracking-tightest text-white md:text-[88px]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="mr-4 inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 max-w-xl text-lg text-blue-100"
        >
          Healthbridge facilitates your medical journey to Bangkok&apos;s premium healthcare facilities. As your dedicated advocate, we provide seamless logistics and premium care from your first enquiry through full recovery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-10"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
          >
            Book a Free Consultation
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-blue-200"
      >
        SCROLL
      </motion.div>
    </section>
  );
}
