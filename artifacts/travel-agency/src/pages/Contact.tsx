import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Upload, X, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [sent, setSent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming).filter(
      (f) => !files.find((ex) => ex.name === f.name && ex.size === f.size)
    );
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = (f: File) => f.type.startsWith("image/");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", phone: "", email: "", message: "" });
    setFiles([]);
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
      lines: ["الجزائر", "وكالة شويعر للسياحة والأسفار"],
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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
                    {item.lines.map((l, j) => <p key={j} className="text-muted-foreground text-sm">{l}</p>)}
                  </a>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    {item.lines.map((l, j) => <p key={j} className="text-muted-foreground text-sm">{l}</p>)}
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
                    <label className="block text-sm font-semibold mb-2">الاسم الكامل *</label>
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
                    <label className="block text-sm font-semibold mb-2">رقم الهاتف *</label>
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
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">رسالتك *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="اكتب استفساراتك أو طلباتك هنا..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    المرفقات <span className="text-muted-foreground font-normal">(صور أو ملفات)</span>
                  </label>

                  {/* Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      handleFiles(e.dataTransfer.files);
                    }}
                    className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                      dragging
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground">اسحب الملفات هنا أو انقر للاختيار</p>
                      <p className="text-sm text-muted-foreground">
                        يدعم: صور (JPG, PNG, GIF) — PDF — Word — Excel
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-4 py-2.5 bg-muted/40 rounded-xl border border-border/40"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {isImage(file)
                              ? <FileImage className="w-4 h-4 text-primary" />
                              : <File className="w-4 h-4 text-primary" />
                            }
                          </div>
                          {isImage(file) && (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-10 h-10 rounded-lg object-cover border border-border/40 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground text-center">
                        {files.length} ملف مرفق
                      </p>
                    </div>
                  )}
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
