"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

type Block =
  | { type: "paragraph"; value: string }
  | { type: "heading"; value: string; level: number }
  | { type: "image"; url: string; caption: string }
  | { type: "video"; url: string }
  | { type: "list"; items: string[] }
  | { type: "poll"; question: string; options: string[]; votes: number[] };

export default function BlogPostContent({ postSlug, rawContent }: { postSlug: string; rawContent: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (rawContent) {
      try {
        const parsed = JSON.parse(rawContent);
        if (Array.isArray(parsed)) {
          setBlocks(parsed);
          return;
        }
      } catch (e) {
        // Fallback to plain text block
      }
      setBlocks([{ type: "paragraph", value: rawContent }]);
    }
  }, [rawContent]);

  return (
    <div className="mt-10">
      {/* Dynamic Blocks */}
      <div className="space-y-6">
        {blocks.map((block, index) => (
          <div key={index}>
            {block.type === "paragraph" && (
              <p 
                className="text-base md:text-lg leading-relaxed text-[#5A5A66]"
                dangerouslySetInnerHTML={{ __html: block.value.replace(/\n/g, "<br/>") }}
              />
            )}

            {block.type === "heading" && (
              <div className="mt-10 mb-4">
                {block.level === 2 && <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#003265]">{block.value}</h2>}
                {block.level === 3 && <h3 className="font-display text-xl md:text-2xl font-semibold text-[#003265]">{block.value}</h3>}
                {block.level === 4 && <h4 className="font-display text-lg md:text-xl font-semibold text-[#003265]">{block.value}</h4>}
              </div>
            )}

            {block.type === "image" && block.url && (
              <figure className="my-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-2">
                <img 
                  src={block.url} 
                  alt={block.caption || "Blog post image"} 
                  className="w-full rounded-xl object-cover max-h-[480px] w-full"
                  onError={(e) => {
                    // fall back gracefully if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-xs text-[#5A5A66] italic">{block.caption}</figcaption>
                )}
              </figure>
            )}

            {block.type === "video" && block.url && (
              <div className="my-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-2">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-[#0A0A0F]">
                  {block.url.includes("youtube.com") || block.url.includes("youtu.be") ? (
                    <iframe
                      src={block.url.replace("watch?v=", "embed/").split("&")[0]}
                      title="Video Embed"
                      className="h-full w-full border-0"
                      allowFullScreen
                    />
                  ) : block.url.includes("vimeo.com") ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${block.url.split("/").pop()}`}
                      title="Video Embed"
                      className="h-full w-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video src={block.url} controls className="h-full w-full" />
                  )}
                </div>
              </div>
            )}

            {block.type === "list" && block.items && (
              <ul className="my-6 space-y-3 list-none pl-1">
                {block.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-[#5A5A66] leading-relaxed">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00B02A] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {block.type === "poll" && (
              <PollWidget 
                postSlug={postSlug} 
                blockIndex={index} 
                question={block.question} 
                options={block.options} 
                initialVotes={block.votes} 
              />
            )}
          </div>
        ))}
      </div>

      {/* Motion-Driven Call-To-Action (CTA) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-20 rounded-3xl bg-[#003265] p-8 text-white text-center md:p-12"
      >
        <h3 className="font-display text-2xl md:text-3xl font-medium">Ready to travel for premium healthcare?</h3>
        <p className="mt-4 text-[#E2E8F0] max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Healthbridge coordinates your medical journey to Bangkok's leading hospitals. From your first consultation through to fully supported recovery, we have you covered.
        </p>
        <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <motion.a
            href="/#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto rounded-full bg-[#00B02A] px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-opacity-95 text-center shadow-lg shadow-[#00B02A]/20"
          >
            Book a Free Consultation
          </motion.a>
          
          <motion.a
            href="https://wa.me/8801711223344" // replace with your actual WhatsApp contact
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto flex justify-center items-center gap-2 rounded-full border border-[#E2E8F0]/30 bg-white/10 backdrop-blur px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/20 text-center"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-[#00B02A]">
              <path d="M12.004 2c-5.51 0-9.99 4.49-9.99 10 0 2 .59 3.88 1.61 5.48l-1.07 3.9c-.1.38.25.72.63.63l3.96-1.05c1.55.95 3.37 1.48 5.27 1.48 5.51 0 9.99-4.49 9.99-10s-4.48-10-9.99-10zm4.5 13.75c-.21.59-1.22 1.15-1.67 1.19-.44.04-.88.22-2.85-.56-2.52-1-4.14-3.57-4.26-3.74-.12-.17-1.03-1.37-1.03-2.61 0-1.24.65-1.85.88-2.1.23-.25.5-.31.67-.31h.48c.15 0 .35.01.5.38.17.41.59 1.44.64 1.55.05.11.08.24 0 .41-.08.17-.18.28-.35.47-.17.19-.36.43-.51.58-.17.17-.35.35-.15.69.2.34.89 1.47 1.91 2.38 1.3 1.16 2.4 1.52 2.74 1.69.34.17.54.14.74-.08.2-.23.88-1.03.99-1.38.11-.35.22-.3.38-.24l1.19.56c.17.08.34.16.42.2.08.04.14.07.14.15 0 .08.01.67-.2 1.25z" />
            </svg>
            Contact on WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Interactive Poll Widget ───────────────────────────────────────────────
function PollWidget({
  postSlug,
  blockIndex,
  question,
  options,
  initialVotes,
}: {
  postSlug: string;
  blockIndex: number;
  question: string;
  options: string[];
  initialVotes: number[];
}) {
  const pollKey = `hb_poll_${postSlug}_${blockIndex}`;
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(initialVotes ?? []);

  useEffect(() => {
    const saved = localStorage.getItem(pollKey);
    if (saved !== null) {
      setHasVoted(true);
      setSelectedOption(parseInt(saved, 10));
    }
  }, [pollKey]);

  const handleVote = async (index: number) => {
    if (hasVoted) return;
    
    // Optimistic update in UI
    const nextVotes = [...votes];
    nextVotes[index] = (nextVotes[index] ?? 0) + 1;
    setVotes(nextVotes);
    setSelectedOption(index);
    setHasVoted(true);
    localStorage.setItem(pollKey, index.toString());

    // Persist vote to database via API
    try {
      const res = await fetch("/api/blog/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, blockIndex, optionIndex: index }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.votes) {
          setVotes(data.votes);
        }
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    }
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="my-8 rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8">
      <h4 className="font-display text-lg font-semibold text-[#003265] mb-4">{question || "Poll"}</h4>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const voteCount = votes[index] ?? 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = selectedOption === index;

          return (
            <div key={index} className="relative overflow-hidden rounded-xl">
              {hasVoted ? (
                // Results view
                <div 
                  className={`flex items-center justify-between border px-4 py-3.5 text-sm transition-all ${
                    isSelected ? "border-[#00B02A] bg-[#00B02A]/5 text-[#003265] font-semibold" : "border-[#E2E8F0] text-[#5A5A66]"
                  }`}
                >
                  {/* Animated percentage background */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`absolute bottom-0 left-0 top-0 -z-10 ${
                      isSelected ? "bg-[#00B02A]/10" : "bg-[#F8F7F4]"
                    }`}
                  />
                  <span>{option}</span>
                  <span className="font-mono text-xs">{percentage}% ({voteCount})</span>
                </div>
              ) : (
                // Interactive Voting view
                <button
                  type="button"
                  onClick={() => handleVote(index)}
                  className="w-full text-left border border-[#E2E8F0] hover:border-[#003265] hover:bg-[#F8F7F4] px-4 py-3.5 text-sm text-[#5A5A66] transition-all rounded-xl active:scale-[0.99]"
                >
                  {option}
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {hasVoted && (
        <p className="mt-4 text-right text-[10px] uppercase tracking-widest text-[#5A5A66]">
          Total votes: {totalVotes}
        </p>
      )}
    </div>
  );
}
