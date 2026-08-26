import Image from "next/image";
import logoImg from "@/brandassets/logo-cropped.png";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-bg py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div>
          <Image
            src={logoImg}
            alt="HealthBridge logo"
            height={36}
            className="h-9 w-auto"
          />
          <p className="mt-2 text-xs text-ink-muted">A subsidiary of TradeAxis Global Ventures</p>
        </div>
        <p className="text-xs text-ink-muted">
          © 2026 HealthBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
