import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just show success (can be wired to email API later)
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  const contacts = [
    {
      icon: Phone,
      title: "اتصل بنا",
      lines: ["+213 XX XX XX XX", "+213 XX XX XX XX"],
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: MessageCircle,
      title: "واتساب",
      lines: ["تواصل معنا مباشرة", "متاح 24/7"],
      color: "bg-emerald-500/10 text-emerald-600",
      href: "https://wa.me/213XXXXXXXXX",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      lines: ["info@chouiaartravel.com", "booking@chouiaartravel.com"],
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: MapPin,
      title: "العنوان",
      lines: ["الجزائر", "وكالة شوعير للسياحة والأسفار"],
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Clock,
      title: "أوقات العمل",
      lines: ["السبت - الخميس: 8ص - 9م", "الجمعة: 2م - 9م"],
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      icon: Facebook,
      title: "تابعنا على فيسبوك",
      lines: ["Chouiaar Travel Agency", "آخر العروض والأخبار"],
      color: "bg-indigo-500/10 text-indigo-600",
      href: "https://facebook.com/chouiaartravel",
    },
  ];

  return (
    <div dir="rtl">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold mb-4">
              نحن هنا لمساعدتك
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-5">
              <span className="text-primary">تواصل</span> معنا
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              فريقنا جاهز للإجابة على جميع استفساراتك وتقديم أفضل العروض لك ولعائلتك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {contacts.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">{item.title}</h3>
                    {item.lines.map((l, j) => (
                      <p key={j} className="text-muted-foreground text-sm">{l}</p>
                    ))}
                  </a>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    {item.lines.map((l, j) => (
                      <p key={j} className="text-muted-foreground text-sm">{l}</p>
                    ))}
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-lg">
              <h2 className="text-3xl font-serif font-bold text-center mb-2">أرسل رسالة</h2>
              <p className="text-muted-foreground text-center mb-8">سنرد عليك في أقرب وقت ممكن</p>

              {sent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center font-medium">
                  ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+213 XX XX XX XX"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">رسالتك *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="اكتب استفساراتك أو طلباتك هنا..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full h-13 text-base font-bold">
                  إرسال الرسالة
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
