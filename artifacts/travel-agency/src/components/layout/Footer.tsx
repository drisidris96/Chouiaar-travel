import { Link } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 inline-flex">
              <img
                src="/images/logo-chouiaar.jpg"
                alt="وكالة شوعير"
                className="h-16 w-auto rounded-xl border border-white/10"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl font-bold text-white">وكالة شوعير</span>
                <span className="text-primary text-sm font-semibold">للسياحة والأسفار</span>
              </div>
            </Link>
            <p className="text-secondary-foreground/70 text-base leading-relaxed max-w-md">
              نقدم لك أفضل العروض السياحية والرحلات المنظمة وخدمات العمرة والفيزات الإلكترونية بأسعار تنافسية وخدمة احترافية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">روابط سريعة</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-secondary-foreground/70 hover:text-primary transition-colors">الواجهة الرئيسية</Link></li>
              <li><Link href="/visas" className="text-secondary-foreground/70 hover:text-primary transition-colors">الفيزات الإلكترونية</Link></li>
              <li><Link href="/umrah" className="text-secondary-foreground/70 hover:text-primary transition-colors">العمرة</Link></li>
              <li><Link href="/trips" className="text-secondary-foreground/70 hover:text-primary transition-colors">الرحلات المنظمة</Link></li>
              <li><Link href="/contact" className="text-secondary-foreground/70 hover:text-primary transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-secondary-foreground/70">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>الجزائر</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span dir="ltr">+213 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@chouiaartravel.com</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/chouiaartravel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/chouiaartravel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-secondary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} وكالة شوعير للسياحة والأسفار. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
