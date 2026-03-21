import { Link } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 inline-flex">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-serif text-3xl font-bold text-white">
                رحلات<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed max-w-md">
              نقدم لك أفضل العروض والرحلات السياحية حول العالم بأسعار تنافسية وخدمة فاخرة تلبي تطلعاتك. اكتشف جمال العالم معنا.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">روابط سريعة</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-secondary-foreground/70 hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/trips" className="text-secondary-foreground/70 hover:text-primary transition-colors">الرحلات</Link></li>
              <li><Link href="/about" className="text-secondary-foreground/70 hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link href="/contact" className="text-secondary-foreground/70 hover:text-primary transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold mb-6 text-white">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <MapPin className="w-5 h-5 text-primary" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Phone className="w-5 h-5 text-primary" />
                <span dir="ltr">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@rehlat.com</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-secondary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} وكالة رحلات السياحية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
