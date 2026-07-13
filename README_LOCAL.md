# Ryon - Local Development Guide

دليل تشغيل مشروع Ryon محلياً على جهازك.

---

## المتطلبات

| الأداة | الإصدار | رابط التثبيت |
|--------|---------|-------------|
| Node.js | 18+ | https://nodejs.org |
| Docker Desktop | latest | https://www.docker.com/products/docker-desktop/ |
| Supabase CLI | latest | `npm install -g supabase` |

---

## التثبيت (مرة واحدة)

### 1. تثبيت Docker Desktop

1. حمّل Docker Desktop من: https://www.docker.com/products/docker-desktop/
2. ثبّته وأعد تشغيل الجهاز
3. افتح Docker Desktop وانتظر حتى يظهر **"Docker Desktop is running"** في شريط المهام
4. تأكد من العمل:
   ```bash
   docker ps
   ```

### 2. تثبيت Supabase CLI

```bash
npm install -g supabase
```

### 3. تثبيت تبعيات المشروع

```bash
cd ryon
npm install
```

---

## التشغيل السريع

### أمر واحد يفعل كل شيء:

```bash
npm run setup
```

هذا الأمر ينفّذ التسلسل التالي:
1. **فحص المتطلبات** -- يتحقق من Docker و Supabase CLI
2. **تشغيل Supabase** -- `supabase start` (يحمّل Docker images في المرة الأولى)
3. ** إعادة ضبط قاعدة البيانات** -- `supabase db reset` (يُطبّق 32 هجرة + seed data)
4. **إنشاء مستخدمين تجريبيين** -- 5 مستخدمين بأدوار مختلفة
5. **توليد TypeScript Types** -- من قاعدة البيانات المحلية مباشرة
6. **تحديث .env.local** -- يضع المفاتيح المحلية تلقائياً
7. **التحقق من عدم الاتصال بالإنتاج**

### بعد الانتهاء:

```bash
npm run dev
```

افتح المتصفح: **http://localhost:3000/ar**

---

## تسجيل الدخول

| المستخدم | الرقم | OTP | الدور |
|----------|-------|-----|-------|
| Admin | 0555000001 | 1234 | صلاحيات كاملة (super_admin) |
| Dealer | 0555000002 | 1234 | إدارة معرض (dealer_owner) |
| Customer | 0555000003 | 1234 | عميل عادي (customer) |
| Inspector | 0555000004 | 1234 | إدارة فحص (inspection_manager) |
| Content | 0555000005 | 1234 | إدارة محتوى (content_manager) |

---

## أوامر مفيدة

### قاعدة البيانات

| الأمر | الوظيفة |
|-------|---------|
| `npm run db:reset` | إعادة ضبط كاملة (32 هجرة + بيانات تجريبية) |
| `npm run db:seed` | إعادة تشغيل البيانات التجريبية فقط |
| `npm run db:types` | تحديث ملف الأنواع من قاعدة البيانات |
| `npm run db:studio` | فتح Supabase Studio |
| `npm run db:status` | عرض حالة جميع الخدمات |
| `npm run db:stop` | إيقاف Supabase |
| `npm run db:start` | تشغيل Supabase |

### المستخدمين

| الأمر | الوظيفة |
|-------|---------|
| `npm run seed:users` | إعادة إنشاء المستخدمين التجريبيين |

### التحقق

| الأمر | الوظيفة |
|-------|---------|
| `npm run validate:prod` | فحص عدم وجود اتصالات أو مفاتيح إنتاج |

---

## المنافذ (Ports)

| الخدمة | المنفذ | الرابط |
|--------|--------|--------|
| Next.js | 3000 | http://localhost:3000 |
| Supabase API | 54321 | http://localhost:54321 |
| Supabase Studio | 54323 | http://localhost:54323 |
| Inbucket (Email) | 54324 | http://localhost:54324 |
| PostgreSQL | 54322 | localhost:54322 |

---

## صفحة فحص الصحة

افتح: **http://localhost:3000/ar/dev/health**

تعرض حالة كل خدمة:
- Database (PostgreSQL)
- Auth (GoTrue)
- Storage
- Realtime
- Email (Resend) -- معطّل محلياً
- SMS (Twilio) -- معطّل محلياً
- Payments (Stripe) -- معطّل محلياً
- Push Notifications -- معطّل محلياً

---

## إعادة ضبط قاعدة البيانات

إذا واجهت مشاكل أو أعدت تكوين الهجرات:

```bash
npm run db:reset
```

هذا يحذف قاعدة البيانات ويعيد بناءها من الصفر بتطبيق جميع الـ 32 هجرة + بيانات seed.

---

## تحديث TypeScript Types

بعد أي تعديل على قاعدة البيانات (إضافة جدول، عمود، enum):

```bash
npm run db:types
```

هذا يُحدّث `src/lib/database.types.ts` تلقائياً من قاعدة البيانات المحلية.

---

## العودة إلى بيئة الإنتاج

التحويل بين التطوير والإنتاج يتم فقط بتغيير `.env.local`:

```ini
# بيئة التطوير (الحالية)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-key>

# بيئة الإنتاج (غيّر هذه القيم)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-key>
```

**لا تقم بتغيير أي كود**. فقط غيّر المتغيرات.

---

## الخدمات الخارجية

| الخدمة | محلياً | ملاحظة |
|--------|--------|--------|
| Supabase (DB, Auth, Storage, Realtime) | ✅ يعمل | عبر Supabase CLI |
| Stripe | ⬜ معطّل | يرجع 503 في التطوير |
| Twilio (SMS) | ⬜ معطّل | OTP يُطبع في Console |
| Resend (Email) | ⬜ معطّل | لا يُرسل بريد فعلي |
| Push Notifications | ⬜ معطّل | لا يُرسل إشعارات |

كل الخدمات المعطّلة تعمل بشكل آمن -- الكود يتحقق من `isXxxConfigured()` قبل أي استدعاء.

---

## حل المشاكل

### Docker لا يعمل
- تأكد من أن Docker Desktop مفتوح ويقول "Docker is running"
- أعد تشغيل الـ terminal بعد تثبيت Docker

### `supabase start` يفشل
- تأكد من أن Docker يعمل: `docker ps`
- تأكد من أن المنافذ المطلوبة (54321-54326) غير مستخدمة
- حاول: `supabase stop` ثم `supabase start`

### `supabase db reset` يفشل
- افحص أخطاء الهجرات في المخرجات
- تأكد من تحديث جميع ملفات SQL في `supabase/migrations/`

### الأنواع (Types) غير صحيحة
- شغّل: `npm run db:types`
- أو أعد ضبط القاعدة: `npm run db:reset`

### تسجيل الدخول لا يعمل
- تأكد من أن Supabase يعمل: `npm run db:status`
- تأكد من أن `DEV_OTP=1234` في `.env.local`
- افتح Console في المتصفح وابحث عن أخطاء

---

## ملاحظات تقنية

- `supabase/config.toml` يُعرّف 4 Storage Buckets تلقائياً عند `supabase start`
- `supabase/seed.sql` يحتوي بيانات Demo (20 سيارة، 5 معارض، 3 مراكز فحص)
- الهجرات 00014, 00015, 00016 أُصلحت -- كانت تحتوي خطأ `role = 'admin'` على جدول `user_roles`
- الهجرة 00032 أُصلحت -- جدول `role_permissions` تمت تسميته `organization_role_permissions` لتجنب التعارض
- `scripts/generate-types.mjs` يستخدم Supabase CLI أولاً، مع fallback لتحليل SQL
- `scripts/validate-no-prod.mjs` يفحص الكود بحثاً عن مفاتيح أو روابط إنتاجية
