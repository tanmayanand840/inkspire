import React, { useState } from 'react'
import { blogCategories } from '../assets/assets'
import { motion } from 'motion/react'
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

const BlogList = () => {
  const [menu, setMenu] = useState('All')
  const { blogs, input } = useAppContext()

  const filteredBlogs = () =>
    input === ''
      ? blogs
      : blogs.filter((blog) =>
          [blog.title, blog.category]
            .join(' ')
            .toLowerCase()
            .includes(input.toLowerCase())
        )

  return (
    <section className="px-6 sm:px-16 xl:px-40">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 my-12">
        {blogCategories.map((item) => (
          <button
            key={item}
            onClick={() => setMenu(item)}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              menu === item
                ? 'bg-[#FF6F3C] text-white shadow-md scale-105'
                : 'bg-[#FFF9F3] border border-[#1D3557]/10 text-[#1D3557]/80 hover:bg-[#FF6F3C]/10 hover:text-[#FF6F3C]'
            }`}
          >
            {item}
            {menu === item && (
              <motion.div
                layoutId="underline"
                className="absolute inset-0 rounded-full bg-[#FF6F3C]/10 -z-10"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
        {filteredBlogs()
          .filter((blog) => (menu === 'All' ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </section>
  )
}

export default BlogList
