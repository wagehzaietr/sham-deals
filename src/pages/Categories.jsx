import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { categories } from '../data/data';
import { useParams } from 'react-router-dom';

const Categories = () => {
  const { t } = useTranslation();
const { name } = useParams();
const decodedName = decodeURIComponent(name);

  return (
    <section className="w-full bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">


        <div className="mt-12 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <Link
              to={`/category/${encodeURIComponent(category.key)}`}
              key={idx}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform"
            >
              <img
                src={category.image}
                alt={t(`categoriesDetails.${category.key}.title`)}
                className="mb-4 w-full rounded-xl object-cover shadow-lg"
              />

              <h3 className="mb-2 text-[12px] font-bold text-slate-900 dark:text-white">
                {t(`categoriesDetails.${category.key}.title`)}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
