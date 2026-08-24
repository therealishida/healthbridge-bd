"use client";

import { motion } from "motion/react";

const headline = "World-class care, one coordinator away";
const words = headline.split(" ");

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center overflow-hidden bg-bg">
      {/* animated gradient field */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-primary/20 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-accent/20 blur-[140px]"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute inset-0 bg-bg/50" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary"
        >
          <span className="h-px w-6 bg-primary" />
          Bangladesh &nbsp;→&nbsp; Bangkok, Thailand
        </motion.p>

        <h1 className="max-w-4xl font-display text-[40px] font-medium leading-[1.05] tracking-tightest text-ink md:text-[88px]">
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
          className="mt-8 max-w-xl text-lg text-ink-muted"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-ink-muted"
      >
        SCROLL
      </motion.div>
    </section>
  );
}
