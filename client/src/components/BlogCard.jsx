import React from 'react'
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/blog/${_id}`)} 
      className="w-full rounded-lg overflow-hidden shadow-md hover:scale-105 hover:shadow-orange-400/40 duration-300 cursor-pointer bg-[#FAF3E0]"
    >
      <img src={image} alt="" className="aspect-video" />
      
      {/* Category Tag */}
      <span className="ml-5 mt-4 py-1 px-3 inline-block bg-[#FF6F3C]/20 rounded-full text-[#FF6F3C] text-xs font-semibold">
        {category}
      </span>
      
      {/* Content */}
      <div className="p-5">
        <h5 className="mb-2 font-medium text-[#1D3557]">{title}</h5>
        <p 
          className="mb-3 text-xs text-gray-700" 
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  );
}

export default BlogCard;
