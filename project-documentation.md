# وكالة شويعر للسياحة والأسفار — CHOUIAAR TRAVEL AGENCY
## الملف الكامل للمشروع — Complete Project Documentation

---

## 1. نظرة عامة | Overview

مشروع متكامل لوكالة سياحة جزائرية يشمل:
- **موقع ويب** (React + Vite) — واجهة أمامية كاملة بالعربية مع دعم الفرنسية والإنجليزية
- **خادم API** (Express 5 + PostgreSQL) — واجهة خلفية مع نظام مصادقة وإدارة
- **تطبيق جوال** (Expo React Native) — تطبيق مرافق للهاتف
- **لوحة إدارة** — لإدارة الرحلات والحجوزات والطلبات

---

## 2. معلومات الوكالة | Agency Info

| البيان | القيمة |
|--------|--------|
| الاسم بالعربية | وكالة شويعر للسياحة والأسفار |
| الاسم بالإنجليزية | CHOUIAAR TRAVEL AGENCY |
| الهاتف | +213 74 71 84 96 |
| واتساب | +213 774 71 84 96 |
| البريد الإلكتروني | chouiaartravelagency@gmail.com |
| فيسبوك | https://www.facebook.com/share/1CEBKfuqDo/ |
| العملة | د.ج (دينار جزائري) |

---

## 3. التقنيات المستخدمة | Tech Stack

### الواجهة الأمامية (Frontend)
- **React 19** + **Vite** + **TypeScript 5.9**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **Wouter** (توجيه/Routing)
- **خط Amiri** للعربية
- **نظام i18n مخصص** (عربي/فرنسي/إنجليزي)

### الخادم (Backend)
- **Express 5** + **TypeScript**
- **PostgreSQL** + **Drizzle ORM**
- **express-session** (جلسات/Sessions)
- **Zod v4** (تحقق من البيانات)
- **SHA-256 + salt** (تشفير كلمات المرور)

### تطبيق الجوال (Mobile)
- **Expo** + **React Native**
- **Expo Router** (تنقل بالتبويبات)
- **خط Cairo** للعربية
- ألوان: ذهبي `#C8A54C` + أزرق داكن `#1B3A5C`

### أدوات البناء
- **pnpm workspaces** (Monorepo)
- **esbuild** (بناء الخادم)
- **Orval** (توليد أكواد API من OpenAPI)

---

## 4. هيكل المشروع | Project Structure

```
├── artifacts/
│   ├── travel-agency/          # موقع الويب (React + Vite)
│   │   ├── src/
│   │   │   ├── App.tsx                  # التطبيق الرئيسي + التوجيه
│   │   │   ├── main.tsx                 # نقطة الدخول
│   │   │   ├── i18n/
│   │   │   │   ├── translations.ts      # جميع الترجمات (1249 سطر)
│   │   │   │   └── LanguageContext.tsx   # مزود اللغة + أعلام الدول
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx             # الصفحة الرئيسية
│   │   │   │   ├── Trips.tsx            # صفحة الرحلات
│   │   │   │   ├── TripDetails.tsx      # تفاصيل الرحلة
│   │   │   │   ├── Visas.tsx            # الفيزات الإلكترونية
│   │   │   │   ├── Umrah.tsx            # العمرة
│   │   │   │   ├── Reservations.tsx     # الحجوزات
│   │   │   │   ├── Contact.tsx          # اتصل بنا
│   │   │   │   ├── Login.tsx            # تسجيل الدخول/إنشاء حساب
│   │   │   │   ├── Profile.tsx          # الملف الشخصي
│   │   │   │   ├── not-found.tsx        # صفحة 404
│   │   │   │   └── admin/
│   │   │   │       ├── Dashboard.tsx         # لوحة القيادة
│   │   │   │       ├── ManageTrips.tsx       # إدارة الرحلات
│   │   │   │       ├── ManageBookings.tsx    # إدارة الحجوزات
│   │   │   │       ├── ManageReservations.tsx # إدارة طلبات الحجز
│   │   │   │       ├── ManageServiceRequests.tsx # إدارة الخدمات
│   │   │   │       └── ManageVisaRequests.tsx    # إدارة طلبات الفيزا
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Navbar.tsx       # شريط التنقل
│   │   │   │   │   └── Footer.tsx       # التذييل
│   │   │   │   ├── TripCard.tsx         # بطاقة الرحلة
│   │   │   │   ├── ServiceRequestModal.tsx  # نافذة طلب الخدمة
│   │   │   │   └── ui/                  # مكونات shadcn/ui
│   │   │   └── hooks/
│   │   │       ├── use-auth.tsx         # هوك المصادقة
│   │   │       ├── use-mobile.tsx       # كشف الشاشة الصغيرة
│   │   │       └── use-toast.ts         # إشعارات
│   │   └── vite.config.ts
│   │
│   ├── api-server/              # خادم API (Express 5)
│   │   ├── src/
│   │   │   ├── index.ts                 # نقطة الدخول + بذر المسؤول
│   │   │   ├── app.ts                   # إعداد Express
│   │   │   ├── middleware/
│   │   │   │   └── requireAdmin.ts      # حماية المسارات (RBAC)
│   │   │   └── routes/
│   │   │       ├── index.ts             # تجميع المسارات
│   │   │       ├── auth.ts              # المصادقة
│   │   │       ├── trips.ts             # الرحلات
│   │   │       ├── bookings.ts          # الحجوزات
│   │   │       ├── reservations.ts      # طلبات الحجز
│   │   │       ├── service-requests.ts  # طلبات الخدمة
│   │   │       ├── visa-requests.ts     # طلبات الفيزا
│   │   │       ├── admin.ts             # مسارات الإدارة
│   │   │       └── health.ts            # فحص الصحة
│   │   └── build.mjs
│   │
│   ├── mobile-app/              # تطبيق الجوال (Expo)
│   │   ├── app/
│   │   │   ├── _layout.tsx              # التخطيط الرئيسي
│   │   │   ├── +not-found.tsx           # صفحة 404
│   │   │   └── (tabs)/
│   │   │       ├── _layout.tsx          # تخطيط التبويبات
│   │   │       ├── index.tsx            # الرئيسية
│   │   │       ├── trips.tsx            # الرحلات
│   │   │       ├── umrah.tsx            # العمرة
│   │   │       ├── visas.tsx            # الفيزات
│   │   │       └── more.tsx             # المزيد
│   │   └── contexts/
│   │       └── AuthContext.tsx           # سياق المصادقة
│   │
│   └── mockup-sandbox/          # بيئة تطوير المكونات
│
├── lib/
│   ├── db/                      # قاعدة البيانات (Drizzle ORM)
│   │   ├── src/schema/
│   │   │   ├── users.ts
│   │   │   ├── trips.ts
│   │   │   ├── bookings.ts
│   │   │   ├── reservations.ts
│   │   │   ├── service_requests.ts
│   │   │   └── visa_requests.ts
│   │   └── drizzle.config.ts
│   ├── api-spec/                # مواصفات OpenAPI
│   ├── api-client-react/        # React Query hooks مولدة
│   └── api-zod/                 # Zod schemas مولدة
│
├── scripts/                     # سكريبتات مساعدة
├── pnpm-workspace.yaml
├── tsconfig.json
└── package.json
```

---

## 5. قاعدة البيانات | Database Schema

### جدول المستخدمين (users)
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | serial (PK) | معرف فريد |
| email | text (unique) | البريد الإلكتروني |
| password | text | كلمة المرور (SHA-256 + salt) |
| name | text | الاسم الكامل |
| phone | text | رقم الهاتف |
| role | enum (admin/user) | الدور |
| verified | boolean | حالة التحقق |
| verification_code | text | رمز التحقق (6 أرقام) |
| reset_token | text | رمز إعادة تعيين كلمة المرور |
| created_at | timestamp | تاريخ الإنشاء |

### جدول الرحلات (trips)
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | serial (PK) | معرف فريد |
| title | text | عنوان الرحلة |
| description | text | وصف الرحلة |
| destination | text | الوجهة |
| country | text | البلد |
| image_url | text | صورة الرحلة |
| price | double | السعر (د.ج) |
| duration | integer | المدة (أيام) |
| max_capacity | integer | السعة القصوى |
| available_spots | integer | الأماكن المتاحة |
| start_date | date | تاريخ البداية |
| end_date | date | تاريخ النهاية |
| featured | boolean | مميزة |
| rating | double | التقييم |
| review_count | integer | عدد التقييمات |
| includes | text[] | ما تشمله الرحلة |
| created_at | timestamp | تاريخ الإنشاء |

### جدول الحجوزات (bookings)
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | serial (PK) | معرف فريد |
| trip_id | integer (FK → trips) | معرف الرحلة |
| user_id | integer (FK → users) | معرف المستخدم |
| guest_name | text | اسم الضيف |
| guest_email | text | بريد الضيف |
| guest_phone | text | هاتف الضيف |
| number_of_people | integer | عدد الأشخاص |
| total_price | double | السعر الإجمالي |
| status | enum (pending/confirmed/cancelled) | الحالة |
| special_requests | text | طلبات خاصة |
| created_at | timestamp | تاريخ الإنشاء |

### جدول طلبات الحجز (reservations)
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | serial (PK) | معرف فريد |
| type | enum (hotel/flight/both) | نوع الحجز |
| first_name | text | الاسم |
| last_name | text | اللقب |
| passport_number | text | رقم جواز السفر |
| destination | text | الوجهة |
| departure_date | date | تاريخ المغادرة |
| return_date | date | تاريخ العودة |
| notes | text | ملاحظات |
| status | enum (pending/confirmed/cancelled) | الحالة |
| created_at | timestamp | تاريخ الإنشاء |

### جدول طلبات الخدمة (service_requests)
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | serial (PK) | معرف فريد |
| first_name | text | الاسم |
| last_name | text | اللقب |
| address | text | العنوان |
| phone | text | الهاتف |
| passport_number | text | رقم الجواز |
| service_description | text | وصف الخدمة |
| status | enum (pending/in_progress/done/cancelled) | الحالة |
| created_at | timestamp | تاريخ الإنشاء |

### جدول طلبات الفيزا (visa_requests)
| العمود | النوع | الوصف |
|--------|-------|-------|
| id | serial (PK) | معرف فريد |
| first_name | text | الاسم |
| last_name | text | اللقب |
| birth_date | date | تاريخ الميلاد |
| birth_place | text | مكان الميلاد |
| profession | text | المهنة |
| address | text | العنوان |
| phone | text | الهاتف |
| passport_number | text | رقم الجواز |
| passport_issue_date | date | تاريخ إصدار الجواز |
| passport_issue_place | text | مكان إصدار الجواز |
| passport_expiry_date | date | تاريخ انتهاء الجواز |
| destination | text | البلد المطلوب |
| travel_date | date | تاريخ السفر |
| visa_type | text | نوع الفيزا (سياحة افتراضياً) |
| duration | text | المدة |
| photo_url | text | صورة شخصية |
| passport_photo_url | text | صورة الجواز |
| notes | text | ملاحظات |
| status | enum (pending/processing/approved/rejected/cancelled) | الحالة |
| admin_notes | text | ملاحظات المسؤول |
| created_at | timestamp | تاريخ الإنشاء |

---

## 6. مسارات API | API Routes

جميع المسارات تحت `/api`

### المصادقة `/api/auth`
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/auth/register` | إنشاء حساب جديد |
| POST | `/auth/login` | تسجيل الدخول (بالبريد أو الهاتف) |
| POST | `/auth/verify` | التحقق برمز 6 أرقام |
| POST | `/auth/resend-code` | إعادة إرسال رمز التحقق |
| POST | `/auth/forgot-password` | طلب إعادة تعيين كلمة المرور |
| POST | `/auth/reset-password` | إعادة تعيين كلمة المرور |
| POST | `/auth/logout` | تسجيل الخروج |
| GET | `/auth/me` | بيانات المستخدم الحالي |
| PUT | `/auth/profile` | تعديل الملف الشخصي (الاسم/الهاتف) |
| PUT | `/auth/change-password` | تغيير كلمة المرور |
| PUT | `/auth/change-email` | تغيير البريد الإلكتروني |

### الرحلات `/api/trips`
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/trips` | قائمة الرحلات |
| GET | `/trips/:id` | تفاصيل رحلة |

### الحجوزات `/api/bookings`
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/bookings` | إنشاء حجز جديد |

### طلبات الحجز `/api/reservations`
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/reservations` | إرسال طلب حجز (فندق/طيران) |

### طلبات الخدمة `/api/service-requests`
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/service-requests` | إرسال طلب خدمة |

### طلبات الفيزا `/api/visa-requests`
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/visa-requests` | إرسال طلب فيزا (مع رفع صور) |

### الإدارة `/api/admin` (تتطلب صلاحية admin)
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/admin/stats` | إحصائيات لوحة القيادة |
| POST | `/admin/trips` | إضافة رحلة |
| PUT | `/admin/trips/:id` | تعديل رحلة |
| DELETE | `/admin/trips/:id` | حذف رحلة |
| PATCH | `/admin/bookings/:id` | تحديث حالة الحجز |
| GET | `/admin/reservations` | قائمة طلبات الحجز |
| PATCH | `/admin/reservations/:id` | تحديث حالة طلب الحجز |
| GET | `/admin/service-requests` | قائمة طلبات الخدمة |
| PATCH | `/admin/service-requests/:id` | تحديث حالة طلب الخدمة |
| GET | `/admin/visa-requests` | قائمة طلبات الفيزا |
| PATCH | `/admin/visa-requests/:id` | تحديث حالة طلب الفيزا |

---

## 7. نظام المصادقة | Authentication System

### تدفق التسجيل
1. المستخدم يسجل بالبريد الإلكتروني + كلمة المرور + الاسم
2. النظام ينشئ رمز تحقق من 6 أرقام ويخزنه في قاعدة البيانات
3. الرمز يُعرض على الشاشة في مربع أخضر (لا يُرسل بالبريد)
4. المستخدم يدخل الرمز للتحقق من حسابه
5. بعد التحقق يمكنه تسجيل الدخول

### تشفير كلمات المرور
```
SHA-256(password + "travel-agency-salt")
```

### إدارة الجلسات
- **express-session** مع ملفات تعريف الارتباط (cookies)
- الجلسة تُخزن في الذاكرة (development)

### حساب المسؤول الافتراضي
| البيان | القيمة |
|--------|--------|
| البريد | admin@travel.com |
| كلمة المرور | admin123 |
| الدور | admin |
| التحقق | مفعّل تلقائياً |

### التحكم بالوصول (RBAC)
- **user**: تصفح الرحلات، إرسال طلبات، تعديل الملف الشخصي
- **admin**: كل صلاحيات المستخدم + لوحة الإدارة الكاملة

---

## 8. نظام الترجمة (i18n) | Internationalization

### اللغات المدعومة
| اللغة | الرمز | الاتجاه | العلم |
|-------|-------|---------|-------|
| العربية | ar | RTL (يمين لليسار) | 🇩🇿 الجزائر |
| الفرنسية | fr | LTR (يسار لليمين) | 🇫🇷 فرنسا |
| الإنجليزية | en | LTR (يسار لليمين) | 🇬🇧 المملكة المتحدة |

### كيفية العمل
- **LanguageProvider** يغلف التطبيق بالكامل
- **useLanguage()** hook يوفر: `lang`, `setLang`, `t()`, `dir`
- **t("path.key")** للوصول للترجمات (مثال: `t("nav.home")`)
- اللغة تُحفظ في `localStorage` باسم `"lang"`
- اللغة الافتراضية: العربية (`"ar"`)
- يتم تغيير `dir` و `lang` على عنصر `<html>` تلقائياً

### أمثلة مسارات الترجمة
```
nav.home          → الرئيسية / Accueil / Home
nav.visas         → الفيزات الإلكترونية / Visas Électroniques / E-Visas
nav.umrah         → العمرة / Omra / Umrah
nav.reservations  → الحجوزات / Réservations / Reservations
nav.contact       → اتصل بنا / Contact / Contact
home.heroTitle    → وكالة شويعر / Agence Chouiaar / Chouiaar Agency
common.loading    → جاري التحميل... / Chargement... / Loading...
```

---

## 9. صفحات الموقع | Website Pages

### الصفحات العامة
| المسار | الصفحة | الوصف |
|--------|--------|-------|
| `/` | الرئيسية | Hero section + خدمات + رحلات مميزة |
| `/trips` | الرحلات | قائمة جميع الرحلات المتاحة |
| `/trips/:id` | تفاصيل الرحلة | تفاصيل + نموذج الحجز |
| `/visas` | الفيزات | بطاقات الدول مع نماذج طلب الفيزا |
| `/umrah` | العمرة | باقات العمرة المتاحة |
| `/reservations` | الحجوزات | طلب حجز فندق/طيران |
| `/contact` | اتصل بنا | معلومات الاتصال + نموذج |
| `/login` | تسجيل الدخول | تسجيل دخول + إنشاء حساب + تحقق |
| `/profile` | الملف الشخصي | تعديل الاسم/الهاتف/كلمة المرور/البريد |

### صفحات الإدارة (تتطلب تسجيل دخول كمسؤول)
| المسار | الصفحة | الوصف |
|--------|--------|-------|
| `/admin` | لوحة القيادة | إحصائيات عامة |
| `/admin/trips` | إدارة الرحلات | إضافة/تعديل/حذف الرحلات |
| `/admin/bookings` | الحجوزات القديمة | إدارة حجوزات الرحلات |
| `/admin/reservations` | طلبات الحجز | إدارة طلبات الفنادق/الطيران |
| `/admin/visas` | طلبات الفيزا | إدارة طلبات الفيزا |
| `/admin/services` | خدمات أخرى | إدارة طلبات الخدمات |

---

## 10. تطبيق الجوال | Mobile App

### الشاشات الحالية
| التبويب | الشاشة | الوصف |
|---------|--------|-------|
| 🏠 الرئيسية | index.tsx | الصفحة الرئيسية |
| ✈️ الرحلات | trips.tsx | قائمة الرحلات |
| 🕋 العمرة | umrah.tsx | باقات العمرة |
| 🌍 الفيزات | visas.tsx | الفيزات الإلكترونية |
| ⋯ المزيد | more.tsx | خيارات إضافية |

### الإعدادات
- خط Cairo للعربية
- RTL مفعّل إجبارياً
- AuthContext للمصادقة
- ألوان: ذهبي `#C8A54C` + أزرق داكن `#1B3A5C`

---

## 11. أوامر التشغيل | Commands

### تطوير (Development)
```bash
# تشغيل الموقع
pnpm --filter @workspace/travel-agency run dev

# تشغيل خادم API
pnpm --filter @workspace/api-server run dev

# تشغيل تطبيق الجوال
pnpm --filter @workspace/mobile-app run dev
```

### بناء (Build)
```bash
# بناء كامل
pnpm run build

# بناء الموقع فقط
pnpm --filter @workspace/travel-agency run build

# بناء الخادم فقط
pnpm --filter @workspace/api-server run build
```

### قاعدة البيانات
```bash
# مزامنة الجداول
pnpm --filter @workspace/db run push

# مزامنة إجبارية
pnpm --filter @workspace/db run push-force
```

### فحص الأنواع
```bash
pnpm run typecheck
```

---

## 12. المتغيرات البيئية | Environment Variables

| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | رابط PostgreSQL (يوفره Replit تلقائياً) |
| `PORT` | منفذ الخادم (يوفره Replit) |
| `EXPO_PUBLIC_DOMAIN` | نطاق API لتطبيق الجوال |

---

## 13. النشر | Deployment

- **النوع**: Autoscale
- **البناء**: `pnpm run build` (يبني الموقع + الخادم)
- **التشغيل**: Express يخدم ملفات Vite الثابتة + مسارات API
- **قاعدة البيانات**: PostgreSQL المُدارة من Replit
- **النطاق**: `.replit.app`

---

## 14. الأمان | Security

- كلمات المرور مشفرة بـ SHA-256 مع salt ثابت
- الجلسات مُدارة بـ express-session
- مسارات الإدارة محمية بـ middleware يتحقق من الدور
- التحقق من البريد الإلكتروني برمز 6 أرقام
- رفع الملفات بـ Multer مع فلترة أنواع الصور

---

*تم إنشاء هذا الملف تلقائياً — وكالة شويعر للسياحة والأسفار © 2026*
