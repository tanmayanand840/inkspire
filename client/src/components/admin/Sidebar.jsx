import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 md:px-6 cursor-pointer rounded-l-lg transition-all hover:bg-[#FF7A00]/10 ${
      isActive ? 'bg-[#FF7A00]/20 border-r-4 border-[#FF7A00]' : 'text-[#0B1E3F]'
    }`;

  return (
    <div className="flex flex-col w-64 min-h-full bg-white border-r border-[#0B1E3F]/10 shadow-sm pt-6">
      <NavLink end to="/admin" className={linkClasses}>
        <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
        <span className="hidden md:inline-block font-medium">Dashboard</span>
      </NavLink>

      <NavLink to="/admin/addBlog" className={linkClasses}>
        <img src={assets.add_icon} alt="Add Blog" className="w-5 h-5" />
        <span className="hidden md:inline-block font-medium">Add Blog</span>
      </NavLink>

      <NavLink to="/admin/listBlog" className={linkClasses}>
        <img src={assets.list_icon} alt="List Blog" className="w-5 h-5" />
        <span className="hidden md:inline-block font-medium">List Blog</span>
      </NavLink>

      <NavLink to="/admin/comments" className={linkClasses}>
        <img src={assets.comment_icon} alt="Comments" className="w-5 h-5" />
        <span className="hidden md:inline-block font-medium">Comments</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
