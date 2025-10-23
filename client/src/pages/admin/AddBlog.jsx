import React, { useEffect, useRef, useState } from 'react';
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { marked } from 'marked';

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef();
  const quillRef = useRef();

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsAdding(true);

      if (!quillRef.current || !quillRef.current.root.innerHTML.trim()) {
        toast.error('Blog description is required');
        return;
      }

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const { data } = await axios.post('/api/blog/add', formData);

      if (data.success) {
        toast.success(data.message);
        setImage(false);
        setTitle('');
        setSubTitle('');
        quillRef.current.root.innerHTML = '';
        setCategory('Startup');
        setIsPublished(false);
      } else {
        toast.error(data.message || 'Failed to add blog');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add blog');
    } finally {
      setIsAdding(false);
    }
  };

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title');
    try {
      setLoading(true);
      const { data } = await axios.post('/api/blog/generate', { prompt: title });
      if (data.success) {
        quillRef.current.root.innerHTML = marked.parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-gradient-to-br from-[#F5E6CA] to-[#FAF3E0] text-gray-700 h-full overflow-scroll py-8"
    >
      <div className="bg-white/90 w-full max-w-3xl mx-auto p-8 md:p-10 rounded-2xl shadow-2xl border border-[#0D1B2A]/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-[#0D1B2A] mb-6">
          <span className="text-[#FF7A00]">Add</span> New Blog
        </h2>

        {/* Thumbnail Upload */}
        <p className="font-medium text-[#0D1B2A]">Upload Thumbnail</p>
        <label htmlFor="image" className="block mt-2">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="Thumbnail"
            className="mt-2 h-24 rounded-lg cursor-pointer border border-dashed border-[#0D1B2A]/30 hover:border-[#FF7A00] transition-all"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            id="image"
            hidden
            required
          />
        </label>

        {/* Title */}
        <p className="mt-6 font-medium text-[#0D1B2A]">Title</p>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 rounded outline-none focus:border-[#FF7A00] transition-all"
          required
          value={title}
        />

        {/* Subtitle */}
        <p className="mt-6 font-medium text-[#0D1B2A]">Sub Title</p>
        <input
          type="text"
          onChange={(e) => setSubTitle(e.target.value)}
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 rounded outline-none focus:border-[#FF7A00] transition-all"
          required
          value={subTitle}
        />

        {/* Description */}
        <p className="mt-6 font-medium text-[#0D1B2A]">Blog Description</p>
        <div className="max-w-lg relative border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-2">
          <div ref={editorRef} className="p-2 min-h-[250px] bg-white rounded-md" />
          {loading && (
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center h-full bg-black/10">
              <div className="w-8 h-8 rounded-full border-2 border-t-[#FF7A00] border-[#0D1B2A]/30 animate-spin"></div>
            </div>
          )}
          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-3 right-3 text-xs bg-[#FF7A00] hover:bg-[#e46f00] text-white px-4 py-1.5 rounded-full shadow-md transition-all"
          >
            Generate with AI
          </button>
        </div>

        {/* Category */}
        <p className="mt-6 font-medium text-[#0D1B2A]">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border border-gray-300 rounded text-gray-700 outline-none focus:border-[#FF7A00] transition-all"
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Publish Checkbox */}
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer accent-[#FF7A00]"
          />
          <p className="text-[#0D1B2A] font-medium">Publish now</p>
        </div>

        {/* Submit Button */}
        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 py-3 rounded-xl bg-[#0D1B2A] text-white font-semibold shadow-lg hover:shadow-[#FF7A00]/40 hover:bg-[#13293D] transition-all"
        >
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
