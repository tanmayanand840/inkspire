import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="bg-[#FFF9F3] shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer border border-[#1D3557]/10"
    >
      <img src={image} alt={title} className="aspect-video w-full object-cover" />
      <div className="p-5">
        <span className="inline-block bg-[#FF6F3C]/15 text-[#FF6F3C] text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {category}
        </span>
        <h5 className="text-lg font-semibold text-[#1D3557] mb-2 line-clamp-1">
          {title}
        </h5>
        <p
          className="text-[#475569] text-sm line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  )
}

export default BlogCard
