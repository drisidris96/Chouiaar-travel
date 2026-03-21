import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Home, FileText, Star, CalendarCheck, Phone, Sparkles } from "lucide-react";
import { useState } from "react";
import { ServiceRequestModal } from "@/components/ServiceRequestModal";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const links = [
    { href: "/",             label: "الرئيسية",            icon: Home },
    { href: "/visas",        label: "الفيزات الإلكترونية",  icon: FileText },
    { href: "/umrah",        label: "العمرة",                icon: Star },
    { href: "/reservations", label: "الحجوزات",              icon: CalendarCheck },
    { href: "/contact",      label: "اتصل بنا",              icon: Phone },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-md">
        {/* Top Bar */}
        <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold tracking-wide">
          وكالة شويعر للسياحة والأسفار &nbsp;|&nbsp; Chouiaar Travel Agency
        </div>

        {/* Main Row: Logo + Actions */}
        <div className="bg-background/95 backdrop-blur border-b border-border/40">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <img
                src="/images/logo-chouiaar.jpg"
                alt="وكالة شويعر"
                className="h-12 w-auto rounded-xl object-contain border border-border/30 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-base font-bold text-foreground font-serif">وكالة شويعر</span>
                <span className="text-xs text-muted-foreground">للسياحة والأسفار</span>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <Button variant={location.startsWith("/admin") ? "default" : "outline"} size="sm" className="gap-1.5 rounded-full">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">الإدارة</span>
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">خروج</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full font-semibold px-4 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    دخول الإدارة
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Nav Buttons Row (ALL screen sizes) ── */}
        <div className="bg-background border-b border-border/40 overflow-x-auto">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 min-w-max mx-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <button
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-card text-foreground border-border/50 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {link.label}
                  </button>
                </Link>
              );
            })}

            {/* ── خدمات أخرى button ── */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border bg-gradient-to-l from-violet-500 to-primary text-white border-transparent shadow-md shadow-primary/20 hover:opacity-90 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              خدمات أخرى
            </button>
          </div>
        </div>
      </header>

      {/* Service Request Modal */}
      <ServiceRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
