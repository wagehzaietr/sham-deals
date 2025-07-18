import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import i18n from './../i18n/index';

export default function AddAdSection() {
  const { t ,i18n } = useTranslation();
  const categories = t('postAd.categories', { returnObjects: true });

  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // TODO: send data to your API
    console.table(data);
    toast.success(t('postAd.success'));
    reset();
    setPreview(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <section
        dir={i18n.dir()}
        className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white mb-10">
          {t('postAd.heading')}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('postAd.title')}
            </label>
            <input
              {...register('title', { required: true })}
              className="mt-1 w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm
                         focus:border-sky-500 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600"
              placeholder={t('postAd.title')}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{t('errors.required')}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('postAd.description')}
            </label>
            <textarea
              {...register('description', { required: true })}
              rows={4}
              className="mt-1 w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm
                         focus:border-sky-500 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600"
              placeholder={t('postAd.description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{t('errors.required')}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('postAd.category')}
            </label>
            <select
              {...register('category', { required: true })}
              className="mt-1 w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm
                         focus:border-sky-500 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600"
            >
              <option value="">{t('postAd.category')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{t('errors.required')}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('postAd.image')}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
              <div className="space-y-1 text-center">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="preview"
                      className="mx-auto h-32 w-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <label className="relative cursor-pointer rounded-md font-medium text-sky-600 hover:text-sky-500">
                      <span>Upload</span>
                      <input
                        {...register('image')}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImage}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('postAd.whatsapp')}
            </label>
            <div className="relative">
              <FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
              <input
                {...register('whatsapp', { required: true })}
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 pl-10 text-sm
                           focus:border-sky-500 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600"
                placeholder="+9665..."
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('postAd.phone')}
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
              <input
                {...register('phone', { required: true })}
                className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 pl-10 text-sm
                           focus:border-sky-500 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600"
                placeholder="+9665..."
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sky-600 py-3 text-sm font-semibold text-white
                       hover:bg-sky-700 disabled:opacity-60 transition"
          >
            {isSubmitting ? '...' : t('postAd.submit')}
          </button>
        </form>
      </section>
    </>
  );
}