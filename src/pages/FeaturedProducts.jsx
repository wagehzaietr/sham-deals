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
        const fetchedPosts = await getPosts(12);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error(t("errors.fetchPosts"));
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [t]);

  const handleCardClick = (id) => navigate(`/product/${id}`);

  /* ---------- Skeleton Grid ---------- */
  if (loading)
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          {t("featuredProducts.heading")}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </section>
    );

  /* ---------- Empty State ---------- */
  if (!posts.length)
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t("featuredProducts.heading")}
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          {t("featuredProducts.noPosts")}
        </p>
      </section>
    );

  /* ---------- Grid ---------- */
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        {t("featuredProducts.heading")}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => handleCardClick(post.id)}
            className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-700 relative">
              {post.imageUrl ? (
                <>
                  <img
                    src={post.imageUrl}
                    alt={
                      i18n.language === "ar" && post.titleAr
                        ? post.titleAr
                        : post.title
                    }
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Multiple images indicator */}
                  {post.imageUrls && post.imageUrls.length > 1 && (
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>📷</span>
                      <span>{post.imageUrls.length}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-3xl text-slate-400">
                  📦
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3">
              <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {t(`categories.${post.category}`, post.category)}
              </span>

              <h3 className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white leading-tight line-clamp-1">
                {i18n.language === "ar" && post.titleAr
                  ? post.titleAr
                  : post.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {i18n.language === "ar" && post.descriptionAr
                  ? post.descriptionAr
                  : post.description}
              </p>

              {/* Author */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <img
                  src={post.user_avatar || "/default-avatar.png"}
                  alt={post.user_name || "User"}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user-profile/${post.user_id}`);
                  }}
                  className="text-[11px] font-medium text-slate-700 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                >
                  {post.user_name || "Anonymous"}
                </button>
              </div>

              {/* CTA */}
              <div className="mt-3 mb-3 flex gap-1.5">
                {post.whatsapp && (
                  <a
                    href={`https://wa.me/${post.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center rounded-md bg-green-500 py-1.5 text-white transition hover:bg-green-600"
                  >
                    <FaWhatsapp size={14} />
                  </a>
                )}
                {post.phone && (
                  <a
                    href={`tel:${post.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center rounded-md bg-blue-500 py-1.5 text-white transition hover:bg-blue-600"
                  >
                    <FaPhone size={14} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;