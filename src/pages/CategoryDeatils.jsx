import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoryDeatils = () => {
  const { categoryKey } = useParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold text-slate-800 dark:text-white">
        {t(`categoriesDetails.${categoryKey}.title`)}
      </h1>

      <div className="relative w-full mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t('search.placeholder', 'ابحث...')}
          className="w-full rounded-full border px-4 py-2 text-slate-900 dark:text-white dark:bg-slate-800"
        />
      </div>

      {/* Replace below with dynamic ads list or content */}
      <p className="text-slate-600 dark:text-slate-300">
        {searchQuery
          ? `نتائج البحث: ${searchQuery}`
          : `اعرض جميع الإعلانات ضمن ${t(`categoriesDetails.${categoryKey}.title`)}.`}
      </p>
    </div>
  );
};

export default CategoryDeatils;
