import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet  } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {

  const { axios, setToken, navigate } = useAppContext();
  const logout = () => {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null);
    navigate('/');
  }

  return (
    <>
      {/* Top Navbar */}
      <div className='flex items-center justify-between py-17 h-[80px] px-4 sm:px-12 border-b border-[#0B1E3F]/20 bg-white'>
        <img 
          src={assets.logo} 
          alt=""  
          className='w-32 sm:w-36 cursor-pointer' 
          onClick={()=>navigate('/')}
        />
        <button 
          onClick={logout} 
          className='text-sm px-8 py-2 bg-[#FF7A00] text-black rounded-full cursor-pointer hover:bg-[#e66900] transition-all'
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar/>
        <Outlet/>
      </div>
    </>
  )
}

export default Layout
