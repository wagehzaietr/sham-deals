import { useEffect, useState } from 'react'
import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BottomNav from './components/BottomNav'
import Settings from './pages/Settings'
import Categories from './pages/Categories'

import ProductDetails from './pages/ProductDetails'
import SearchPage from './pages/SearchPage'
import CategoryDeatils from './pages/CategoryDeatils'
import AddAdForm from './pages/AddAdForm '
import EditPost from './pages/EditPost'
import UserProfile from './pages/UserProfile'
import PublicUserProfile from './pages/PublicUserProfile'
import Auth from './pages/Auth'
import { ScrollTopButton } from './components/ScrollToTop'
import NoticeModal from './components/NoticeModal'

function App () {
  const [dark, setDark] = useState(
    () =>
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: light)').matches)
  )
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [dark])

  return (
    <>
      <div className='min-h-screen bg-white/60 dark:bg-slate-800 dark:text-slate-200'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='settings'
            element={<Settings dark={dark} setDark={setDark} />}
            />
          <Route path='categories' element={<Categories />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/category/:categoryKey' element={<CategoryDeatils />} />
          <Route path='/add-post' element={<AddAdForm />} />
          <Route path='/edit-post/:id' element={<EditPost />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/user-profile/:userId' element={<PublicUserProfile />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='*' element={<p>Page Not Found</p>} />
        </Routes>
      </div>
      <BottomNav />
            <ScrollTopButton/>
            <NoticeModal/>
    </>
  )
}

export default App
