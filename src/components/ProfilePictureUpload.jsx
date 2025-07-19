import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCamera, FiUpload, FiX } from 'react-icons/fi';
import { uploadProfilePicture } from '../services/supabaseService';
import toast from 'react-hot-toast';

export default function ProfilePictureUpload({ currentAvatar, onAvatarUpdate }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.invalidFileType'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.fileTooLarge'));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    try {
      // Convert preview to file
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });

      const result = await uploadProfilePicture(file);
      
      if (result.success) {
        toast.success(t('profile.avatarUpdated'));
        onAvatarUpdate(result.avatarUrl, result.user);
        setShowUploadModal(false);
        setPreview(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(t('profile.avatarUploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowUploadModal(false);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Avatar with Upload Button */}
      <div className="relative group">
        <img
          src={currentAvatar || '/default-avatar.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-500/30"
        />
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white hover:text-sky-300 transition-colors"
            title={t('profile.changeAvatar')}
          >
            <FiCamera size={24} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('profile.updateAvatar')}
              </h3>
              <button
                onClick={handleCancel}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Preview */}
            <div className="text-center mb-6">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-sky-500/30"
              />
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                {t('profile.avatarPreview')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 
                           text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 
                           transition-colors"
              >
                {t('ui.cancel')}
              </button>
              
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 
                           text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('common.uploading')}
                  </>
                ) : (
                  <>
                    <FiUpload size={16} />
                    {t('profile.uploadAvatar')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}