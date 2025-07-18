import React from "react";
import { useTranslation } from "react-i18next";
import { featuredProducts } from "../data/data";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
<section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
  {/* Heading */}
  <h2 className="text-[17px] font-extrabold text-slate-900 dark:text-white text-right md:text-center">
    {t('featuredProducts.heading')}
  </h2>

  {/* Grid */}
  <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {featuredProducts.map(
      ({
        id,
        titleKey,
        descKey,
        price,
        whatsapp,
        phone,
        image,
      }) => (
        <article
          key={id}
          onClick={() => handleCardClick(id)}
          className="group dark:border  relative cursor-pointer rounded-2xl bg-white dark:bg-slate-800 shadow-sm
                     hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={t(titleKey)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {t(titleKey)}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {t(descKey)}
            </p>
            <p className="mt-3 text-2xl font-bold text-sky-600 dark:text-sky-400">
              {price}
            </p>

            {/* Contact buttons */}
            <div className="mt-5 flex items-center space-x-3 rtl:space-x-reverse">
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title={t('contacts.whatsapp')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white
                           hover:bg-green-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaWhatsapp size={18} />
              </a>

              <a
                href={`tel:${phone}`}
                title={t('contacts.phone')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white
                           hover:bg-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <FaPhone size={16} />
              </a>
            </div>
          </div>
        </article>
      )
    )}
  </div>
</section>
  );
};

export default FeaturedProducts;
