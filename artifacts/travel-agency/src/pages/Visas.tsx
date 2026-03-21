import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, Globe, Phone, Mail } from "lucide-react";

const visaTypes = [
  {
    country: "تركيا",
    flag: "🇹🇷",
    price: "150",
    duration: "3 - 5 أيام",
    validity: "سنة واحدة",
    desc: "تأشيرة إلكترونية سياحية وتجارية",
  },
  {
    country: "الإمارات",
    flag: "🇦🇪",
    price: "200",
    duration: "يوم واحد",
    validity: "30 يوم",
    desc: "تأشيرة سياحية سريعة ومضمونة",
  },
  {
    country: "شنغن أوروبا",
    flag: "🇪🇺",
    price: "350",
    duration: "10 - 15 يوم",
    validity: "90 يوم",
    desc: "تأشيرة موحدة لـ 26 دولة أوروبية",
  },
  {
    country: "المملكة المتحدة",
    flag: "🇬🇧",
    price: "400",
    duration: "15 - 20 يوم",
    validity: "6 أشهر",
    desc: "تأشيرة سياحية وعائلية",
  },
  {
    country: "كندا",
    flag: "🇨🇦",
    price: "300",
    duration: "15 - 25 يوم",
    validity: "10 سنوات",
    desc: "تأشيرة سياحية وزيارة الأقارب",
  },
  {
    country: "الولايات المتحدة",
    flag: "🇺🇸",
    price: "450",
    duration: "20 - 30 يوم",
    validity: "10 سنوات",
    desc: "تأشيرة سياحية وأعمال",
  },
  {
    country: "ماليزيا",
    flag: "🇲🇾",
    price: "100",
    duration: "1 - 2 يوم",
    validity: "30 يوم",
    desc: "تأشيرة إلكترونية سريعة",
  },
  {
    country: "اليابان",
    flag: "🇯🇵",
    price: "250",
    duration: "7 - 10 أيام",
    validity: "3 أشهر",
    desc: "تأشيرة سياحية وثقافية",
  },
];

const steps = [
  { icon: FileText, title: "أرسل الوثائق", desc: "أرسل لنا نسخة من جواز السفر والمستندات المطلوبة" },
  { icon: Clock, title: "المعالجة السريعة", desc: "يعالج فريقنا طلبك بأعلى دقة وسرعة ممكنة" },
  { icon: CheckCircle, title: "استلم تأشيرتك", desc: "نرسل لك التأشيرة الإلكترونية جاهزة للطباعة" },
];

export default function Visas() {
  return (
    <div dir="rtl">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold mb-4">
              خدمة الفيزات الإلكترونية
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              الفيزات <span className="text-primary">الإلكترونية</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              نوفر لك خدمة استخراج التأشيرات الإلكترونية لأكثر من 50 دولة حول العالم بسرعة وأمان وبأفضل الأسعار.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">كيف تحصل على فيزتك؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">التأشيرات المتاحة</h2>
            <p className="text-muted-foreground text-lg">اختر وجهتك وسنتولى الباقي</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaTypes.map((visa, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{visa.flag}</div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{visa.country}</h3>
                <p className="text-sm text-muted-foreground mb-4">{visa.desc}</p>
                <div className="space-y-2 text-sm border-t border-border/40 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">وقت الإصدار:</span>
                    <span className="font-semibold">{visa.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مدة الصلاحية:</span>
                    <span className="font-semibold">{visa.validity}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-muted-foreground">السعر من:</span>
                    <span className="text-primary font-bold text-lg">{visa.price} ر.س</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">هل تريد الاستفسار عن تأشيرتك؟</h2>
          <p className="text-muted-foreground mb-8">تواصل معنا الآن وسيرد عليك أحد متخصصينا</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="rounded-full h-13 px-8 gap-2">
                <Phone className="w-5 h-5" />
                تواصل معنا الآن
              </Button>
            </Link>
            <a href="mailto:info@chouiaartravel.com">
              <Button size="lg" variant="outline" className="rounded-full h-13 px-8 gap-2">
                <Mail className="w-5 h-5" />
                راسلنا بالبريد
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
