import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

// Layouts
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import Trips from "@/pages/Trips";
import TripDetails from "@/pages/TripDetails";
import Login from "@/pages/Login";
import Visas from "@/pages/Visas";
import Umrah from "@/pages/Umrah";
import Contact from "@/pages/Contact";
import Reservations from "@/pages/Reservations";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageTrips from "@/pages/admin/ManageTrips";
import ManageBookings from "@/pages/admin/ManageBookings";
import ManageReservations from "@/pages/admin/ManageReservations";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  
  if (!user || user.role !== "admin") {
    setLocation("/login");
    return null;
  }

  return <Component />;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  
  const tabs = [
    { path: "/admin", label: "نظرة عامة" },
    { path: "/admin/trips", label: "الرحلات" },
    { path: "/admin/bookings", label: "الحجوزات القديمة" },
    { path: "/admin/reservations", label: "🎫 طلبات الحجز" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm sticky top-28">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.path}
                onClick={() => setLocation(tab.path)}
                className={`w-full text-right px-4 py-3 rounded-xl transition-all ${
                  location === tab.path 
                    ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/trips" component={Trips} />
          <Route path="/trips/:id" component={TripDetails} />
          <Route path="/visas" component={Visas} />
          <Route path="/umrah" component={Umrah} />
          <Route path="/contact" component={Contact} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/login" component={Login} />

          {/* Admin Routes */}
          <Route path="/admin">
            {() => (
              <ProtectedRoute component={() => (
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              )} />
            )}
          </Route>
          <Route path="/admin/trips">
            {() => (
              <ProtectedRoute component={() => (
                <AdminLayout>
                  <ManageTrips />
                </AdminLayout>
              )} />
            )}
          </Route>
          <Route path="/admin/bookings">
            {() => (
              <ProtectedRoute component={() => (
                <AdminLayout>
                  <ManageBookings />
                </AdminLayout>
              )} />
            )}
          </Route>
          <Route path="/admin/reservations">
            {() => (
              <ProtectedRoute component={() => (
                <AdminLayout>
                  <ManageReservations />
                </AdminLayout>
              )} />
            )}
          </Route>

          {/* Fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <div dir="rtl" className="antialiased selection:bg-primary/20 selection:text-primary">
              <Router />
            </div>
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
