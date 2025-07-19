import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { FiUploadCloud, FiX, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { updatePost, getPostById } from '../services/supabaseService';
import { useNavigate, useParams } from 'react-router-dom';
import i18n from './../i18n/index';

export default function EditPost() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState(null);
  
  // Category options
  const categoryOptions = [
    { key: 'realEstate', label: t('categories.realEstate') },
    { key: 'vehicles', label: t('categories.vehicles') },
    { key: 'electronics', label: t('categories.electronics') },
    { key: 'furniture', label: t('categories.furniture') },
    { key: 'clothing', label: t('categories.clothing') },
    { key: 'services', label: t('categories.services') },
    { key: 'appliances', label: t('categories.appliances') },
    { key: 'furnishings', label: t('categories.furnishings') },
    { key: 'petServices', label: t('categories.petServices') }
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (id) {
      fetchPost();
    }
  }, [id, isAuthenticated]);

  const fetchPost = async () => {
    try {
      const post = await getPostById(id);
      
      // Check if user owns this post
      if (post.user_id !== user.id) {
        toast.error(t('errors.unauthorized'));
        navigate('/profile');
        return;
      }
      
      setCurrentPost(post);
      setPreview(post.imageUrl);
      
      // Set form values
      reset({
        title: post.title,
        description: post.description,
        category: post.category,
        whatsapp: post.whatsapp,
        phone: post.phone
      });
      
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error(t('errors.fetchPost'));
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const postData = {
        title: data.title,
        description: data.description,
        category: data.category,
        whatsapp: data.whatsapp,
        phone: data.phone,
        // Add Arabic fields if current language is Arabic
        ...(i18n.language === 'ar' && {
          titleAr: data.title,
          descriptionAr: data.description,
        }),
      };

      await updatePost(id, postData, imageFile);
      toast.success(t('postAd.updateSuccess'));
      
      // Navigate back to profile after successful update
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(t('postAd.updateError'));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <section
        dir={i18n.dir()}
        className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-6 transition"
        >
          <FiArrowLeft size={16} />
          {t('ui.back')}
        </button>

        <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white mb-10">
          {t('postAd.editHeading')}
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
              {categoryOptions.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
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
                      onClick={() => {
                        setPreview(currentPost?.imageUrl || null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <label className="relative cursor-pointer rounded-md font-medium text-sky-600 hover:text-sky-500">
                      <span>{t('postAd.uploadImage')}</span>
                      <input
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
                placeholder="+966..."
              />
            </div>
            {errors.whatsapp && (
              <p className="mt-1 text-xs text-red-500">{t('errors.required')}</p>
            )}
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
                placeholder="+966..."
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{t('errors.required')}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sky-600 py-3 text-sm font-semibold text-white
                       hover:bg-sky-700 disabled:opacity-60 transition"
          >
            {isSubmitting ? t('common.loading') : t('postAd.updatePost')}
          </button>
        </form>
      </section>
    </>
  );
}