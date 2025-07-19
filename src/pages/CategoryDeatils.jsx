import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPostsByCategory, searchPosts } from '../services/supabaseService';
import { FaWhatsapp, FaPhone, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CategoryDeatils = () => {
  const { categoryKey } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryPosts();
  }, [categoryKey]);

  useEffect(() => {
    // Filter posts based on search query
    if (searchQuery.trim()) {
      const filtered = posts.filter(post => {
        const searchLower = searchQuery.toLowerCase();
        return (
          post.title?.toLowerCase().includes(searchLower) ||
          post.description?.toLowerCase().includes(searchLower) ||
          post.title_ar?.toLowerCase().includes(searchLower) ||
          post.description_ar?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const fetchCategoryPosts = async () => {
    try {
      setLoading(true);
      const categoryPosts = await getPostsByCategory(categoryKey);
      setPosts(categoryPosts);
      setFilteredPosts(categoryPosts);
    } catch (error) {
      console.error('Error fetching category posts:', error);
      toast.error(t('errors.fetchPosts'));
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
<div className="p-4 max-w-6xl mx-auto">
  {/* Back Button */}
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 mb-6 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-white transition"
  >
    <FaArrowLeft size={16} />
    {t('ui.back')}
  </button>

  {/* Header */}
  <div className="mb-8 text-center">
    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
      {t(`categories.${categoryKey}`, categoryKey)}
    </h1>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
      {filteredPosts.length} {t('search.resultsFound')}
    </p>
  </div>

  {/* Search Input */}
  <div className="mb-10 flex justify-center">
    <input
      type="text"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      placeholder={t('search.placeholder')}
      className="w-full max-w-md rounded-full border border-slate-300 dark:border-slate-600 px-5 py-3 
                 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm
                 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm"
    />
  </div>

  {/* Posts */}
  {filteredPosts.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
        {searchQuery ? t('search.noResults') : t('category.noPosts')}
      </p>
      {!searchQuery && (
        <button
          onClick={() => navigate('/add-post')}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-full transition"
        >
          {t('navigation.post')}
        </button>
      )}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredPosts.map((post) => (
        <article
          key={post.id}
          onClick={() => handleCardClick(post.id)}
          className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm
                     hover:shadow-xl hover:-translate-y-1 transition-all  dark:border-slate-700"
        >
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden relative">
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-400">
                <span className="text-4xl">📦</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition"></div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {i18n.language === 'ar' && post.descriptionAr ? post.descriptionAr : post.description}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
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

            {/* Contact */}
            <div className="mt-4 flex items-center space-x-3 rtl:space-x-reverse">
              {post.whatsapp && (
                <a
                  href={`https://wa.me/${post.whatsapp.replace(/\D/g, '')}`}
                  onClick={e => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                >
                  <FaWhatsapp size={14} />
                </a>
              )}
              {post.phone && (
                <a
                  href={`tel:${post.phone}`}
                  onClick={e => e.stopPropagation()}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  <FaPhone size={12} />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )}
</div>

  );
};

export default CategoryDeatils;
