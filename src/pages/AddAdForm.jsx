import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { addPost } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import i18n from './../i18n/index';

export default function AddAdSection() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Use the same category keys as in the data file
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

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error(t('auth.signInRequired'));
      return;
    }

    try {
      const postData = {
        title: data.title,
        description: data.description,
        category: data.category,
        whatsapp: data.whatsapp,
        phone: data.phone,
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email.split('@')[0],
        user_avatar: user.user_metadata?.avatar_url || null,
        // Add Arabic fields if current language is Arabic
        ...(i18n.language === 'ar' && {
          title_ar: data.title,
          description_ar: data.description,
        }),
      };

      await addPost(postData, imageFiles);
      toast.success(t('postAd.success'));
      reset();
      setImagePreviews([]);
      setImageFiles([]);
      
      // Navigate to home after successful post
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error(t('postAd.error'));
    }
  };

  const handleImages = (files) => {
    const fileArray = Array.from(files);
    
    // Limit to 5 images maximum
    if (imageFiles.length + fileArray.length > 5) {
      toast.error(t('postAd.maxImages'));
      return;
    }

    // Validate file types and sizes
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.invalidFileType'));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('profile.fileTooLarge'));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add new files to existing arrays
    setImageFiles(prev => [...prev, ...validFiles]);

    // Create previews for new files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInput = (e) => {
    handleImages(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleImages(e.dataTransfer.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Show sign-in prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" />
        <section
          dir={i18n.dir()}
          className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="text-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
              {t('postAd.heading')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              {t('auth.signInToPost')}
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {t('auth.signIn')}
            </button>
          </div>
        </section>
      </>
    );
  }

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

          {/* Multiple Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              {t('postAd.images')} ({imageFiles.length}/5)
            </label>
            
            {/* Drag & Drop Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                dragActive
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {imagePreviews.length === 0 ? (
                <div className="text-center">
                  <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t('postAd.dragDropImages')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('postAd.imageLimit')}
                    </p>
                  </div>
                  <label className="mt-4 inline-flex items-center gap-2 cursor-pointer rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition">
                    <FiUploadCloud size={16} />
                    {t('postAd.selectImages')}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleFileInput}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Previews Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add More Button */}
                    {imageFiles.length < 5 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 flex items-center justify-center cursor-pointer transition-colors group">
                        <div className="text-center">
                          <FiUploadCloud className="mx-auto h-8 w-8 text-slate-400 group-hover:text-sky-500 transition-colors" />
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {t('postAd.addMore')}
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleFileInput}
                        />
                      </label>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {t('postAd.imageInstructions')}
                  </p>
                </div>
              )}
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