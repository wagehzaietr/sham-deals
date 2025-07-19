import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../services/supabaseService";
import toast from "react-hot-toast";

const FeaturedProducts = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts(12); // Fetch 12 posts
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error(t('errors.fetchPosts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  return (
<section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
  {/* Heading */}
  <h2 className="text-[17px] font-extrabold text-slate-900 dark:text-white text-right md:text-center">
    {t('featuredProducts.heading')}
  </h2>

  {/* Grid */}
  <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {posts.length === 0 ? (
      <div className="col-span-full text-center py-12">
        <p className="text-slate-600 dark:text-slate-300">{t('featuredProducts.noPosts')}</p>
      </div>
    ) : (
      posts.map((post) => (
<article
  key={post.id}
  onClick={() => handleCardClick(post.id)}
  className="group relative cursor-pointer rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700"
>
  {/* Image Section */}
  <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
    {post.imageUrl ? (
      <img
        src={post.imageUrl}
        alt={i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-slate-400 text-5xl">
        📦
      </div>
    )}
  </div>

  {/* Card Content */}
  <div className="p-5">
    {/* Category Badge */}
    <span className="inline-block mb-2 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs px-3 py-1 capitalize">
      {post.category}
    </span>

    {/* Title */}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-1">
      {i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
    </h3>

    {/* Description */}
    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
      {i18n.language === 'ar' && post.descriptionAr ? post.descriptionAr : post.description}
    </p>

    {/* User Info */}
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-600">
      <img
        src={post.user_avatar || '/default-avatar.png'}
        alt={post.user_name || 'User'}
        className="w-7 h-7 rounded-full object-cover"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/user-profile/${post.user_id}`);
        }}
        className="text-sm text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
      >
        {post.user_name || 'Anonymous'}
      </button>
    </div>

    {/* Buttons */}
    <div className="flex items-center justify-between">
      {post.whatsapp && (
        <a
          href={`https://wa.me/${post.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm transition"
        >
          <FaWhatsapp />
          {t('contacts.whatsapp')}
        </a>
      )}

      {post.phone && (
        <a
          href={`tel:${post.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm transition"
        >
          <FaPhone />
          {t('contacts.phone')}
        </a>
      )}
    </div>
  </div>

  {/* Hover Glow */}
  <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-br from-white/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</article>

      ))
    )}
  </div>
</section>
  );
};

export default FeaturedProducts;
