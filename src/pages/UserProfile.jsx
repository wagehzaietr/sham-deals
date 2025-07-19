import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { FiEdit2, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getPostsByUser, deletePost, updateUserProfile } from '../services/supabaseService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProfilePictureUpload from '../components/ProfilePictureUpload'

export default function UserProfile () {
  const { t } = useTranslation()
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      phoneNumber: user?.phone || user?.user_metadata?.phone_number || ''
    }
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPosts()
      setCurrentUser(user)
      reset({
        fullName: user.user_metadata?.full_name || '',
        phoneNumber: user.phone || user.user_metadata?.phone_number || ''
      })
    }
  }, [isAuthenticated, user, reset])

  const fetchUserPosts = async () => {
    if (!user) return

    setLoading(true)
    try {
      const posts = await getPostsByUser(user.id)
      setUserPosts(posts)
    } catch (error) {
      console.error('Error fetching user posts:', error)
      toast.error(t('errors.fetchPosts'))
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success(t('auth.signedOut'))
      navigate('/')
    } catch (error) {
      toast.error(t('auth.signOutError'))
    }
  }

  const handleDeletePost = async postId => {
    if (!window.confirm(t('profile.confirmDelete'))) {
      return
    }

    try {
      await deletePost(postId)
      toast.success(t('profile.deleteSuccess'))

      // Remove the deleted post from the local state
      setUserPosts(userPosts.filter(post => post.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error(t('profile.deleteError'))
    }
  }

  const handleAvatarUpdate = (newAvatarUrl, updatedUser) => {
    setCurrentUser(updatedUser)
    // The auth context will automatically update, but we can force a refresh
    window.location.reload()
  }

  const handleProfileUpdate = async (data) => {
    try {
      const result = await updateUserProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber
      })
      
      if (result.success) {
        toast.success(t('profile.profileUpdated'))
        setCurrentUser(result.user)
        setShowEditProfile(false)
        // Refresh the page to get updated user data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(t('profile.profileUpdateError'))
    }
  }

  // Show sign-in prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <section className='max-w-md mx-auto px-4 py-12'>
        <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center'>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-4'>
            {t('profile.title')}
          </h2>
          <p className='text-slate-600 dark:text-slate-300 mb-6'>
            {t('auth.signInRequired')}
          </p>
          <button
            onClick={() => navigate('/auth')}
            className='bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition'
          >
            {t('auth.signIn')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className='max-w-4xl mx-auto px-4 py-12'>
      {/* User Profile Card */}
      <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8'>
        {/* Avatar */}
        <div className='flex justify-center pt-8'>
          <ProfilePictureUpload
            currentAvatar={currentUser?.user_metadata?.avatar_url}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>

        {/* Info */}
        <div className='text-center px-6 pb-8'>
          <h2 className='mt-4 text-2xl font-bold text-slate-900 dark:text-white'>
            {user.user_metadata?.full_name || user.email.split('@')[0]}
          </h2>
          <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>
            {user.email}
          </p>
          <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>
            {currentUser?.phone || currentUser?.user_metadata?.phone_number || t('profile.noPhone')}
          </p>

          <div className='mt-6 flex items-center justify-center gap-3 flex-wrap'>
            <button
              onClick={() => setShowEditProfile(true)}
              className='flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition'
            >
              <FiUser size={16} />
              {t('profile.editProfile')}
            </button>

            <button
              onClick={() => navigate('/add-post')}
              className='flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition'
            >
              <FiEdit2 size={16} />
              {t('navigation.post')}
            </button>

            <button
              onClick={handleSignOut}
              className='flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition'
            >
              <FiLogOut size={16} />
              {t('auth.signOut')}
            </button>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6'>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-6'>
          {t('navigation.myAds')} ({userPosts.length})
        </h3>

        {loading ? (
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto'></div>
            <p className='mt-4 text-slate-600 dark:text-slate-300'>
              {t('common.loading')}
            </p>
          </div>
        ) : userPosts.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-slate-600 dark:text-slate-300 mb-4'>
              {t('profile.noPosts')}
            </p>
            <button
              onClick={() => navigate('/add-post')}
              className='bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition'
            >
              {t('navigation.post')}
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {userPosts.map(post => (
              <div
                key={post.id}
                className='bg-slate-50 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                {/* Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className='w-full h-32 object-cover rounded-lg mb-3 cursor-pointer'
                    onClick={() => navigate(`/product/${post.id}`)}
                  />
                )}

                {/* Content */}
                <div
                  onClick={() => navigate(`/product/${post.id}`)}
                  className='cursor-pointer'
                >
                  <h4 className='font-semibold text-slate-900 dark:text-white truncate'>
                    {post.title}
                  </h4>
                  <p className='text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-1'>
                    {post.description}
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 capitalize'>
                    {post.category}
                  </p>
                  <p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
                    {post.createdAt?.toDate?.()?.toLocaleDateString() ||
                      'Recently'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-600'>
                  <button
                    onClick={() => navigate(`/edit-post/${post.id}`)}
                    className='flex items-center gap-1 text-sky-600 hover:text-sky-700 text-sm font-medium transition'
                  >
                    <FiEdit2 size={14} />
                    {t('ui.edit')}
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className='flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium transition'
                  >
                    <FiX size={14} />
                    {t('ui.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('profile.editProfile')}
              </h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  {t('profile.fullName')}
                </label>
                <input
                  {...register('fullName', { required: true })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 
                             bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white
                             p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder={t('profile.fullNamePlaceholder')}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  {t('profile.phoneNumber')}
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 
                             bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white
                             p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder={t('profile.phoneNumberPlaceholder')}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('profile.phoneNumberHint')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-600 
                             text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 
                             transition-colors"
                >
                  {t('ui.cancel')}
                </button>
                
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 
                             text-white font-semibold transition-colors"
                >
                  {t('profile.saveProfile')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
