import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaPhone, FaArrowLeft, FaUser, FaCalendar } from "react-icons/fa";
import { getPostById } from "../services/supabaseService";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error(t('errors.postNotFound'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, t]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            {t('product.notFound')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {t('navigation.home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-6 transition"
      >
        <FaArrowLeft size={16} />
        {t('ui.back')}
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-700">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-6xl">📦</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Category */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {i18n.language === 'ar' && post.titleAr ? post.titleAr : post.title}
            </h1>
            <span className="inline-block bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {post.category}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {i18n.language === 'ar' && post.descriptionAr ? post.descriptionAr : post.description}
            </p>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <img
              src={post.user_avatar || '/default-avatar.png'}
              alt={post.user_name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <button
                onClick={() => navigate(`/user-profile/${post.user_id}`)}
                className="text-lg font-semibold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {post.user_name || 'Anonymous'}
              </button>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('product.postedOn')} {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              </p>
            </div>
            <button
              onClick={() => navigate(`/user-profile/${post.user_id}`)}
              className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors"
            >
              {t('product.viewProfile')}
            </button>
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-wrap gap-4">
            {post.whatsapp && (
              <a
                href={`https://wa.me/${post.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                <FaWhatsapp size={20} />
                <span>{t('contacts.whatsapp')}</span>
              </a>
            )}

            {post.phone && (
              <a
                href={`tel:${post.phone}`}
                className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                <FaPhone size={18} />
                <span>{t('contacts.phone')}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
