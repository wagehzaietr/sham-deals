import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { getPostsByUser } from '../services/supabaseService';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function PublicUserProfile() {
  const { userId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get user posts to extract user info from the first post
      const posts = await getPostsByUser(userId);
      setUserPosts(posts);
      
      // Extract user info from posts (since we don't have direct access to user profiles)
      if (posts.length > 0) {
        const firstPost = posts[0];
        setUserInfo({
          id: userId,
          name: firstPost.user_name || 'Anonymous',
          avatar: firstPost.user_avatar || '/default-avatar.png',
          email: firstPost.user_email || null,
          postsCount: posts.length
        });
      } else {
        // If no posts, create minimal user info
        setUserInfo({
          id: userId,
          name: 'Anonymous',
          avatar: '/default-avatar.png',
          email: null,
          postsCount: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(t('errors.fetchUserData'));
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (postId) => {
    navigate(`/product/${postId}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            {t('profile.userNotFound')}
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-6 transition"
      >
        <FaArrowLeft size={16} />
        {t('ui.back')}
      </button>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
        {/* Avatar and Info */}
        <div className="flex items-center gap-6 p-8">
          <img
            src={userInfo.avatar}
            alt={userInfo.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-sky-500/30"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {userInfo.name}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              {t('profile.memberSince')} {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>{userInfo.postsCount} {t('profile.activeAds')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('profile.adsBy')} {userInfo.name} ({userPosts.length})
        </h2>

        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {t('profile.noPublicPosts')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handleCardClick(post.id)}
                className="group cursor-pointer rounded-2xl bg-slate-50 dark:bg-slate-700 shadow-sm
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-600">
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
                    {t(`categories.${post.category}`, post.category)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </p>

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
        )}
      </div>
    </div>
  );
}