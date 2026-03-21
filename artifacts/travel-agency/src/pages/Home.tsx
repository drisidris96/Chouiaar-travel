import { Link } from "wouter";
import { useGetTrips } from "@workspace/api-client-react";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe2, ShieldCheck, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: featuredTrips, isLoading } = useGetTrips({ featured: true });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* landing page hero scenic mountain landscape */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Travel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-primary font-bold tracking-widest uppercase mb-4 block text-sm md:text-base">
              اكتشف العالم برفاهية
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              صمم رحلة أحلامك
              <br />
              <span className="text-primary/90 italic">التي لا تُنسى</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light">
              نقدم لك أرقى الوجهات السياحية وأفضل الخدمات لضمان تجربة سفر استثنائية لك ولعائلتك.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/trips">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                  استعرض الوجهات
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur transition-all duration-300">
                  تعرف علينا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-card border border-border/50 shadow-lg shadow-black/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">وجهات عالمية</h3>
              <p className="text-muted-foreground leading-relaxed">
                نوفر لك قائمة حصرية بأجمل الوجهات السياحية حول العالم المختارة بعناية.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-card border border-border/50 shadow-lg shadow-black/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">حجوزات آمنة</h3>
              <p className="text-muted-foreground leading-relaxed">
                نضمن لك تجربة حجز سلسة وآمنة مع شركائنا الموثوقين في كل مكان.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-card border border-border/50 shadow-lg shadow-black/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <HeadphonesIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">دعم على مدار الساعة</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق دعم متخصص لخدمتك والإجابة على استفساراتك في أي وقت وفي أي مكان.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold mb-2 block">عروض خاصة</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              الرحلات المميزة
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              اكتشف أحدث العروض والرحلات الحصرية التي صممناها خصيصاً لعملائنا المميزين.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-64 rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredTrips && featuredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              لا توجد رحلات مميزة حالياً.
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/trips">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                عرض كل الرحلات
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
