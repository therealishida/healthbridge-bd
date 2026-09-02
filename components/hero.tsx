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
        <h1 className="max-w-3xl font-display text-[32px] font-medium leading-[1.15] tracking-tight text-white sm:text-[42px] md:text-[48px]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="mr-[0.25em] inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-6 max-w-lg text-base leading-relaxed text-blue-100/90 md:text-lg"
        >
          HealthBridge connects patients in Bangladesh with trusted partner hospitals across Thailand, Singapore, China, and Turkey. From doctor appointments and visa support to local travel coordination, we handle the logistics so you can focus on healing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-8"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
          >
            Book a Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
