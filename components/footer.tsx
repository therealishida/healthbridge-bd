export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-bg py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div>
          <div className="font-display text-lg text-ink">HealthBridge</div>
          <p className="mt-1 text-xs text-ink-muted">A subsidiary of TradeAxis Global Ventures</p>
        </div>
        <p className="text-xs text-ink-muted">
          © 2026 HealthBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
