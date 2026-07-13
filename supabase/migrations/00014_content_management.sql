-- CONTENT PAGES

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ar text not null,
  content text not null,
  content_ar text not null,
  meta_description text,
  meta_description_ar text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_pages_slug on public.content_pages(slug);
create index if not exists idx_content_pages_published on public.content_pages(is_published);

-- HOMEPAGE BANNERS

create table if not exists public.homepage_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_ar text not null,
  subtitle text,
  subtitle_ar text,
  image_url text not null,
  link_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_homepage_banners_active on public.homepage_banners(is_active, sort_order);

-- SEED INITIAL PAGES

insert into public.content_pages (slug, title, title_ar, content, content_ar, meta_description, meta_description_ar, is_published) values
('about', 'About Us', 'من نحن',
 '<h2>Welcome to RYON</h2><p>RYON is Saudi Arabia''s premier automotive marketplace. We connect buyers and sellers across the Kingdom with a trusted platform for buying, selling, and inspecting vehicles.</p><p>Our mission is to make automotive transactions transparent, secure, and hassle-free.</p>',
 '<h2>مرحباً بكم في رايون</h2><p>رايون هي سوق السيارات الرائد في المملكة العربية السعودية. نربط المشترين والبائعين في جميع أنحاء المملكة بمنصة موثوقة لشراء وبيع وفحص المركبات.</p><p>مهمتنا هي جعل المعاملات التجارية للسيارات شفافة وآمنة وخالية من المتاعب.</p>',
 'Learn about RYON - Saudi Arabia premier automotive marketplace', 'تعرف على رايون - سوق السيارات الرائد في المملكة العربية السعودية', true),
('terms', 'Terms of Service', 'شروط الخدمة',
 '<h2>Terms of Service</h2><p>By using RYON, you agree to these terms. Please read them carefully.</p><h3>User Responsibilities</h3><p>Users must provide accurate information and comply with all applicable laws.</p><h3>Listing Guidelines</h3><p>All listings must be accurate and not misleading. RYON reserves the right to remove listings that violate our policies.</p>',
 '<h2>شروط الخدمة</h2><p>باستخدام رايون، فإنك توافق على هذه الشروط. يرجى قراءتها بعناية.</p><h3>مسؤوليات المستخدم</h3><p>يجب على المستخدمين تقديم معلومات دقيقة والامتثال لجميع القوانين المعمول بها.</p><h3>إرشادات الإعلانات</h3><p>يجب أن تكون جميع الإعلانات دقيقة وغير مضللة. تحتفظ رايون بالحق في إزالة الإعلانات التي تنتهك سياساتنا.</p>',
 null, null, true),
('privacy', 'Privacy Policy', 'سياسة الخصوصية',
 '<h2>Privacy Policy</h2><p>Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.</p><h3>Information We Collect</h3><p>We collect information you provide when creating an account, listing a vehicle, or contacting other users.</p><h3>How We Use Your Information</h3><p>We use your information to provide and improve our services, process transactions, and communicate with you.</p>',
 '<h2>سياسة الخصوصية</h2><p>خصوصيتك تهمنا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p><h3>المعلومات التي نجمعها</h3><p>نجمع المعلومات التي تقدمها عند إنشاء حساب أو إدراج مركبة أو التواصل مع مستخدمين آخرين.</p><h3>كيف نستخدم معلوماتك</h3><p>نستخدم معلوماتك لتقديم وتحسين خدماتنا ومعالجة المعاملات والتواصل معك.</p>',
 null, null, true),
('faq', 'FAQ', 'الأسئلة الشائعة',
 '<h2>Frequently Asked Questions</h2><h3>How do I buy a car?</h3><p>Browse listings, contact the seller, and arrange a viewing or inspection. Use our secure platform to communicate.</p><h3>How do I sell a car?</h3><p>Create a listing with photos and details. Once approved, your car will be visible to thousands of buyers.</p><h3>Is payment handled on RYON?</h3><p>We facilitate secure communication. Payment terms are arranged between buyer and seller.</p>',
 '<h2>الأسئلة الشائعة</h2><h3>كيف أشتري سيارة؟</h3><p>تصفح الإعلانات، تواصل مع البائع، ورتب للمعاينة أو الفحص. استخدم منصتنا الآمنة للتواصل.</p><h3>كيف أبيع سيارة؟</h3><p>أنشئ إعلاناً بالصور والتفاصيل. بعد الموافقة، ستكون سيارتك مرئية لآلاف المشترين.</p><h3>هل تتم المعالجة المالية عبر رايون؟</h3><p>نحن نسهل التواصل الآمن. يتم ترتيب شروط الدفع بين المشتري والبائع.</p>',
 null, null, true);

-- RLS

alter table public.content_pages enable row level security;
alter table public.homepage_banners enable row level security;

-- public can only read published pages
create policy "content_pages_select_published" on public.content_pages
  for select using (is_published = true or 
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

-- only admins can write
create policy "content_pages_insert" on public.content_pages
  for insert with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));
create policy "content_pages_update" on public.content_pages
  for update using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));
create policy "content_pages_delete" on public.content_pages
  for delete using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

-- banners: public can read active, only admins can write
create policy "banners_select_active" on public.homepage_banners
  for select using (is_active = true or 
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));
create policy "banners_insert" on public.homepage_banners
  for insert with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));
create policy "banners_update" on public.homepage_banners
  for update using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));
create policy "banners_delete" on public.homepage_banners
  for delete using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.slug in ('admin', 'super_admin', 'system_owner')));

-- SEED BANNERS

insert into public.homepage_banners (title, title_ar, subtitle, subtitle_ar, image_url, link_url, sort_order) values
('Find Your Perfect Car', 'اعثر على سيارتك المثالية', 'Thousands of vehicles across Saudi Arabia', 'آلاف المركبات في جميع أنحاء المملكة', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200', '/listings', 1),
('Sell With Confidence', 'بيع بثقة', 'List your car and reach thousands of buyers', 'اعرض سيارتك ووصل إلى آلاف المشترين', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200', '/listings/new', 2),
('Professional Inspections', 'فحص احترافي', 'Know exactly what you''re buying', 'اعرف بالضبط ما تشتريه', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200', '/inspect', 3);
