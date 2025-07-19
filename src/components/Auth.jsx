import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiX } from 'react-icons/fi';

const Auth = ({ isOpen, onClose, mode = 'signin' }) => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, {
          data: {
            full_name: formData.fullName,
          },
        });
        
        if (error) throw error;
        
        toast.success(t('auth.signUpSuccess'));
        onClose();
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) throw error;
        
        toast.success(t('auth.signInSuccess'));
        onClose();
      }
    } catch (error) {
      toast.error(error.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSignUp ? t('auth.signUp') : t('auth.signIn')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={isSignUp}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                           bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                           focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={t('auth.fullNamePlaceholder')}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? t('common.loading') : (isSignUp ? t('auth.signUp') : t('auth.signIn'))}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-300">
            {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sky-600 hover:text-sky-700 font-semibold"
            >
              {isSignUp ? t('auth.signIn') : t('auth.signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;