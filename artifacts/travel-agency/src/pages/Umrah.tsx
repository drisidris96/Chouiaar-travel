import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, Users, Hotel, Plane, Bus, HeadphonesIcon, Phone } from "lucide-react";

const packages = [
  {
    name: "باقة العمرة الاقتصادية",
    price: "7,500",
    duration: "10 أيام",
    hotel: "فندق 3 نجوم",
    distance: "500 متر من الحرم",
    capacity: "20 شخص",
    color: "from-slate-500 to-slate-700",
    features: ["تذاكر طيران ذهاب وإياب", "إقامة فندقية مشتركة", "تنقلات داخلية", "مرشد ديني", "التأشيرة مشمولة"],
  },
  {
    name: "باقة العمرة الفضية",
    price: "12,000",
    duration: "12 يوم",
    hotel: "فندق 4 نجوم",
    distance: "200 متر من الحرم",
    capacity: "15 شخص",
    color: "from-amber-500 to-amber-700",
    featured: true,
    features: ["تذاكر طيران مباشرة", "غرفة مزدوجة فاخرة", "وجبة إفطار يومية", "جولات زيارة المواقع", "مرشد ديني متخصص", "التأشيرة مشمولة"],
  },
  {
    name: "باقة العمرة الذهبية",
    price: "18,000",
    duration: "15 يوم",
    hotel: "فندق 5 نجوم",
    distance: "50 متر من الحرم",
    capacity: "10 أشخاص",
    color: "from-yellow-500 to-yellow-700",
    features: ["درجة رجال الأعمال", "غرفة واسعة مطلة على الكعبة", "جميع الوجبات مشمولة", "جولات مكة والمدينة", "مرشد شخصي", "التأشيرة العاجلة مشمولة", "خدمة VIP"],
  },
];

const whyUs = [
  { icon: Star, title: "خبرة 15 سنة", desc: "أكثر من 15 عاماً في تنظيم رحلات العمرة بخبرة واحترافية عالية" },
  { icon: Users, title: "آلاف المعتمرين", desc: "خدمنا أكثر من 10,000 معتمر من الجزائر وأفريقيا" },
  { icon: HeadphonesIcon, title: "دعم مستمر", desc: "فريق متواجد على مدار الساعة لخدمتك داخل وخارج المملكة" },
  { icon: Hotel, title: "أفضل الفنادق", desc: "نختار لك أقرب الفنادق للحرم المكي بأسعار تنافسية" },
];

export default function Umrah() {
  return (
    <div dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/kaaba/1400/700"
            alt="العمرة"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full text-sm font-bold mb-5 backdrop-blur">
              ✨ باقات العمرة المميزة
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              رحلة <span className="text-primary">العمرة</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              عش تجربة روحانية لا تُنسى في أقدس بقاع الأرض مع وكالة شوعير للسياحة والأسفار
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">لماذا تختار وكالة شوعير؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border/50 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-serif font-bold mb-4">باقات العمرة</h2>
            <p className="text-muted-foreground text-lg">اختر الباقة المناسبة لك ولعائلتك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden border ${pkg.featured ? "border-primary shadow-2xl shadow-primary/20 scale-105" : "border-border/50 shadow-lg"}`}
              >
                {pkg.featured && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      الأكثر طلباً ⭐
                    </span>
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pkg.color} p-8 text-white`}>
                  <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{pkg.duration} • {pkg.hotel}</p>
                  <div className="text-4xl font-bold">
                    {pkg.price} <span className="text-lg font-normal opacity-80">ر.س</span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">للشخص الواحد</p>
                </div>

                <div className="bg-card p-6">
                  <div className="flex flex-wrap gap-3 mb-5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Hotel className="w-4 h-4 text-primary" />{pkg.distance}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4 text-primary" />{pkg.capacity}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span className="text-primary font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button className={`w-full rounded-full ${pkg.featured ? "" : "variant-outline"}`} variant={pkg.featured ? "default" : "outline"}>
                      احجز الآن
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">هل لديك استفسار عن رحلة العمرة؟</h2>
          <p className="text-muted-foreground mb-8 text-lg">تواصل معنا ونحن نجهّز لك رحلة الإيمان</p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full h-13 px-10 gap-2">
              <Phone className="w-5 h-5" />
              تواصل معنا
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
