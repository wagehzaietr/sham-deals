# 🛍️ Souq-App  
**A modern, bilingual marketplace built with React + Vite + Tailwind v4**

---

## 📋  Table of Contents
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [⚙️ Installation & Setup](#-installation--setup)
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
| Responsive **Featured Products** grid | ✅ |
| **Add your own Ad** (title, description, image, category, contact) | ✅ |
| **User Profile** (avatar, name, email, phone, edit modal) | ✅ |
| **Global Search** bar (context + i18n) | ✅ |
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
- **React Icons**

---

## ⚙️ Installation & Setup
```bash
# 1. Clone repo
git clone https://github.com/yourname/souq-app.git
cd souq-app

# 2. Install deps
npm install

# 3. Start dev server
npm run dev
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