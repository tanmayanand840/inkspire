import React from 'react'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'

const Navbar = () => {
  const { navigate, token } = useAppContext()

  return (
    <nav className="backdrop-blur-md bg-[#FFF9F3]/90 shadow-md sticky top-0 z-50 flex justify-between items-center py-5 px-8 sm:px-16 xl:px-24">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Inkspire Logo"
        className="w-24 sm:w-32 cursor-pointer hover:scale-105 transition-transform"
      />
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 rounded-full text-sm bg-[#FF6F3C] hover:bg-[#FF8759] text-white px-6 sm:px-8 py-2.5 transition-all shadow-md"
      >
        {token ? 'Dashboard' : 'Login'}
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </nav>
  )
}

export default Navbar
