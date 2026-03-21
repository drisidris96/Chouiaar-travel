import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "الواجهة الرئيسية" },
    { href: "/visas", label: "الفيزات الإلكترونية" },
    { href: "/umrah", label: "العمرة" },
    { href: "/trips", label: "الرحلات المنظمة" },
    { href: "/contact", label: "اتصل بنا" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md">
      {/* Top Bar - Agency Name */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold tracking-wide">
        وكالة شوعير للسياحة والأسفار &nbsp;|&nbsp; Chouiaar Travel Agency
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <img
            src="/images/logo-chouiaar.jpg"
            alt="وكالة شوعير"
            className="h-14 w-auto rounded-xl object-contain shadow-sm border border-border/30 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-lg font-bold text-foreground font-serif">وكالة شوعير</span>
            <span className="text-xs text-muted-foreground">للسياحة والأسفار</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                location === link.href
                  ? "bg-primary/15 text-primary font-bold"
                  : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant={location.startsWith("/admin") ? "default" : "outline"}
                    size="sm"
                    className="gap-2 rounded-full hidden sm:flex"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    الإدارة
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 hidden sm:flex"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-semibold px-5 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all hidden sm:flex"
              >
                دخول الإدارة
              </Button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/98 px-4 py-4 flex flex-col gap-2 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                location === link.href
                  ? "bg-primary/15 text-primary font-bold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border/30 mt-2 pt-3">
            {user ? (
              <div className="flex gap-2">
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}>
                    <Button size="sm" className="gap-2 rounded-full">
                      <LayoutDashboard className="w-4 h-4" />
                      الإدارة
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full text-destructive"
                  onClick={() => { logout(); setMenuOpen(false); }}
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm" className="rounded-full w-full">
                  دخول الإدارة
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
