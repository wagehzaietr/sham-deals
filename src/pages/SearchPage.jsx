import React from 'react';
import { useSearch } from '../context/SearchContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const SearchPage = () => {
  const { query, setQuery, results, loading } = useSearch();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const quickCategories = [
    'electronics', 'clothing', 'home', 'sports', 'books', 'automotive'
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">{t('search.title')}</h1>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:text-white dark:border-slate-600
                     focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-500"></div>
          </div>
        )}
      </div>

      {/* Quick Access Categories */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">{t('search.quickAccess')}</h2>
        <div className="flex flex-wrap gap-3">
          {quickCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setQuery(cat)}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 
                         px-4 py-2 rounded-full text-sm transition-colors dark:text-white"
            >
              {t(`categories.${cat}`, cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-10">
        {query.trim() && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {loading ? t('search.searching') : t('search.resultsFor', { query })} ({results.length})
          </p>
        )}
        
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <article
                key={post.id}
                onClick={() => handleCardClick(post.id)}
                className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-800 shadow-sm
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden
                           border dark:border-slate-700"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {i18n.language === 'ar' && post.descriptionAr ? post.descriptionAr : post.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {post.category}
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-2 mt-3 mb-3 pb-2 border-b border-slate-200 dark:border-slate-600">
                    <img
                      src={post.user_avatar || '/default-avatar.png'}
                      alt={post.user_name || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user-profile/${post.user_id}`);
                      }}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                      {post.user_name || 'Anonymous'}
                    </button>
                  </div>

                  {/* Contact buttons */}
                  <div className="mt-4 flex items-center space-x-3 rtl:space-x-reverse">
                    {post.whatsapp && (
                      <a
                        href={`https://wa.me/${post.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t('contacts.whatsapp')}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white
                                   hover:bg-green-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaWhatsapp size={14} />
                      </a>
                    )}

                    {post.phone && (
                      <a
                        href={`tel:${post.phone}`}
                        title={t('contacts.phone')}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white
                                   hover:bg-blue-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaPhone size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : query.trim() && !loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('search.noResults')}
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
              {t('search.tryDifferent')}
            </p>
          </div>
        ) : !query.trim() ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              {t('search.startTyping')}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
