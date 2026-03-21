import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast({
        title: "تم تسجيل الدخول بنجاح",
      });
      setLocation("/admin");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: "تأكد من صحة البريد الإلكتروني وكلمة المرور.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-20 px-4">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden rounded-3xl">
        <div className="h-32 bg-secondary flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://pixabay.com/get/g2f61475b8824638980ec4a4d5b15a45a081b485f90d295cf6219c081b4bfeef3790834500ff785b687354820061fb67848d6d0ffc5959368b0edda725ef7a64b_1280.jpg')] bg-cover bg-center mix-blend-overlay" />
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center relative z-10 translate-y-8">
            <LockKeyhole className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <CardHeader className="text-center pt-16 pb-8">
          <CardTitle className="text-3xl font-serif">دخول الإدارة</CardTitle>
          <CardDescription>أدخل بيانات الاعتماد الخاصة بك للوصول للوحة التحكم</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                required
                className="h-12 bg-muted/50 text-left rounded-xl"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                required
                className="h-12 bg-muted/50 text-left rounded-xl"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
