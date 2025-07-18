// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlinePlusCircle, // new add-post icon
} from 'react-icons/ai';
import React from 'react';
import i18n from './../i18n/index';

export default function BottomNav() {
  const { t, i18n } = useTranslation();

  const navItems = [
    { to: '/',         label: t('navigation.home'),    Icon: AiFillHome },
    { to: '/search',   label: t('navigation.search'),  Icon: AiOutlineSearch },
    // center "add post" is handled separately
    { to: '/profile',  label: t('navigation.profile'), Icon: AiOutlineUser },
    { to: '/settings', label: t('navigation.settings'),Icon: AiOutlineSetting },
  ];

  return (
    <nav
      dir={i18n.dir()} // keeps RTL layout when Arabic
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white px-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      {/* first two items */}
      {navItems.slice(0, 2).map(item => (
        <NavItem key={item.to} {...item} />
      ))}

      {/* center add-post button */}
      <NavLink
        to="/add-post"
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center justify-center rounded-md py-1 text-xs font-medium transition-colors sm:text-sm ${
            isActive ? 'text-sky-500' : 'text-slate-500 hover:text-sky-500'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <AiOutlinePlusCircle
              size={28}
              className={`mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}
            />
            {t('navigation.add')}
          </>
        )}
      </NavLink>

      {/* last two items */}
      {navItems.slice(2).map(item => (
        <NavItem key={item.to} {...item} />
      ))}
    </nav>
  );
}

/* small helper for the repeating NavLink pattern */
function NavItem({ to, label, Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center rounded-md py-1 text-[11px] font-medium transition-colors sm:text-sm ${
          isActive ? 'text-sky-500' : 'text-slate-500 hover:text-sky-500'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={22}
            className={`mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}
          />
          {label}
        </>
      )}
    </NavLink>
  );
}