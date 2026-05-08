# 森息日常 — 安裝與啟動指南

## 步驟 1：安裝 Node.js

前往 https://nodejs.org 下載並安裝 LTS 版本（建議 v20 以上）。
安裝後重開 PowerShell，輸入 `node -v` 確認。

## 步驟 2：安裝相依套件

```bash
cd "C:\Users\ypes3\OneDrive\Desktop\森息日常"
npm install
```

## 步驟 3：設定 Supabase

1. 前往 https://supabase.com 建立免費帳號
2. 新增一個 Project（例如 `sen-xi-daily`）
3. 進入 Project → SQL Editor，貼上 `supabase/schema.sql` 全部內容並執行
4. 進入 Project → Settings → API，複製：
   - `Project URL`
   - `anon public` key

5. 複製 `.env.local.example` 為 `.env.local`：
```bash
copy .env.local.example .env.local
```

6. 用文字編輯器打開 `.env.local`，填入你的值：
```
NEXT_PUBLIC_SUPABASE_URL=https://你的project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

## 步驟 4：啟動開發伺服器

```bash
npm run dev
```

打開瀏覽器前往 http://localhost:3000

## 步驟 5：部署到 Vercel（上線）

```bash
npm install -g vercel
vercel
```

依照提示操作，完成後會得到一個 `.vercel.app` 網址。
在 Vercel Dashboard → Settings → Environment Variables 加入同樣的兩個環境變數。

---

## 網站功能

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 首頁 | `/` | Hero + 分類快捷 + 精選商品 |
| 商品列表 | `/products` | 全部商品，可依分類篩選 |
| 商品詳頁 | `/products/[slug]` | 圖片、描述、加入購物車 |
| 購物車 | 右側抽屜 | 隨時開啟 |
| 結帳 | `/checkout` | 填寫收件資料（金流待串接）|
| 會員登入 | `/auth/login` | Email + 密碼 |
| 會員註冊 | `/auth/register` | 建立帳號 |
| 會員中心 | `/account` | 個人資料 + 訂單記錄 |
| 關於我們 | `/about` | 品牌故事 |

## 後續待做

- [ ] 串接 ECPay 金流（`/checkout` 頁面有留位）
- [ ] 管理後台（新增/編輯商品）
- [ ] 商品搜尋
- [ ] 優惠券系統
- [ ] 電子報訂閱
