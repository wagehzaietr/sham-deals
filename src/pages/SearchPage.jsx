import React, { useState, useEffect, useMemo } from 'react'
import { useSearch } from '../context/SearchContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FaWhatsapp,
  FaPhone,
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa'
import { HiPhoto, HiSparkles } from 'react-icons/hi2'

const SearchPage = () => {
  const { query, setQuery, results, loading } = useSearch()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [localQuery, setLocalQuery] = useState(query)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => setQuery(localQuery), 400)
    return () => clearTimeout(handler)
  }, [localQuery, setQuery])

  const handleCardClick = id => navigate(`/product/${id}`)

  const quickCategories = [
    'realEstate',
    'vehicles',
    'electronics',
    'furniture',
    'clothing',
    'services',
    'petServices',
    'appliances',
    'furnishings'
  ]

  const sortOptions = [
    { value: 'newest', label: t('search.sortNewest') },
    { value: 'oldest', label: t('search.sortOldest') },
    { value: 'titleAsc', label: t('search.sortTitleAsc') },
    { value: 'titleDesc', label: t('search.sortTitleDesc') }
  ]

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results]

    // Debug: Show available categories in console
    if (results.length > 0) {
      const availableCategories = [
        ...new Set(results.map(post => post.category))
      ]
      console.log('Available categories in database:', availableCategories)
      console.log('Selected category for filtering:', selectedCategory)
    }

    // Filter by category if selected
    if (selectedCategory) {
      filtered = results.filter(post => {
        if (!post.category) return false

        // Simple exact match first
        if (post.category === selectedCategory) {
          return true
        }

        // Handle different category formats and create multiple possible matches
        const postCategory = post.category.toLowerCase()
        const selectedCat = selectedCategory.toLowerCase()

        // Create variations of the selected category to match different formats
        const variations = [
          selectedCategory, // exact match (realEstate)
          selectedCat, // lowercase (realestate)
          selectedCat.replace(/([A-Z])/g, '_$1').toLowerCase(), // snake_case (real_estate)
          selectedCat.replace(/([A-Z])/g, '-$1').toLowerCase(), // kebab-case (real-estate)
          selectedCat.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(), // camelCase to snake_case
          selectedCat.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() // camelCase to kebab-case
        ]

        // Check if post category matches any variation
        const match = variations.some(
          variation =>
            postCategory === variation ||
            postCategory === variation.replace(/[_-]/g, '') ||
            postCategory.replace(/[_-]/g, '') === variation.replace(/[_-]/g, '')
        )

        return match
      })

      console.log(
        `Filtered results: ${filtered.length} out of ${results.length} total`
      )
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'titleAsc':
          const titleA =
            i18n.language === 'ar' && a.titleAr ? a.titleAr : a.title
          const titleB =
            i18n.language === 'ar' && b.titleAr ? b.titleAr : b.title
          return titleA.localeCompare(titleB)
        case 'titleDesc':
          const titleA2 =
            i18n.language === 'ar' && a.titleAr ? a.titleAr : a.title
          const titleB2 =
            i18n.language === 'ar' && b.titleAr ? b.titleAr : b.title
          return titleB2.localeCompare(titleA2)
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

    return filtered
  }, [results, selectedCategory, sortBy, i18n.language])

  const handleCategoryClick = category => {
    setSelectedCategory(selectedCategory === category ? '' : category)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      {/* Hero Search Section */}
      <div className='relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='relative max-w-4xl mx-auto px-4 py-12 sm:py-16'>
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <HiSparkles className='w-8 h-8 text-yellow-300 animate-pulse' />
              <h1 className='text-3xl sm:text-4xl font-bold text-white'>
                {t('search.title')}
              </h1>
              <HiSparkles className='w-8 h-8 text-yellow-300 animate-pulse' />
            </div>
            <p className='text-sky-100 dark:text-slate-300 text-lg max-w-2xl mx-auto'>
              {t('search.subtitle')}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className='relative max-w-2xl mx-auto'>
            <div className='relative'>
              <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
              <input
                type='text'
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className='w-full pl-12 pr-16 py-4 text-lg rounded-2xl border-0 shadow-2xl
                           bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm
                           text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400
                           focus:ring-4 focus:ring-white/50 focus:bg-white dark:focus:bg-slate-800
                           transition-all duration-300'
              />
              {loading ? (
                <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                  <div className='animate-spin rounded-full h-6 w-6 border-2 border-sky-500 border-t-transparent'></div>
                </div>
              ) : (
                localQuery && (
                  <button
                    onClick={() => setLocalQuery('')}
                    className='absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                               bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500
                               text-slate-600 dark:text-slate-300 transition-colors'
                  >
                    <FaTimes className='w-4 h-4' />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Quick Categories */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2'>
              <span className='w-2 h-2 bg-sky-500 rounded-full animate-pulse'></span>
              {t('search.quickAccess')}
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                showFilters
                  ? 'bg-sky-500 text-white border-sky-500'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              <FaFilter className='w-4 h-4' />
              <span className='text-sm font-medium'>{t('search.filters')}</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className='mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Category Filter */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                    {t('search.filterByCategory')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className='w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors'
                  >
                    <option value=''>{t('search.allCategories')}</option>
                    {quickCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {t(`categories.${cat}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                    {t('search.sortBy')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className='w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors'
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || sortBy !== 'newest') && (
                <div className='mt-4 pt-4 border-t border-slate-200 dark:border-slate-700'>
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setSortBy('newest')
                    }}
                    className='px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                  >
                    {t('search.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
            {quickCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 text-center ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-br from-sky-500 to-blue-500 border-sky-500 text-white shadow-lg scale-105'
                    : 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600 hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className='text-2xl mb-2 group-hover:scale-110 transition-transform duration-200'>
                  {cat === 'realEstate' && '🏠'}
                  {cat === 'vehicles' && '🚗'}
                  {cat === 'electronics' && '📱'}
                  {cat === 'furniture' && '🪑'}
                  {cat === 'clothing' && '👕'}
                  {cat === 'services' && '🔧'}
                  {cat === 'petServices' && '🐕'}
                  {cat === 'appliances' && '🔌'}
                  {cat === 'furnishings' && '🛋️'}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'text-white'
                      : 'text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400'
                  }`}
                >
                  {t(`categories.${cat}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className='space-y-6'>
          {localQuery.trim() && (
            <div className='flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-center'>
                  <FaSearch className='w-4 h-4 text-white' />
                </div>
                <div>
                  <p className='font-semibold text-slate-900 dark:text-white'>
                    {loading
                      ? t('search.searching')
                      : t('search.resultsFor', { query: localQuery })}
                  </p>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>
                    {filteredAndSortedResults.length} {t('search.resultsFound')}
                  </p>
                </div>
              </div>
              {localQuery && (
                <button
                  onClick={() => setLocalQuery('')}
                  className='px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                >
                  {t('ui.cancel')}
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className='group rounded-3xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse'
                >
                  <div className='aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600'></div>
                  <div className='p-5 space-y-3'>
                    <div className='h-4 bg-slate-300 dark:bg-slate-600 rounded-lg w-3/4'></div>
                    <div className='h-3 bg-slate-300 dark:bg-slate-600 rounded-lg w-1/2'></div>
                    <div className='flex items-center gap-2 pt-2'>
                      <div className='w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full'></div>
                      <div className='h-3 bg-slate-300 dark:bg-slate-600 rounded w-20'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedResults.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredAndSortedResults.map(post => (
                <article
                  key={post.id}
                  onClick={() => handleCardClick(post.id)}
                  className='group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl
                             border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600
                             hover:-translate-y-2 transition-all duration-300 overflow-hidden'
                >
                  {/* Image Section */}
                  <div className='relative aspect-[4/3] overflow-hidden'>
                    {post.imageUrl ||
                    (post.imageUrls && post.imageUrls.length > 0) ? (
                      <>
                        <img
                          src={post.imageUrl || post.imageUrls[0]}
                          alt={
                            i18n.language === 'ar' && post.titleAr
                              ? post.titleAr
                              : post.title
                          }
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                        {/* Multiple images indicator */}
                        {post.imageUrls && post.imageUrls.length > 1 && (
                          <div className='absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                            <HiPhoto className='w-3 h-3' />
                            <span>{post.imageUrls.length}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600'>
                        <HiPhoto className='w-16 h-16 text-slate-400' />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className='absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-semibold text-slate-800 dark:text-white px-3 py-1 rounded-full border border-white/20'>
                      {t(`categories.${post.category}`, post.category)}
                    </div>

                    {/* Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>

                  {/* Content Section */}
                  <div className='p-5 space-y-3'>
                    <h3 className='font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors'>
                      {i18n.language === 'ar' && post.titleAr
                        ? post.titleAr
                        : post.title}
                    </h3>

                    <p className='text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed'>
                      {i18n.language === 'ar' && post.descriptionAr
                        ? post.descriptionAr
                        : post.description}
                    </p>

                    {/* User Info */}
                    <div className='flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700'>
                      <img
                        src={post.user_avatar || '/default-avatar.png'}
                        alt={post.user_name || 'User'}
                        className='w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-slate-700 dark:text-slate-300 truncate'>
                          {post.user_name || 'Anonymous'}
                        </p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          {t('product.memberSince')} 2024
                        </p>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className='flex gap-2 pt-2'>
                      {post.whatsapp && (
                        <a
                          href={`https://wa.me/${post.whatsapp.replace(
                            /\D/g,
                            ''
                          )}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={e => e.stopPropagation()}
                          className='flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl
                                     bg-green-500 hover:bg-green-600 text-white text-sm font-medium
                                     transition-all duration-200 hover:scale-105'
                        >
                          <FaWhatsapp className='w-4 h-4' />
                          <span>{t('contacts.whatsapp')}</span>
                        </a>
                      )}
                      {post.phone && (
                        <a
                          href={`tel:${post.phone}`}
                          onClick={e => e.stopPropagation()}
                          className='flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl
                                     bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium
                                     transition-all duration-200 hover:scale-105'
                        >
                          <FaPhone className='w-4 h-4' />
                          <span>{t('contacts.phone')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : localQuery.trim() ? (
            <div className='text-center py-16'>
              <div className='max-w-md mx-auto'>
                <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center'>
                  <FaSearch className='w-10 h-10 text-slate-400' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
                  {t('search.noResults')}
                </h3>
                <p className='text-slate-600 dark:text-slate-400 mb-6'>
                  {t('search.tryDifferent')}
                </p>
                <button
                  onClick={() => setLocalQuery('')}
                  className='px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-colors'
                >
                  {t('search.clearSearch')}
                </button>
              </div>
            </div>
          ) : (
            <div className='text-center py-16'>
              <div className='max-w-md mx-auto'>
                <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900 flex items-center justify-center'>
                  <HiSparkles className='w-10 h-10 text-sky-500' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
                  {t('search.startSearching')}
                </h3>
                <p className='text-slate-600 dark:text-slate-400'>
                  {t('search.startTyping')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
