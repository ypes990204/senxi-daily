-- 森息日常 Supabase Schema (v2 — with energy quiz tags)

-- ============================================================
-- TABLES
-- ============================================================

-- 商品分類
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- 商品（含能量標籤）
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  subtitle text,
  description text,
  price integer not null,
  images text[] default '{}',
  ingredients text[] default '{}',
  category text not null,                -- 'herbs' | 'crystal-sets' | 'energy-wands' | 'accessory'
  mood_tags text[] default '{}',         -- 'anxious' | 'low' | 'tired' | 'angry' | 'calm' | 'joyful' | 'lost'
  luck_tags text[] default '{}',         -- 'unlucky' | 'romance' | 'career' | 'health' | 'newspace' | 'newplan'
  elements text[] default '{}',          -- 'fire' | 'wood' | 'earth' | 'wind' | 'water'
  stock integer default 0,
  featured boolean default false,
  created_at timestamptz default now()
);

-- 會員資料
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  address text,
  birthday date,
  zodiac text,
  updated_at timestamptz default now()
);

-- 訂單
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  total integer not null,
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  note text,
  created_at timestamptz default now()
);

-- 訂單項目
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  product_image text,
  quantity integer not null,
  price integer not null
);

-- 能量測試紀錄
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  mood text not null,
  luck text not null,
  zodiac text not null,
  recommended_slugs text[] not null,
  created_at timestamptz default now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================
alter table products enable row level security;
alter table categories enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table quiz_results enable row level security;

drop policy if exists "public read products" on products;
drop policy if exists "public read categories" on categories;
drop policy if exists "user read own profile" on profiles;
drop policy if exists "user update own profile" on profiles;
drop policy if exists "user read own orders" on orders;
drop policy if exists "user insert own orders" on orders;
drop policy if exists "user read own order items" on order_items;
drop policy if exists "user manage own quiz" on quiz_results;

create policy "public read products"   on products   for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "user read own profile"  on profiles   for select using (auth.uid() = id);
create policy "user update own profile" on profiles  for update using (auth.uid() = id);
create policy "user read own orders"   on orders     for select using (auth.uid() = user_id);
create policy "user insert own orders" on orders     for insert with check (auth.uid() = user_id);
create policy "user read own order items" on order_items for select
  using (order_id in (select id from orders where user_id = auth.uid()));
create policy "user manage own quiz"   on quiz_results for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SEED: 26 products
-- ============================================================
delete from products;

-- A. 草本系列 (8)
insert into products (name, slug, subtitle, description, price, images, ingredients, category, mood_tags, luck_tags, elements, stock, featured) values
('白鼠尾草',     'white-sage',   '強力淨化・驅除負能量', '純天然加州白鼠尾草，最廣泛使用的淨化香草。煙霧能瓦解空間中的混亂能量，特別適合搬家、爭吵後或感覺氣場混亂時使用。', 280, '{"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"}', '{"加州白鼠尾草"}', 'herbs',  '{"anxious","angry"}',  '{"unlucky","newspace"}', '{"fire"}',         50, true),
('祕魯聖木',     'palo-santo',   '淨化提振・轉換氛圍',   '來自秘魯的天然聖木，溫暖木質香氣帶來保護與祝福。不僅淨化，還能提振心情，是工作前、冥想或低落時的最佳夥伴。', 320, '{"https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=800"}', '{"秘魯聖木 Palo Santo"}', 'herbs', '{"low","tired"}',     '{"career","newplan"}',   '{"fire","wood"}',  40, true),
('薰衣草',       'lavender',     '安撫・放鬆・助眠',       '經典舒緩香草，柔和花香能撫平緊張神經。適合焦慮、失眠、需要放鬆的夜晚。', 260, '{"https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800"}', '{"乾燥薰衣草"}', 'herbs', '{"anxious","low"}', '{"health"}', '{"wind","water"}', 60, true),
('北美聖草',     'sweetgrass',   '召喚正能量・儀式祝福', '北美原住民傳統儀式用草，香甜氣息能召喚正向能量。適合新計畫啟動、感謝儀式或祈福場合。', 380, '{"https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800"}', '{"北美聖草 Sweetgrass"}', 'herbs', '{"lost","joyful"}', '{"newplan"}', '{"wind"}', 25, false),
('龍血草',       'dragons-blood','強化保護・增強意志',     '濃郁深沉的木質香，建立強大的能量界線。適合事業挑戰、想立下界線、或感受到外在干擾時使用。', 420, '{"https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=800"}', '{"龍血樹脂"}', 'herbs', '{"angry","tired"}', '{"career","newspace"}', '{"fire"}', 20, false),
('尤加利葉',     'eucalyptus',   '清新・淨化呼吸・療癒', '清新薄荷木質香，特別淨化呼吸道與沉悶空間。病後康復、冬季濕冷或空間不通風時的療癒選擇。', 280, '{"https://images.unsplash.com/photo-1531956531700-dc0ee0f1f9a5?w=800"}', '{"尤加利葉"}', 'herbs', '{"tired"}', '{"health"}', '{"wind"}', 35, false),
('迷迭香',       'rosemary',     '提升記憶・增強專注',     '清晰銳利的香氣，幫助頭腦清晰、專注力提升。考試、創作、新計畫啟動時的好夥伴。', 280, '{"https://images.unsplash.com/photo-1515426954832-92d0fd0e1abf?w=800"}', '{"乾燥迷迭香"}', 'herbs', '{"lost","joyful"}', '{"career","newplan"}', '{"fire"}', 30, false),
('雪松',         'cedar',        '穩定・扎根・保護',       '深沉溫暖的木質香，將飄忽的能量帶回大地。心神不寧、剛搬家、需要安定感時的最佳選擇。', 320, '{"https://images.unsplash.com/photo-1542728928-1413d1894ed1?w=800"}', '{"雪松木屑"}', 'herbs', '{"anxious","lost"}', '{"newspace","health"}', '{"earth","wood"}', 25, true);

-- B. 水晶套裝 (9)
insert into products (name, slug, subtitle, description, price, images, ingredients, category, mood_tags, luck_tags, elements, stock, featured) values
('紫晶簇 + 5cm 聖木 + 2吋鼠尾草套組', 'amethyst-cluster-set', '全方位淨化入門組',         '集齊三大淨化元素：紫晶簇放大能量、聖木提振、鼠尾草徹底清理。最受歡迎的入門組合，適合所有需求。', 880,  '{"https://images.unsplash.com/photo-1567632630891-38b39c12e1a0?w=800"}', '{"紫晶簇","5cm 聖木","2吋白鼠尾草束"}', 'crystal-sets', '{"anxious","lost","low"}',  '{"unlucky","health"}',  '{"wind","water"}',         30, true),
('東陵玉原石套裝',                   'aventurine-set',       '招財・平衡・心輪',           '東陵玉滋養心輪，平衡情緒並招來財富機會。配上鼠尾草與聖木做完整能量啟動。',                       980,  '{"https://images.unsplash.com/photo-1518057111178-44a106bad636?w=800"}', '{"東陵玉原石","聖木","白鼠尾草"}', 'crystal-sets', '{"calm","low"}',            '{"career","health"}',   '{"wood"}',                 20, false),
('黃水晶原石套裝',                   'citrine-set',          '招財・提振・自信',           '太陽石頭，注入溫暖正能量。事業卡關、信心低落、需要陽性力量時的首選。',                            1080, '{"https://images.unsplash.com/photo-1591437174033-cef38f59b2b8?w=800"}', '{"黃水晶原石","聖木","白鼠尾草"}', 'crystal-sets', '{"low","lost"}',            '{"career"}',            '{"fire","earth"}',         18, true),
('綠螢石原石套裝',                   'fluorite-set',         '學業・智慧・專注',           '螢石澄清思緒，幫助下決定。考試、研究、新計畫的能量好夥伴。',                                        1080, '{"https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800"}', '{"綠螢石原石","聖木","白鼠尾草"}', 'crystal-sets', '{"lost"}',                  '{"career","newplan"}',  '{"wind","water"}',         15, false),
('白水晶原石套裝',                   'clear-quartz-set',     '全能・淨化・放大能量',       '水晶之王，能量百搭。可以放大其他水晶的能量，也可獨立做空間淨化主石。',                              1180, '{"https://images.unsplash.com/photo-1548020517-dc78e4a32f97?w=800"}', '{"白水晶原石","聖木","白鼠尾草"}', 'crystal-sets', '{"anxious","lost","low","tired"}', '{"unlucky","health"}', '{"wind","water","earth","fire","wood"}', 25, true),
('粉紅水晶原石套裝',                 'rose-quartz-set',      '桃花・自我愛・療癒',         '愛之石。打開心輪、療癒情傷、為自己注入更多溫柔。感情低潮的療癒救星。',                              1180, '{"https://images.unsplash.com/photo-1524666041070-9d87656c25bb?w=800"}', '{"粉紅水晶原石","聖木","白鼠尾草"}', 'crystal-sets', '{"low","tired"}',           '{"romance"}',           '{"water"}',                22, true),
('紫水晶原石套裝',                   'amethyst-set',         '智慧・安神・靈性',           '紫水晶安撫心神、助眠、開啟靈性視野。失眠、焦慮、迷茫時最直接的能量平息。',                          1280, '{"https://images.unsplash.com/photo-1567632630891-38b39c12e1a0?w=800"}', '{"紫水晶原石","聖木","白鼠尾草"}', 'crystal-sets', '{"anxious","lost"}',        '{"health"}',            '{"wind"}',                 20, true),
('藍紋石原石套裝',                   'blue-lace-agate-set',  '表達・溝通・喉輪',           '溫柔的藍紋石開啟喉輪，幫助清晰表達。職場談判、感情溝通、想為自己發聲時的能量輔助。',                1180, '{"https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800"}', '{"藍紋石原石","聖木","白鼠尾草"}', 'crystal-sets', '{"angry","lost"}',          '{"romance","career"}',  '{"wind","water"}',         12, false),
('紅碧玉原石套裝',                   'red-jasper-set',       '力量・勇氣・海底輪',         '紅碧玉激活海底輪，回到身體、回到力量。疲憊、健康下滑、需要勇氣時的能量補品。',                      1080, '{"https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=800"}', '{"紅碧玉原石","聖木","白鼠尾草"}', 'crystal-sets', '{"tired","angry"}',         '{"health","career"}',   '{"fire","earth"}',         16, false);

-- C. 能量草杖 (9)
insert into products (name, slug, subtitle, description, price, images, ingredients, category, mood_tags, luck_tags, elements, stock, featured) values
('薰衣草 + 甜橙 + 聖木 草杖',                       'wand-orange',         '提振活力',     '薰衣草的安撫加上甜橙的陽光感，再以聖木點亮整個空間。低落、需要轉換氛圍時的能量泡澡。',           580, '{"https://images.unsplash.com/photo-1599623560574-39d485900c95?w=800"}', '{"薰衣草","甜橙","祕魯聖木"}',                'energy-wands', '{"low","tired"}',    '{"unlucky"}',            '{"fire","wood"}',  18, false),
('薰衣草 + 桂皮 + 聖木 草杖',                       'wand-cinnamon',       '招財家宅',     '桂皮是傳統招財香料，配上薰衣草與聖木建構家宅守護。新搬家、想為事業聚財時的儀式良品。',           680, '{"https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800"}', '{"薰衣草","桂皮","祕魯聖木"}',                'energy-wands', '{"lost"}',           '{"career","newspace"}', '{"fire","earth"}', 15, true),
('薰衣草 + 迷迭香 + 玫瑰花 + 尤加利葉 草杖',       'wand-rose-eucalyptus','全方位療癒',   '四種療癒香草交織：薰衣草安神、迷迭香清晰、玫瑰滋養、尤加利淨化。完整的能量療癒組合。',         780, '{"https://images.unsplash.com/photo-1502209524164-acea936639a2?w=800"}', '{"薰衣草","迷迭香","玫瑰花","尤加利葉"}',     'energy-wands', '{"tired","low"}',    '{"health"}',            '{"water","wood","wind"}', 12, false),
('薰衣草 + 雪松 草杖',                             'wand-cedar',          '安神扎根',     '極簡兩元素配方：薰衣草柔軟撫慰，雪松堅實扎根。失眠、焦慮、需要回到大地感的最直接療癒。',         580, '{"https://images.unsplash.com/photo-1542728928-1413d1894ed1?w=800"}', '{"薰衣草","雪松"}',                          'energy-wands', '{"anxious"}',        '{"health"}',            '{"earth","wood"}', 20, true),
('薰衣草 + 勿忘我 + 玫瑰花 + 白水晶 草杖',          'wand-forget-me-not',  '感情療癒',     '本店招牌。勿忘我承載思念、玫瑰滋養愛、白水晶放大療癒。感情低潮的溫柔擁抱。',                     880, '{"https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=800"}', '{"薰衣草","勿忘我","玫瑰花","白水晶碎"}',     'energy-wands', '{"low","tired"}',    '{"romance"}',           '{"water"}',        10, true),
('薰衣草 + 迷迭香 + 七彩菊 + 水晶柱 草杖',          'wand-mum-quartz',     '創造力轉運', '七彩菊象徵綻放、水晶柱聚焦能量、迷迭香啟發靈感。新計畫、創作瓶頸、想轉運時的儀式選擇。',           880, '{"https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800"}', '{"薰衣草","迷迭香","七彩菊","水晶柱"}',       'energy-wands', '{"joyful","lost"}',  '{"newplan","career"}',  '{"fire","wind"}',  12, false),
('薰衣草 + 雪松 + 白鼠尾草 + 聖木 草杖',           'wand-sage-palo',      '強力淨化',     '結合四大淨化元素：鼠尾草徹底清理、聖木提振、雪松扎根、薰衣草安撫。搬家、氣場混亂、強力轉場必備。', 880, '{"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"}', '{"薰衣草","雪松","白鼠尾草","祕魯聖木"}',    'energy-wands', '{"angry","anxious"}','{"unlucky","newspace"}','{"fire","wood","earth"}', 14, true),
('薰衣草 + 迷迭香 + 滿天星星 + 玫瑰花 草杖',       'wand-baby-breath',    '浪漫感情',     '夢幻配方。滿天星星與玫瑰交織出浪漫，配上薰衣草與迷迭香的清晰。約會儀式、感情滋養的能量小詩。',     780, '{"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800"}', '{"薰衣草","迷迭香","滿天星","玫瑰花"}',       'energy-wands', '{"calm","joyful"}',  '{"romance"}',           '{"water","wind"}', 13, false),
('薰衣草 + 白石膏 + 聖木 草杖',                    'wand-selenite',       '神聖空間',     '白石膏（透石膏）淨化純粹，聖木點化空間。新空間入住、設立祭壇、創造儀式場域時的開光必備。',         880, '{"https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=800"}', '{"薰衣草","白石膏","祕魯聖木"}',              'energy-wands', '{"calm"}',           '{"newspace","newplan"}','{"wind","earth"}', 11, false);
