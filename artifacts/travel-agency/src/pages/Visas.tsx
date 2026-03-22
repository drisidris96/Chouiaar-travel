import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Globe, Search, User, CreditCard, Calendar, MapPin, FileText,
  Camera, Upload, CheckCircle, ChevronLeft, Phone, Briefcase,
  X, Image as ImageIcon
} from "lucide-react";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") + "/api";

type Country = { code: string; name: string; flag: string; note?: string };
type Continent = { name: string; emoji: string; countries: Country[] };

const CONTINENTS: Continent[] = [
  {
    name: "آسيا والشرق الأوسط",
    emoji: "🌏",
    countries: [
      { code: "AE", name: "الإمارات العربية المتحدة", flag: "🇦🇪" },
      { code: "OM", name: "سلطنة عمان", flag: "🇴🇲" },
      { code: "BH", name: "البحرين", flag: "🇧🇭" },
      { code: "QA", name: "قطر", flag: "🇶🇦" },
      { code: "JO", name: "الأردن", flag: "🇯🇴" },
      { code: "SA", name: "السعودية", flag: "🇸🇦" },
      { code: "AZ", name: "أذربيجان", flag: "🇦🇿" },
      { code: "AM", name: "أرمينيا", flag: "🇦🇲" },
      { code: "UZ", name: "أوزبكستان", flag: "🇺🇿" },
      { code: "TJ", name: "طاجيكستان", flag: "🇹🇯" },
      { code: "LK", name: "سريلانكا", flag: "🇱🇰" },
      { code: "SG", name: "سنغافورة", flag: "🇸🇬" },
      { code: "VN", name: "فيتنام", flag: "🇻🇳" },
      { code: "PK", name: "باكستان", flag: "🇵🇰" },
      { code: "MM", name: "ميانمار", flag: "🇲🇲" },
      { code: "IR", name: "إيران", flag: "🇮🇷" },
      { code: "KG", name: "قيرغيزستان", flag: "🇰🇬" },
      { code: "KZ", name: "كازاخستان", flag: "🇰🇿" },
    ],
  },
  {
    name: "إفريقيا",
    emoji: "🌍",
    countries: [
      { code: "KE", name: "كينيا", flag: "🇰🇪", note: "عبر نظام تصريح السفر الإلكتروني eTA" },
      { code: "ZA", name: "جنوب أفريقيا", flag: "🇿🇦" },
      { code: "ET", name: "إثيوبيا", flag: "🇪🇹" },
      { code: "TZ", name: "تنزانيا", flag: "🇹🇿" },
      { code: "RW", name: "رواندا", flag: "🇷🇼" },
      { code: "CI", name: "كوت ديفوار", flag: "🇨🇮" },
      { code: "GA", name: "الغابون", flag: "🇬🇦" },
      { code: "ZM", name: "زامبيا", flag: "🇿🇲" },
      { code: "LS", name: "ليسوتو", flag: "🇱🇸" },
      { code: "DJ", name: "جيبوتي", flag: "🇩🇯" },
    ],
  },
  {
    name: "الأمريكتان ومنطقة البحر الكاريبي",
    emoji: "🌎",
    countries: [
      { code: "CO", name: "كولومبيا", flag: "🇨🇴" },
      { code: "AG", name: "أنتيغوا وباربودا", flag: "🇦🇬" },
      { code: "BS", name: "جزر البهاما", flag: "🇧🇸" },
      { code: "KN", name: "سانت كيتس ونيفيس", flag: "🇰🇳" },
    ],
  },
  {
    name: "أوروبا وأوقيانوسيا",
    emoji: "🌐",
    countries: [
      { code: "AL", name: "ألبانيا", flag: "🇦🇱" },
      { code: "MD", name: "مولدوفا", flag: "🇲🇩" },
      { code: "AU", name: "أستراليا", flag: "🇦🇺", note: "تأشيرة زائر إلكترونية" },
    ],
  },
];

const ALL_COUNTRIES = CONTINENTS.flatMap(c => c.countries);

const VISA_TYPES = [
  { id: "tourism", label: "سياحية" },
  { id: "business", label: "أعمال" },
  { id: "medical", label: "علاجية" },
  { id: "transit", label: "عبور (ترانزيت)" },
  { id: "family", label: "زيارة عائلية" },
];

type Step = "country" | "form" | "done";

export default function Visas() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("country");
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", birthDate: "", birthPlace: "",
    profession: "", address: "", phone: "", passportNumber: "",
    passportIssueDate: "", passportIssuePlace: "", passportExpiryDate: "",
    travelDate: "", visaType: "tourism", duration: "", notes: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);

  const filteredContinents = search
    ? CONTINENTS.map(cont => ({
        ...cont,
        countries: cont.countries.filter(c =>
          c.name.includes(search) || c.code.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(cont => cont.countries.length > 0)
    : CONTINENTS;

  const handleFileChange = (file: File | null, type: "photo" | "passport") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "photo") {
        setPhoto(file);
        setPhotoPreview(e.target?.result as string);
      } else {
        setPassportPhoto(file);
        setPassportPreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      formData.append("destination", selectedCountry.name);
      if (photo) formData.append("photo", photo);
      if (passportPhoto) formData.append("passportPhoto", passportPhoto);

      const res = await fetch(`${BASE}/visa-requests`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep("done");
      toast({ title: "تم تسجيل طلب الفيزا بنجاح! 🎉" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "خطأ", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div dir="rtl">
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold mb-4">
              🌍 خدمة الفيزات الإلكترونية
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              طلب <span className="text-primary">فيزا إلكترونية</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              اختر الدولة واملأ الاستمارة وسنتكفل بالباقي — خدمة سريعة ومضمونة
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { s: "country", label: "اختر الدولة", num: 1 },
            { s: "form", label: "معلومات الطلب", num: 2 },
            { s: "done", label: "تم الإرسال", num: 3 },
          ].map((st, i) => (
            <div key={st.s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === st.s ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" :
                (["country","form","done"].indexOf(step) > i ? "bg-green-500 text-white" : "bg-muted text-muted-foreground")
              }`}>{st.num}</div>
              <span className={`text-sm font-medium hidden sm:inline ${step === st.s ? "text-primary" : "text-muted-foreground"}`}>{st.label}</span>
              {i < 2 && <div className="w-12 h-0.5 bg-border mx-2" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "country" && (
            <motion.div key="country" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="max-w-4xl mx-auto">
                <div className="relative mb-8">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    className="h-14 pr-12 text-lg rounded-2xl bg-card border-border/50"
                    placeholder="ابحث عن الدولة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {!search && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {CONTINENTS.map((cont) => (
                      <motion.button
                        key={cont.name}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveContinent(activeContinent === cont.name ? null : cont.name)}
                        className={`p-5 rounded-2xl border-2 text-center transition-all ${
                          activeContinent === cont.name
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border/50 bg-card hover:border-primary/40 hover:shadow-md"
                        }`}
                      >
                        <div className="text-3xl mb-2">{cont.emoji}</div>
                        <div className="font-bold text-sm">{cont.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{cont.countries.length} دولة</div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {filteredContinents.map((cont) => {
                  if (!search && activeContinent && activeContinent !== cont.name) return null;
                  if (!search && !activeContinent) return null;
                  return (
                    <div key={cont.name} className="mb-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-2xl">{cont.emoji}</span> {cont.name}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {cont.countries.map((country) => (
                          <motion.button
                            key={country.code}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setSelectedCountry(country); setStep("form"); }}
                            className={`p-4 rounded-2xl border-2 text-center transition-all hover:shadow-lg ${
                              selectedCountry?.code === country.code
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border/50 bg-card hover:border-primary/40"
                            }`}
                          >
                            <div className="text-3xl mb-2">{country.flag}</div>
                            <div className="font-bold text-sm">{country.name}</div>
                            {country.note && (
                              <div className="text-xs text-muted-foreground mt-1 leading-tight">{country.note}</div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {search && filteredContinents.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>لا توجد نتائج لبحثك</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === "form" && selectedCountry && (
            <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="max-w-3xl mx-auto">
                <button onClick={() => setStep("country")} className="flex items-center gap-2 text-primary hover:underline mb-6">
                  <ChevronLeft className="w-4 h-4" /> العودة لاختيار الدولة
                </button>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
                  <span className="text-4xl">{selectedCountry.flag}</span>
                  <div>
                    <h3 className="font-bold text-lg">فيزا إلكترونية — {selectedCountry.name}</h3>
                    {selectedCountry.note && <p className="text-sm text-muted-foreground">{selectedCountry.note}</p>}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-card border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" /> المعلومات الشخصية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>الاسم *</Label>
                        <Input required className="h-12 rounded-xl bg-muted/50" placeholder="الاسم" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>اللقب *</Label>
                        <Input required className="h-12 rounded-xl bg-muted/50" placeholder="اللقب" value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>تاريخ الميلاد *</Label>
                        <Input required type="date" className="h-12 rounded-xl bg-muted/50" dir="ltr" value={form.birthDate} onChange={(e) => updateForm("birthDate", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>مكان الميلاد *</Label>
                        <Input required className="h-12 rounded-xl bg-muted/50" placeholder="مثال: الجزائر العاصمة" value={form.birthPlace} onChange={(e) => updateForm("birthPlace", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>المهنة *</Label>
                        <Input required className="h-12 rounded-xl bg-muted/50" placeholder="مثال: موظف، تاجر، طالب..." value={form.profession} onChange={(e) => updateForm("profession", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>رقم الهاتف *</Label>
                        <Input required type="tel" dir="ltr" className="h-12 rounded-xl bg-muted/50" placeholder="+213 XX XX XX XX" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label>العنوان *</Label>
                        <Input required className="h-12 rounded-xl bg-muted/50" placeholder="العنوان الكامل" value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" /> معلومات جواز السفر
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>رقم الجواز *</Label>
                        <Input required dir="ltr" className="h-12 rounded-xl bg-muted/50" placeholder="رقم جواز السفر" value={form.passportNumber} onChange={(e) => updateForm("passportNumber", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>مكان الإصدار *</Label>
                        <Input required className="h-12 rounded-xl bg-muted/50" placeholder="مثال: الجزائر العاصمة" value={form.passportIssuePlace} onChange={(e) => updateForm("passportIssuePlace", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>تاريخ الإصدار *</Label>
                        <Input required type="date" dir="ltr" className="h-12 rounded-xl bg-muted/50" value={form.passportIssueDate} onChange={(e) => updateForm("passportIssueDate", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>تاريخ الانتهاء *</Label>
                        <Input required type="date" dir="ltr" className="h-12 rounded-xl bg-muted/50" value={form.passportExpiryDate} onChange={(e) => updateForm("passportExpiryDate", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" /> تفاصيل الفيزا
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>نوع الفيزا</Label>
                        <select
                          className="w-full h-12 rounded-xl bg-muted/50 border border-input px-3 text-sm"
                          value={form.visaType}
                          onChange={(e) => updateForm("visaType", e.target.value)}
                        >
                          {VISA_TYPES.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>تاريخ السفر المتوقع</Label>
                        <Input type="date" dir="ltr" className="h-12 rounded-xl bg-muted/50" value={form.travelDate} onChange={(e) => updateForm("travelDate", e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>مدة الإقامة المطلوبة</Label>
                        <Input className="h-12 rounded-xl bg-muted/50" placeholder="مثال: 15 يوم، شهر..." value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" /> الصور والمستندات
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-3 block">صورة شخصية</Label>
                        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, "photo")} />
                        {photoPreview ? (
                          <div className="relative w-40 h-48 mx-auto">
                            <img src={photoPreview} alt="صورة شخصية" className="w-full h-full object-cover rounded-xl border-2 border-primary/30" />
                            <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => photoRef.current?.click()}
                            className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                            <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                            <span className="text-sm text-muted-foreground">اضغط لرفع صورة شخصية</span>
                            <span className="text-xs text-muted-foreground/60">JPG, PNG — حد أقصى 5MB</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <Label className="mb-3 block">صورة جواز السفر</Label>
                        <input ref={passportRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, "passport")} />
                        {passportPreview ? (
                          <div className="relative w-full h-48 mx-auto">
                            <img src={passportPreview} alt="جواز السفر" className="w-full h-full object-cover rounded-xl border-2 border-primary/30" />
                            <button type="button" onClick={() => { setPassportPhoto(null); setPassportPreview(null); }} className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => passportRef.current?.click()}
                            className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                            <Upload className="w-10 h-10 text-muted-foreground/50" />
                            <span className="text-sm text-muted-foreground">اضغط لرفع صورة الجواز</span>
                            <span className="text-xs text-muted-foreground/60">JPG, PNG, PDF — حد أقصى 5MB</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> ملاحظات إضافية
                    </h3>
                    <textarea
                      className="w-full h-28 rounded-xl bg-muted/50 border border-input p-4 text-sm resize-none"
                      placeholder="أي ملاحظات أو طلبات خاصة..."
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? "جاري الإرسال..." : "📋 إرسال طلب الفيزا"}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-16">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">تم إرسال طلبك بنجاح! 🎉</h2>
              <p className="text-muted-foreground text-lg mb-3">
                تم تسجيل طلب الفيزا الإلكترونية لـ <span className="font-bold text-primary">{selectedCountry?.name}</span>
              </p>
              <p className="text-muted-foreground mb-8">سيتواصل معك فريقنا قريباً لتأكيد الطلب وإتمام الإجراءات</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => { setStep("country"); setForm({ firstName: "", lastName: "", birthDate: "", birthPlace: "", profession: "", address: "", phone: "", passportNumber: "", passportIssueDate: "", passportIssuePlace: "", passportExpiryDate: "", travelDate: "", visaType: "tourism", duration: "", notes: "" }); setPhoto(null); setPassportPhoto(null); setPhotoPreview(null); setPassportPreview(null); setSelectedCountry(null); }} className="rounded-xl h-12 px-8">
                  طلب فيزا أخرى
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"} className="rounded-xl h-12 px-8">
                  العودة للرئيسية
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
