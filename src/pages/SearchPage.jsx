import React from 'react';
import { useSearch } from '../context/SearchContext';
import { Link } from 'react-router-dom';
import { categories } from '../data/data'; // Import your categories
import { useTranslation } from 'react-i18next';

const SearchPage = () => {
  const { query, setQuery, results } = useSearch();
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('search.title', 'Search Products')}</h1>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.placeholder', 'Search for anything...')}
        className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:text-white"
      />

      {/* Quick Access Categories */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">{t('search.quickAccess', 'Quick Categories')}</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/category/${cat.key}`}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-full text-sm"
            >
              {t(`categories.${cat.key}`)}
            </Link>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-10">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        ) : query.trim() ? (
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            {t('search.noResults', 'No results found.')}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
