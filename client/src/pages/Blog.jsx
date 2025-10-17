import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()
  const { axios } = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`)
      data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await axios.post('/api/blog/comments', { blogId: id })
      if (data.success) setComments(data.comments)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/blog/add-comment', { blog: id, name, content })
      if (data.success) {
        toast.success(data.message)
        setName('')
        setContent('')
        fetchComments()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [])

  return data ? (
    <div className="relative bg-[#FAF3E0] min-h-screen text-[#1D3557]">
      <img src={assets.gradientBackground} alt="" className="absolute -top-20 -z-10 opacity-50" />

      <Navbar />

      {/* ===== Blog Header ===== */}
      <div className="text-center mt-24 px-4">
        <p className="text-[#FF6F3C] font-medium mb-2">
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold text-[#1D3557] max-w-3xl mx-auto leading-snug">
          {data.title}
        </h1>
        <h2 className="text-gray-700 text-base sm:text-lg mt-3 mb-6 max-w-xl mx-auto italic">
          {data.subTitle}
        </h2>
        <p className="inline-block py-1 px-5 rounded-full border text-sm border-[#FF6F3C]/40 bg-[#FF6F3C]/10 font-medium text-[#FF6F3C]">
          Michael Brown
        </p>
      </div>

      {/* ===== Blog Content ===== */}
      <div className="max-w-5xl mx-auto mt-10 px-5 md:px-10">
        <img
          src={data.image}
          alt=""
          className="rounded-3xl mb-8 shadow-lg hover:scale-[1.01] transition-transform duration-300"
        />

        <div
          dangerouslySetInnerHTML={{ __html: data.description }}
          className="rich-text text-gray-800 max-w-3xl mx-auto leading-relaxed"
        ></div>

        {/* ===== Comments Section ===== */}
        <div className="mt-16 mb-12 max-w-3xl mx-auto bg-white/80 p-6 rounded-2xl shadow-sm">
          <p className="font-semibold text-xl mb-5 text-[#1D3557]">
            Comments ({comments.length})
          </p>
          <div className="flex flex-col gap-5">
            {comments.map((item, index) => (
              <div
                key={index}
                className="relative bg-[#FF6F3C]/5 border border-[#FF6F3C]/10 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={assets.user_icon} alt="" className="w-7 h-7" />
                  <p className="font-medium text-[#1D3557]">{item.name}</p>
                </div>
                <p className="text-sm text-gray-700 ml-10 leading-snug">
                  {item.content}
                </p>
                <div className="absolute right-4 bottom-2 text-xs text-gray-500">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Add Comment Form ===== */}
        <div className="max-w-3xl mx-auto bg-white/80 p-6 rounded-2xl shadow-sm mb-16">
          <p className="font-semibold text-xl mb-4 text-[#1D3557]">Add Your Comment</p>
          <form onSubmit={addComment} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-[#FF6F3C]"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            <textarea
              placeholder="Write your comment..."
              className="w-full p-3 border border-gray-300 rounded-md outline-none h-36 resize-none focus:border-[#FF6F3C]"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              required
            ></textarea>
            <button
              type="submit"
              className="self-start bg-[#FF6F3C] text-white px-6 py-2 rounded-md font-medium hover:bg-[#e85c2b] transition-all duration-300"
            >
              Submit
            </button>
          </form>
        </div>

        {/* ===== Share Buttons ===== */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <p className="font-semibold text-lg mb-5 text-[#1D3557]">
            Share this article on social media
          </p>
          <div className="flex justify-center gap-6">
            <img
              src={assets.facebook_icon}
              alt="Facebook"
              className="w-10 hover:scale-110 transition-all cursor-pointer"
            />
            <img
              src={assets.twitter_icon}
              alt="Twitter"
              className="w-10 hover:scale-110 transition-all cursor-pointer"
            />
            <img
              src={assets.googleplus_icon}
              alt="Google+"
              className="w-10 hover:scale-110 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  ) : (
    <Loader />
  )
}

export default Blog
