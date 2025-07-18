import React from 'react'
import { useTranslation } from 'react-i18next'
import SearchBar from '../components/SearchBar'
import Categories from './Categories'
import ProductDetails from './ProductDetails'
import FeaturedProducts from './FeaturedProducts'


function Home () {
  const { t } = useTranslation()
  return (
    <>
    
    <header className='text-3xl mb-5 dark:bg-slate-800 dark:text-slate-200'>
      <div className='text-center p-4'>
        <h1 className='text-3xl mt-6 font-pacifico'>{t('app.name')}</h1>
        <p className='text-sm text-gray-500 mt-2'>{t('app.tagline')}</p>
      </div>
    </header>
    <SearchBar/>
    <Categories/>
    <FeaturedProducts/>
    </>
  )
}

export default Home
