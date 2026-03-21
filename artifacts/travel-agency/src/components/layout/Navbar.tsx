import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/trips", label: "الرحلات" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <MapPin className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              رحلات<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant={location.startsWith("/admin") ? "default" : "outline"} className="gap-2 rounded-full">
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة الإدارة
                  </Button>
                </Link>
              )}
              <Button variant="ghost" className="gap-2 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => logout()}>
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full font-semibold px-6 border-primary/20 hover:bg-primary/5">
                دخول الإدارة
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
