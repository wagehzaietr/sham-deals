import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFormContext } from 'react-hook-form';
import { FiEdit2, FiX } from 'react-icons/fi';
import userimg from '../assets/user-img.jpg';
// fallback avatar


export default function UserProfile() {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    name: 'Sara Smith',
    email: 'sara@example.com',
    phone: '+966 50 123 4567',
    avatar: userimg,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: user,
  });

  const onSave = (data) => {
    setUser({ ...user, ...data });
    setEditOpen(false);
  };

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      {/* Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Avatar */}
        <div className="flex justify-center pt-8">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-500/30"
          />
        </div>

        {/* Info */}
        <div className="text-center px-6 pb-8">
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.phone}</p>

          <button
            onClick={() => {
              reset(user);
              setPreview(null);
              setEditOpen(true);
            }}
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
          >
            <FiEdit2 size={16} />
            {t('profile.edit')}
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('profile.edit')}
              </h3>
              <button
                onClick={() => setEditOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                  {t('profile.avatar')}
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={preview || user.avatar}
                    alt="avatar preview"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <label className="cursor-pointer rounded-md bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-sm text-sky-600 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/50">
                    <input
                      {...register('avatar')}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPreview(url);
                          setValue('avatarFile', file);
                        }
                      }}
                    />
                    {t('profile.change')}
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                  {t('profile.name')}
                </label>
                <input
                  {...register('name')}
                  className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-2 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                  {t('profile.email')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-2 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
                  {t('profile.phone')}
                </label>
                <input
                  {...register('phone')}
                  className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-sky-600 py-2 text-white font-semibold hover:bg-sky-700 transition"
              >
                {t('profile.save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}