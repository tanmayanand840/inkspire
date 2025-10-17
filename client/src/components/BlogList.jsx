import React, { useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';

const BlogList = () => {
  const [menu, setMenu] = useState('All');
  const {blogs,input}=useAppContext();
  const filteredBlogs=()=>{
    if(input === ''){
      return blogs;
    }
    return blogs.filter((blog)=>{
      return blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase());
    })
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => (
          <div className="relative" key={item}>
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer relative z-10 font-medium transition-all duration-300 
                ${menu === item ? 'text-white' : 'text-[#1D3557]/70 hover:text-[#FF6F3C]'}`}
            >
              {item}
              {item === menu && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-10 bg-[#FF6F3C] rounded-full px-4"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs() 
          .filter((blog) => (menu === 'All' ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  )
}

export default BlogList
