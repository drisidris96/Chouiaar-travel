import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LockKeyhole, UserPlus, KeyRound, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "register" | "forgot" | "reset" | "done";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = BASE_URL.replace(/\/$/, "") + "/api";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [forgotValue, setForgotValue] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email: loginForm.email, password: loginForm.password });
      toast({ title: "تم تسجيل الدخول بنجاح" });
      setLocation("/admin");
    } catch {
      toast({ variant: "destructive", title: "فشل تسجيل الدخول", description: "تأكد من صحة البريد الإلكتروني وكلمة المرور." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirm) {
      toast({ variant: "destructive", title: "كلمتا المرور غير متطابقتين" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          phone: registerForm.phone || undefined,
          password: registerForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "تم إنشاء الحساب بنجاح! 🎉" });
      setLocation("/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "فشل إنشاء الحساب", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: forgotValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetToken(data.resetToken);
      setMode("reset");
      toast({ title: "تم إرسال رمز الاسترجاع" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "خطأ", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNew) {
      toast({ variant: "destructive", title: "كلمتا المرور غير متطابقتين" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput || resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMode("done");
    } catch (err: any) {
      toast({ variant: "destructive", title: "فشل تغيير كلمة المرور", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const tabClass = (m: Mode) =>
    `flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
      mode === m
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-muted/30 py-16 px-4" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden rounded-3xl">
        {/* Header banner */}
        <div className="h-28 bg-secondary flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://pixabay.com/get/g2f61475b8824638980ec4a4d5b15a45a081b485f90d295cf6219c081b4bfeef3790834500ff785b687354820061fb67848d6d0ffc5959368b0edda725ef7a64b_1280.jpg')] bg-cover bg-center" />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center relative z-10 translate-y-7">
            {mode === "register" ? (
              <UserPlus className="w-7 h-7 text-primary" />
            ) : mode === "forgot" || mode === "reset" ? (
              <KeyRound className="w-7 h-7 text-primary" />
            ) : mode === "done" ? (
              <CheckCircle className="w-7 h-7 text-green-500" />
            ) : (
              <LockKeyhole className="w-7 h-7 text-primary" />
            )}
          </div>
        </div>

        <CardHeader className="text-center pt-12 pb-4">
          <CardTitle className="text-2xl font-serif">
            {mode === "login" && "دخول الإدارة"}
            {mode === "register" && "إنشاء حساب جديد"}
            {mode === "forgot" && "نسيت كلمة السر؟"}
            {mode === "reset" && "إعادة تعيين كلمة المرور"}
            {mode === "done" && "تم بنجاح! ✅"}
          </CardTitle>
          <CardDescription>
            {mode === "login" && "أدخل بياناتك للوصول للوحة التحكم"}
            {mode === "register" && "أنشئ حساباً جديداً للوصول للخدمات"}
            {mode === "forgot" && "أدخل بريدك الإلكتروني أو رقم هاتفك"}
            {mode === "reset" && "أدخل الرمز وكلمة المرور الجديدة"}
            {mode === "done" && "تم تغيير كلمة المرور بنجاح"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {/* Tabs: login / register */}
          {(mode === "login" || mode === "register") && (
            <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-6">
              <button className={tabClass("login")} onClick={() => setMode("login")}>تسجيل الدخول</button>
              <button className={tabClass("register")} onClick={() => setMode("register")}>إنشاء حساب</button>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>كلمة المرور</Label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    required
                    dir="ltr"
                    className="h-12 bg-muted/50 rounded-xl pl-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-sm text-primary hover:underline w-full text-left"
              >
                نسيت كلمة السر؟
              </button>
              <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label>الاسم الكامل *</Label>
                <Input
                  required
                  className="h-12 bg-muted/50 rounded-xl"
                  placeholder="أدخل اسمك الكامل"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>البريد الإلكتروني *</Label>
                <Input
                  type="email"
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>رقم الهاتف <span className="text-muted-foreground text-xs">(اختياري)</span></Label>
                <Input
                  type="tel"
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  placeholder="+213 XX XX XX XX"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>كلمة المرور *</Label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    required
                    dir="ltr"
                    className="h-12 bg-muted/50 rounded-xl pl-10"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>تأكيد كلمة المرور *</Label>
                <Input
                  type="password"
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  value={registerForm.confirm}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
              </Button>
            </form>
          )}

          {/* ── FORGOT PASSWORD FORM ── */}
          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 text-center">
                💡 أدخل بريدك الإلكتروني أو رقم هاتفك المسجل لاسترجاع حسابك
              </div>
              <div className="space-y-1.5">
                <Label>البريد الإلكتروني أو رقم الهاتف</Label>
                <Input
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  placeholder="example@email.com  أو  +213XXXXXXXXX"
                  value={forgotValue}
                  onChange={(e) => setForgotValue(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "جاري البحث..." : "إرسال رمز الاسترجاع"}
              </Button>
              <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground">
                ← العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {/* ── RESET PASSWORD FORM ── */}
          {mode === "reset" && (
            <form onSubmit={handleReset} className="space-y-5">
              {resetToken && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <p className="text-sm text-green-700 font-medium mb-1">رمز الاسترجاع الخاص بك:</p>
                  <p className="text-2xl font-bold text-green-800 tracking-widest">{resetToken}</p>
                  <p className="text-xs text-green-600 mt-1">احتفظ بهذا الرمز — سيُرسل عبر الإيميل أو الهاتف في النسخة النهائية</p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>رمز الاسترجاع</Label>
                <Input
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl text-center tracking-widest text-lg font-bold"
                  placeholder="XXXXXXXX"
                  value={tokenInput || resetToken}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-1.5">
                <Label>كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>تأكيد كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  required
                  dir="ltr"
                  className="h-12 bg-muted/50 rounded-xl"
                  value={confirmNew}
                  onChange={(e) => setConfirmNew(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
              </Button>
            </form>
          )}

          {/* ── DONE ── */}
          {mode === "done" && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-muted-foreground">تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
              <Button className="w-full h-12 rounded-xl" onClick={() => setMode("login")}>
                تسجيل الدخول
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
