/**
 * Site footer. Pixel-identical to the Vite app; the Founders link now points
 * to the founders subdomain (private SPA) instead of an in-app route.
 */
export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-cream/8 pt-7 pb-24 md:pb-8 px-5 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-display text-xl font-bold tracking-tight text-cream">
          P2V <span className="text-p2v">Labs</span>
        </span>
        <div className="flex items-center gap-6">
          <p className="text-cream/25 text-xs tracking-wide">
            © 2025 P2V Labs · Ahmedabad, India
          </p>
          <a
            href="https://founders.p2vlabs.in"
            className="text-[10px] text-cream/45 hover:text-p2v transition-colors tracking-wider uppercase"
          >
            Founders
          </a>
        </div>
      </div>
    </footer>
  )
}
