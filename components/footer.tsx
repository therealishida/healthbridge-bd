import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";
import logoImg from "@/brandassets/logo-cropped.png";

export default async function Footer() {
  // Fetch active services dynamically for the quick links
  let services: any[] = [];
  try {
    const { rows } = await sql`SELECT title, slug FROM services WHERE enabled = true ORDER BY sort_order ASC`;
    services = rows;
  } catch (err) {
    console.error("Failed to load services for footer", err);
  }

  return (
    <footer className="border-t border-line/60 bg-bg pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Logo & Company Info */}
        <div className="md:col-span-4 lg:col-span-3">
          <Link href="/">
            <Image
              src={logoImg}
              alt="HealthBridge logo"
              height={40}
              className="h-10 w-auto mb-6"
            />
          </Link>
          <p className="text-sm text-ink-muted leading-relaxed">
            HealthBridge connects patients from Bangladesh with world-class medical facilities.
          </p>
          <p className="mt-4 text-xs font-semibold text-primary uppercase tracking-wider">
            A subsidiary of TradeAxis Global Ventures
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col sm:flex-row gap-10">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><Link href="/#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#hospitals" className="hover:text-primary transition-colors">Hospitals</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-primary transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Office Location & Map */}
        <div className="md:col-span-4 lg:col-span-5">
          <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">Office Location</h4>
          <p className="text-sm text-ink-muted mb-4">
            10 Soi Sukhumvit 13, Khlong Toei Nuea, Watthana District, Bangkok 10110, Thailand
          </p>
          <div className="h-48 w-full rounded-xl overflow-hidden border border-line/60">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.568285514088!2d100.5562725114562!3d13.744549497973747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ee21fdd0fc9%3A0xc02cf97b102b36dc!2s10%20Soi%20Sukhumvit%2013%2C%20Khwaeng%20Khlong%20Toei%20Nuea%2C%20Khet%20Watthana%2C%20Krung%20Thep%20Maha%20Nakhon%2010110%2C%20Thailand!5e0!3m2!1sen!2s!4v1714404322421!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-16 pt-8 border-t border-line/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} HealthBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
