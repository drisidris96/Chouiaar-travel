import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <MapPinOff className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-foreground mb-4">لقد ضللت الطريق!</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        الصفحة التي تبحث عنها غير موجودة. ربما تم تغيير مسار الرحلة أو حذفت الوجهة.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
}
