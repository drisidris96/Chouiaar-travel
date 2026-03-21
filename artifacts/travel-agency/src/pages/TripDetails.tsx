import { useState } from "react";
import { useRoute } from "wouter";
import { useGetTripById, useCreateBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Users, Star, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

export default function TripDetails() {
  const [, params] = useRoute("/trips/:id");
  const tripId = params?.id ? parseInt(params.id, 10) : 0;
  const { toast } = useToast();
  
  const { data: trip, isLoading, isError } = useGetTripById(tripId, {
    query: { enabled: !!tripId }
  });

  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: () => {
        toast({
          title: "تم الحجز بنجاح!",
          description: "سنتواصل معك قريباً لتأكيد تفاصيل الحجز.",
        });
        setFormData({
          guestName: "",
          guestEmail: "",
          guestPhone: "",
          numberOfPeople: 1,
          specialRequests: ""
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء محاولة الحجز. يرجى المحاولة مرة أخرى.",
        });
      }
    }
  });

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfPeople: 1,
    specialRequests: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;
    createBooking.mutate({
      data: {
        tripId: trip.id,
        ...formData
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-8">
        <Skeleton className="w-full h-[50vh] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-2">عذراً، لم نتمكن من العثور على الرحلة</h2>
          <p className="text-muted-foreground">قد تكون الرحلة غير متاحة أو تم حذفها.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img
          src={trip.imageUrl || `https://picsum.photos/seed/${trip.id}/1920/1080`}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-card rounded-3xl p-8 shadow-xl shadow-black/5 border border-border/50">
              <div className="flex flex-wrap items-center gap-4 text-primary font-medium mb-4">
                <span className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {trip.destination}, {trip.country}
                </span>
                <span className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  {trip.rating} ({trip.reviewCount} تقييم)
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
                {trip.title}
              </h1>

              <div className="flex flex-wrap gap-8 py-6 border-y border-border/50 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المدة</p>
                    <p className="font-bold text-foreground">{trip.duration} أيام</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التاريخ</p>
                    <p className="font-bold text-foreground">
                      {format(new Date(trip.startDate), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الشواغر</p>
                    <p className="font-bold text-foreground">{trip.availableSpots} من {trip.maxCapacity}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold mb-4">عن الرحلة</h3>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {trip.description}
                </p>
              </div>

              {trip.includes && trip.includes.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-serif font-bold mb-6">ماذا تشمل الرحلة؟</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trip.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                        <span className="text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 border-border/50 shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
              <div className="bg-secondary text-secondary-foreground p-6 text-center">
                <p className="text-secondary-foreground/80 mb-2">احجز مقعدك الآن</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold font-sans tracking-tight">
                    {trip.price.toLocaleString()}
                  </span>
                  <span className="text-lg">ر.س</span>
                </div>
                <p className="text-sm mt-2 opacity-80">للشخص الواحد</p>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input 
                      id="name" 
                      required 
                      className="bg-muted/50 rounded-xl"
                      value={formData.guestName}
                      onChange={e => setFormData({...formData, guestName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      className="bg-muted/50 rounded-xl text-left" 
                      dir="ltr"
                      value={formData.guestEmail}
                      onChange={e => setFormData({...formData, guestEmail: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input 
                      id="phone" 
                      required 
                      className="bg-muted/50 rounded-xl text-left" 
                      dir="ltr"
                      value={formData.guestPhone}
                      onChange={e => setFormData({...formData, guestPhone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="people">عدد الأشخاص</Label>
                    <Input 
                      id="people" 
                      type="number" 
                      min="1" 
                      max={trip.availableSpots} 
                      required 
                      className="bg-muted/50 rounded-xl"
                      value={formData.numberOfPeople}
                      onChange={e => setFormData({...formData, numberOfPeople: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">ملاحظات إضافية (اختياري)</Label>
                    <Textarea 
                      id="requests" 
                      className="bg-muted/50 rounded-xl resize-none" 
                      rows={3}
                      value={formData.specialRequests}
                      onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex justify-between font-bold text-lg mb-6">
                      <span>الإجمالي:</span>
                      <span className="text-primary font-sans">
                        {(trip.price * formData.numberOfPeople).toLocaleString()} ر.س
                      </span>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-lg shadow-lg shadow-primary/25"
                      disabled={createBooking.isPending || trip.availableSpots < 1}
                    >
                      {createBooking.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
