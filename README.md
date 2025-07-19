# 🛍️ Souq-App  
**A modern, bilingual marketplace built with React + Vite + Tailwind v4 + Supabase + Clerk Auth**

---

## 📋 Table of Contents
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [⚙️ Installation & Setup](#-installation--setup)
- [🔧 Configuration](#-configuration)
- [📁 Project Structure](#-project-structure)
- [🌍 i18n (English / العربية)](#-i18n-english--العربية)
- [🎨 Dark Mode](#-dark-mode)
- [🧩 Components](#-components)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Features
| Feature | Status |
|---------|--------|
| **Clerk Authentication** (Sign in/up, User management) | ✅ |
| **Supabase Database** (Real-time posts storage) | ✅ |
| **Supabase Storage** (Image uploads) | ✅ |
| **Multilingual Search** (Arabic + English) | ✅ |
| Responsive **Featured Products** grid | ✅ |
| **Add your own Ad** (title, description, image, category, contact) | ✅ |
| **User Profile** (posts management, authentication) | ✅ |
| **Global Search** bar (Supabase integration + i18n) | ✅ |
| **Dark / Light Toggle** with smooth transitions | ✅ |
| **RTL Support** for Arabic | ✅ |
| **Toast Notifications** (react-hot-toast) | ✅ |
| **WhatsApp & Phone** quick links | ✅ |

---

## 🛠️ Tech Stack
- **React 18** (Vite)
- **Tailwind CSS v4**
- **React Router v6**
- **React Hook Form**
- **i18next** (en / ar)
- **React Hot Toast**
- **Clerk** (Authentication)
- **Supabase** (Database + Storage)
- **React Icons**

---

## ⚙️ Installation & Setup
```bash
# 1. Clone repo
git clone https://github.com/yourname/souq-app.git
cd souq-app

# 2. Install dependencies using pnpm
pnpm install

# 3. Configure environment variables (see Configuration section)
cp .env.local.example .env.local

# 4. Start dev server
pnpm run dev
```

---

## 🔧 Configuration

### 1. Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API to get your URL and anon key
4. Create the database table (see Database Schema below)
5. Create a storage bucket named 'posts'

### 2. Clerk Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your Publishable Key from API Keys

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### 4. Database Setup
Run the complete setup SQL in your Supabase SQL Editor:

1. **Go to Supabase Dashboard** → Your Project → **SQL Editor**
2. **Copy and paste** the content from `supabase-rls-fix.sql`
3. **Click "Run"** to execute

This will create:
- Posts table with proper structure
- Row Level Security policies for Clerk authentication
- Storage bucket for images
- Performance indexes

### 5. Verify Setup
After running the SQL:
1. **Check Tables**: Go to Table Editor → should see `posts` table
2. **Check Storage**: Go to Storage → should see `posts` bucket (public)
3. **Test App**: Try adding a post to verify everything works
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');
```

### 5. Storage Setup
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named 'posts'
3. Set the bucket to public
4. Update the bucket policy:

```sql
-- Allow public read access to posts bucket
CREATE POLICY "Public read access for posts" ON storage.objects
  FOR SELECT USING (bucket_id = 'posts');

-- Allow authenticated users to upload to posts bucket
CREATE POLICY "Authenticated users can upload posts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
```

---

## 📁 Project Structure
```
src/
├── components/
│   ├── AddAdSection.jsx        # Post new ad form
│   ├── FeaturedProducts.jsx    # 9-grid products
│   ├── UserProfile.jsx         # Avatar + edit modal
│   ├── SearchBar.jsx           # Global search
│   ├── BottomNav.jsx           # Mobile nav
│   └── ...
├── context/
│   └── SearchContext.jsx       # Global search state
├── i18n/
│   └── index.js                # i18next config
├── locales/
│   ├── en/translation.json
│   └── ar/translation.json
├── assets/
│   └── images/
├── App.jsx
└── main.jsx
```

---

## 🌍 i18n (English / العربية)
All text lives in `public/locales/`.  
Switch language via:

```js
i18n.changeLanguage('ar'); // or 'en'
```

---

## 🎨 Dark Mode
Toggle via:

```js
document.documentElement.classList.toggle('dark');
```

All colors use CSS variables (`--color-bg`, `--color-fg`) with smooth transitions.

---

## 🧩 Components Quick Start
| Component | Usage |
|-----------|-------|
| **`<UserProfile />`** | Profile card + edit modal |
| **`<AddAdSection />`** | Multi-step ad post form |
| **`<FeaturedProducts />`** | 9-grid market items |
| **`<SearchBar />`** | Global search (context) |
| **`<BottomNav />`** | Mobile tab bar |

---

## 🤝 Contributing
1. **Fork** the repo  
2. **Create** a feature branch  
3. **Push** & open a **Pull Request**

---

## 📄 License
MIT © [Your Name](https://github.com/yourname)

---

**✨ Star the repo if you like it!**