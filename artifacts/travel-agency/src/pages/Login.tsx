import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LockKeyhole, UserPlus, KeyRound, CheckCircle, Eye, EyeOff, ShieldCheck, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "register" | "verify" | "forgot" | "reset" | "done";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
const API = BASE_URL.replace(/\/$/, "") + "/api";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const searchStr = useSearch();
  const initialMode = new URLSearchParams(searchStr).get("tab") === "register" ? "register" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [displayedCode, setDisplayedCode] = useState("");
  const [forgotValue, setForgotValue] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");

  if (user) {
    if (user.role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/");
    }
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();

      if (res.status === 403 && data.error === "not_verified") {
        setVerifyEmail(data.email);
        setDisplayedCode(data.verificationCode || "");
        setMode("verify");
        toast({ title: "الحساب غير مفعّل", description: "أدخل رمز التفعيل المرسل إليك" });
        return;
      }

      if (!res.ok) throw new Error(data.message);

      toast({ title: "تم تسجيل الدخول بنجاح" });

      if (data.user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "فشل تسجيل الدخول", description: err.message || "تأكد من صحة البريد الإلكتروني وكلمة المرور." });
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
    if (registerForm.password.length < 6) {
      toast({ variant: "destructive", title: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
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

      setVerifyEmail(registerForm.email);
      setDisplayedCode(data.verificationCode || "");
      setMode("verify");
      toast({ title: "تم إنشاء الحساب", description: "أدخل رمز التفعيل لتأكيد حسابك" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "فشل إنشاء الحساب", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: verifyEmail, code: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "تم تفعيل الحساب بنجاح!" });

      if (data.user?.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
      window.location.reload();
    } catch (err: any) {
      toast({ variant: "destructive", title: "رمز التفعيل غير صحيح", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: verifyEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDisplayedCode(data.verificationCode || "");
      toast({ title: "تم إعادة إرسال رمز التفعيل" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "خطأ", description: err.message });
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
        <div className="h-28 bg-secondary flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://pixabay.com/get/g2f61475b8824638980ec4a4d5b15a45a081b485f90d295cf6219c081b4bfeef3790834500ff785b687354820061fb67848d6d0ffc5959368b0edda725ef7a64b_1280.jpg')] bg-cover bg-center" />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center relative z-10 translate-y-7">
            {mode === "register" ? (
              <UserPlus className="w-7 h-7 text-primary" />
            ) : mode === "verify" ? (
              <ShieldCheck className="w-7 h-7 text-primary" />
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
            {mode === "login" && "تسجيل الدخول"}
            {mode === "register" && "إنشاء حساب جديد"}
            {mode === "verify" && "تفعيل الحساب"}
            {mode === "forgot" && "نسيت كلمة السر؟"}
            {mode === "reset" && "إعادة تعيين كلمة المرور"}
            {mode === "done" && "تم بنجاح!"}
          </CardTitle>
          <CardDescription>
            {mode === "login" && "أدخل بياناتك للوصول لحسابك"}
            {mode === "register" && "أنشئ حساباً جديداً للاستفادة من خدماتنا"}
            {mode === "verify" && "أدخل رمز التفعيل المرسل إلى بريدك الإلكتروني"}
            {mode === "forgot" && "أدخل بريدك الإلكتروني أو رقم هاتفك"}
            {mode === "reset" && "أدخل الرمز وكلمة المرور الجديدة"}
            {mode === "done" && "تم تغيير كلمة المرور بنجاح"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {(mode === "login" || mode === "register") && (
            <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-6">
              <button className={tabClass("login")} onClick={() => setMode("login")}>تسجيل الدخول</button>
              <button className={tabClass("register")} onClick={() => setMode("register")}>إنشاء حساب</button>
            </div>
          )}

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
                    minLength={6}
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

          {mode === "verify" && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-blue-700 font-medium">تم إرسال رمز التفعيل إلى:</p>
                <p className="text-sm text-blue-800 font-bold mt-1" dir="ltr">{verifyEmail}</p>
              </div>

              {displayedCode && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <p className="text-sm text-green-700 font-medium mb-1">رمز التفعيل:</p>
                  <p className="text-3xl font-bold text-green-800 tracking-[0.3em]">{displayedCode}</p>
                  <p className="text-xs text-green-600 mt-2">انسخ الرمز وأدخله في الحقل أدناه</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>رمز التفعيل (6 أرقام)</Label>
                <Input
                  required
                  dir="ltr"
                  className="h-14 bg-muted/50 rounded-xl text-center tracking-[0.4em] text-2xl font-bold"
                  placeholder="000000"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20" disabled={isLoading || verifyCode.length !== 6}>
                {isLoading ? "جاري التحقق..." : "تفعيل الحساب"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={handleResendCode} className="text-primary hover:underline" disabled={isLoading}>
                  إعادة إرسال الرمز
                </button>
                <button type="button" onClick={() => setMode("login")} className="text-muted-foreground hover:text-foreground">
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 text-center">
                أدخل بريدك الإلكتروني أو رقم هاتفك المسجل لاسترجاع حسابك
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
                العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={handleReset} className="space-y-5">
              {resetToken && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                  <p className="text-sm text-green-700 font-medium mb-1">رمز الاسترجاع الخاص بك:</p>
                  <p className="text-2xl font-bold text-green-800 tracking-widest">{resetToken}</p>
                  <p className="text-xs text-green-600 mt-1">انسخ الرمز وأدخله في الحقل أدناه</p>
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
