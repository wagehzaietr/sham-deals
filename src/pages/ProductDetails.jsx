import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaWhatsapp,
  FaPhone,
  FaArrowLeft,
  FaCalendar,
  FaHeart,
  FaShare,
  FaEye,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'
import { getPostById } from '../services/supabaseService'
import toast from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'

const ProductDetails = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const [liked, setLiked] = useState(false)
  const [viewCount] = useState(Math.floor(Math.random() * 100) + 20) // Mock view count
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id)
        setPost(fetchedPost)
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error(t('errors.postNotFound'))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id, t])

  if (loading) {
    return (
      <div className='max-w-3xl mx-auto p-6'>
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto'></div>
          <p className='mt-4 text-slate-600 dark:text-slate-300'>
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='max-w-3xl mx-auto p-6'>
        <div className='text-center py-12'>
          <p className='text-slate-600 dark:text-slate-300 text-lg'>
            {t('product.notFound')}
          </p>
          <button
            onClick={() => navigate('/')}
            className='mt-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition'
          >
            {t('navigation.home')}
          </button>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success(t('product.linkCopied'))
    }
  }

  const handleImageError = index => {
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const handleImageLoad = index => {
    if (index === 0) setImageLoaded(true)
    setImageErrors(prev => ({ ...prev, [index]: false }))
  }

  // Create a proper images array that handles both single and multiple images
  const getImagesArray = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      return post.imageUrls
    } else if (post.imageUrl) {
      return [post.imageUrl]
    }
    return []
  }

  const imagesArray = post ? getImagesArray() : []

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      {/* Header with Back Button and Actions */}
      <div className='sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700'>
        <div className='max-w-6xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105'
            >
              <FaArrowLeft size={18} />
              <span className='font-medium'>{t('ui.back')}</span>
            </button>

            <div className='flex items-center gap-3'>
              <button
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-full transition-all hover:scale-110 ${
                  liked
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <FaHeart size={18} />
              </button>

              <button
                onClick={handleShare}
                className='p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all hover:scale-110'
              >
                <FaShare size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8'>
        <div className='grid lg:grid-cols-2 gap-4 sm:gap-8'>
          {/* Image Carousel Section */}
          <div className='space-y-2 sm:space-y-4 w-full max-w-full overflow-hidden'>
            {/* Main Image Carousel */}
            <div className='relative group w-full'>
              <div className='w-full h-64 sm:h-80 md:h-96 lg:aspect-square bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl'>
                {imagesArray.length > 0 ? (
                  <>
                    <Swiper
                      modules={[Navigation, Pagination, Thumbs, Zoom]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom'
                      }}
                      pagination={{
                        clickable: true,
                        dynamicBullets: true
                      }}
                      thumbs={{ swiper: thumbsSwiper }}
                      zoom={{
                        maxRatio: 3,
                        minRatio: 1,
                        toggle: true
                      }}
                      onSlideChange={swiper =>
                        setActiveImageIndex(swiper.activeIndex)
                      }
                      className='w-full h-full'
                    >
                      {imagesArray.map((imageUrl, index) => (
                        <SwiperSlide key={index}>
                          <div className='swiper-zoom-container relative w-full h-full'>
                            {/* Loading skeleton */}
                            {!imageLoaded && index === 0 && (
                              <div className='absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse flex items-center justify-center'>
                                <div className='text-center'>
                                  <div className='w-12 sm:w-16 h-12 sm:h-16 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse mb-2 sm:mb-4 mx-auto'></div>
                                  <div className='h-3 sm:h-4 bg-slate-300 dark:bg-slate-600 rounded w-16 sm:w-24 mx-auto animate-pulse'></div>
                                </div>
                              </div>
                            )}

                            {imageErrors[index] ? (
                              <div className='w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700'>
                                <div className='text-center'>
                                  <span className='text-3xl sm:text-4xl mb-2 block'>
                                    🖼️
                                  </span>
                                  <p className='text-slate-500 dark:text-slate-400 text-xs sm:text-sm px-4'>
                                    {t('product.imageError')}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={imageUrl}
                                alt={`${
                                  i18n.language === 'ar' && post.titleAr
                                    ? post.titleAr
                                    : post.title
                                } - ${index + 1}`}
                                className={`w-full h-full object-cover transition-all duration-700 ${
                                  !imageLoaded && index === 0
                                    ? 'opacity-0'
                                    : 'opacity-100'
                                }`}
                                onLoad={() => handleImageLoad(index)}
                                onError={() => handleImageError(index)}
                              />
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    {imagesArray.length > 1 && (
                      <>
                        <button className='swiper-button-prev-custom absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110'>
                          <FaChevronLeft size={14} className='sm:w-4 sm:h-4' />
                        </button>
                        <button className='swiper-button-next-custom absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110'>
                          <FaChevronRight size={14} className='sm:w-4 sm:h-4' />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {imagesArray.length > 1 && (
                      <div className='absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm'>
                        {activeImageIndex + 1} / {imagesArray.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <div className='text-center'>
                      <span className='text-8xl mb-4 block'>📦</span>
                      <p className='text-slate-500 dark:text-slate-400'>
                        {t('product.noImage')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Image Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
              </div>

              {/* View Count Badge */}
              <div className='absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2 z-10'>
                <FaEye size={10} className='sm:w-3 sm:h-3' />
                <span>
                  {viewCount} {t('product.views')}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {imagesArray.length > 1 && (
              <div className='relative'>
                <Swiper
                  modules={[Navigation, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={3}
                  breakpoints={{
                    480: {
                      slidesPerView: 4,
                      spaceBetween: 10
                    },
                    640: {
                      slidesPerView: 5,
                      spaceBetween: 12
                    },
                    768: {
                      slidesPerView: 6,
                      spaceBetween: 12
                    }
                  }}
                  watchSlidesProgress={true}
                  className='thumbs-swiper'
                >
                  {imagesArray.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                          index === activeImageIndex
                            ? 'ring-3 ring-sky-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-105'
                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className='w-full h-full object-cover'
                          onError={e => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div className='w-full h-full hidden items-center justify-center bg-slate-200 dark:bg-slate-700'>
                          <span className='text-slate-400 text-xs'>❌</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className='space-y-6'>
            {/* Category Badge */}
            <div className='flex items-center gap-3'>
              <span className='inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg'>
                <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
                {t(`categories.${post.category}`, post.category)}
              </span>
              <span className='text-slate-500 dark:text-slate-400 text-sm'>
                {post.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4'>
                {i18n.language === 'ar' && post.titleAr
                  ? post.titleAr
                  : post.title}
              </h1>
            </div>

            {/* Description */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-3'>
                {t('product.description')}
              </h3>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed text-lg'>
                {i18n.language === 'ar' && post.descriptionAr
                  ? post.descriptionAr
                  : post.description}
              </p>
            </div>

            {/* Seller Info Card */}
            <div className='bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-600'>
              <h3 className='text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3'>
                {t('product.seller')}
              </h3>

              {/* Avatar + text stacked on very small screens */}
              <div className='flex flex-col xs:flex-row items-center gap-3 sm:gap-4'>
                {/* Avatar */}
                <div className='relative shrink-0'>
                  <img
                    src={post.user_avatar || '/default-avatar.png'}
                    alt={post.user_name || 'User'}
                    className='w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-sky-500/20 shadow-lg'
                  />
                  <div className='absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800' />
                </div>

                {/* Name + meta */}
                <div className='flex-1 text-center xs:text-left'>
                  <button
                    onClick={() => navigate(`/user-profile/${post.user_id}`)}
                    className='text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors'
                  >
                    {post.user_name || 'Anonymous'}
                  </button>
                  <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center xs:justify-start gap-1 mt-0.5'>
                    <FaCalendar size={12} />
                    {t('product.memberSince')} 2024
                  </p>
                </div>
              </div>

              {/* View-Profile button full-width on mobile, auto on larger */}
              <button
                onClick={() => navigate(`/user-profile/${post.user_id}`)}
                className='mt-4 w-full xs:w-auto bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 shadow-lg'
              >
                {t('product.viewProfile')}
              </button>
            </div>

            {/* Contact Section */}
            <div className='bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
                <span className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></span>
                {t('product.contactSeller')}
              </h3>

              <div className='grid sm:grid-cols-2 gap-4'>
                {post.whatsapp && (
                  <a
                    href={`https://wa.me/${post.whatsapp.replace(/\D/g, '')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl'
                  >
                    <FaWhatsapp
                      size={24}
                      className='group-hover:animate-bounce'
                    />
                    <div>
                      <div className='font-bold'>{t('contacts.whatsapp')}</div>
                      <div className='text-sm opacity-90'>
                        {t('product.chatNow')}
                      </div>
                    </div>
                  </a>
                )}

                {post.phone && (
                  <a
                    href={`tel:${post.phone}`}
                    className='group flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl'
                  >
                    <FaPhone size={20} className='group-hover:animate-pulse' />
                    <div>
                      <div className='font-bold'>{t('contacts.phone')}</div>
                      <div className='text-sm opacity-90'>
                        {t('product.callNow')}
                      </div>
                    </div>
                  </a>
                )}
              </div>

              <div className='mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800'>
                <p className='text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2'>
                  <span className='text-yellow-500'>⚠️</span>
                  {t('product.safetyTip')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
