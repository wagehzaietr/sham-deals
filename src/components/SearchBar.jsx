// src/components/SearchBar.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function SearchBar() {
  const { t } = useTranslation();
  const { query, setQuery, loading } = useSearch();
  const [focus, setFocus] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/search');
    }
  };

  return (
    <div className="flex w-full max-w-xl items-center justify-center px-4 mt-5">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`relative w-full rounded-full bg-white transition-all
                      dark:border-slate-600 dark:bg-slate-800
                      ${focus ? 'ring-2 ring-sky-500 border-sky-500' : ''}`}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500"></div>
            ) : (
              <AiOutlineSearch className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder={t('search.placeholder')}
            className="w-full rounded-full bg-transparent py-2.5 pl-10 pr-4 dark:border
                       text-sm text-slate-900 placeholder-slate-400
                       dark:text-slate-200 dark:placeholder-slate-500
                       focus:outline-none text-right placeholder:text-right"
          />
        </div>
      </form>
    </div>
  );
}