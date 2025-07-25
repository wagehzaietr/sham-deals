// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiLogOut, FiLogIn } from 'react-icons/fi';
import { AiOutlineSetting } from 'react-icons/ai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/index';
import { FaGithub } from 'react-icons/fa';
import logoimg from '../assets/shamlogo1.jpg'

export default function Settings({ dark, setDark }) {
  // Fake auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {t , i18n} = useTranslation();

const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('lang', lng);
  document.documentElement.lang = lng;   // <-- new
};

  return (
  <div className="flex min-h-screen flex-col items-center bg-white px-4 py-8 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
      <div className="w-full max-w-md space-y-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-center text-3xl font-bold flex items-center justify-center gap-2">
          <AiOutlineSetting className="text-sky-500" size={30} />
          {t('settings')}
        </h1>



        {/* Language */}
        <section className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold">{t('language')}</h2>
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-slate-50 p-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </section>

        {/* Theme */}
        <section className="space-y-2 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold">{t('appearance')}</h2>
          <div className="flex items-center justify-between">
            <span>{dark ? t('darkMode') : t('lightMode')}</span>
            <button
              onClick={() => setDark(!dark)}
              className="rounded-full p-2 transition hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {dark ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
          </div>
        </section>

        {/* About */}
        <section className="space-y-2 rounded-xl border border-slate-200 p-4 text-center text-sm dark:border-slate-700">
          <h2 className="text-lg font-semibold">{t('about')}</h2>
          <p>
            © {new Date().getFullYear()} {t('madeWith')}
          </p>
          <div className='flex items-center justify-center mt-4 dark:text-white'>
            <a href="https://github.com/wagehzaietr" target="_blank" rel="noopener noreferrer">
              <FaGithub size={20} />
            </a>
          </div>
        </section>
        <div className='flex justify-center items-center'>
        <img className='w-15 rounded-full' src={logoimg} alt="logo-image" />
        </div>
      </div>
    </div>
  );
}