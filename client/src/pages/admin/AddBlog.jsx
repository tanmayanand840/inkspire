import React, { useEffect, useRef } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import { useState } from 'react'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { marked } from 'marked'

const AddBlog = () => {

  const {axios}=useAppContext();
  const[isAdding,setIsAdding]=useState(false);
  const[loading,setLoading]=useState(false);
  const editorRef = useRef();
  const quillRef = useRef();

  const [image,setImage]=useState(false);
  const[title,setTitle]=useState("");
  const[subTitle,setSubTitle]=useState("");
  const[category,setCategory]=useState("Startup");
  const[isPublished,setIsPublished]=useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
       setIsAdding(true);
       
       // Validate Quill editor content
       if (!quillRef.current || !quillRef.current.root.innerHTML.trim()) {
         toast.error('Blog description is required');
         return;
       }
       
       const blog = {
         title,
         subTitle,
         description: quillRef.current.root.innerHTML,
         category,
         isPublished
       }
       
       const formData = new FormData();
       formData.append('blog', JSON.stringify(blog));
       formData.append('image', image);
       
       const { data } = await axios.post('/api/blog/add', formData);
        
       if (data.success) {
         toast.success(data.message);
         // Reset form
         setImage(false);
         setTitle("");
         setSubTitle("");
         quillRef.current.root.innerHTML = "";
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
  }
  const generateContent = async () => {
     if(!title)return toast.error("Please enter a title");
      try {
        setLoading(true);
        const {data}=await axios.post('/api/blog/generate',{prompt:title});
        if(data.success){
          quillRef.current.root.innerHTML=marked.parse(data.content);
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message);
      }finally{
        setLoading(false);
      }
  }
  useEffect(() => {
    if(!quillRef.current && editorRef.current){
      quillRef.current=new Quill(editorRef.current,{theme:'snow'
    })
  }
  }, []);
  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:sm:m-10 shadow rounded'>

        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img src={!image? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
          <input type="file" onChange={e=>setImage(e.target.files[0])} id="image" hidden required />
        </label>
        
         

         <p className='mt-4'> title</p>
        <input type="text" onChange={e=>setTitle(e.target.value)} placeholder='Type here ' className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' required value={title} />

         <p className='mt-4'> Sub title</p>
        <input type="text" onChange={e=>setSubTitle(e.target.value)} placeholder='Type here ' className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' required value={subTitle} />

        <p className='mt-4'> Blog description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (<div className='absolute top-0 left-0 right-0 flex items-center justify-center h-full bg-black/10 mt-2'> <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div></div>)}
          <button disabled={loading} type='button' onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>Generate with Ai</button>
        </div>

        <p className='mt-4'>Blog category</p>
        <select onChange={(e)=>setCategory(e.target.value)} name="category" className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded' >
          <option value="">select category</option>
          {blogCategories.map((item,index)=>{
            return <option key={index} value={item}>{item}</option>

          })}
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish now</p>
          <input type="checkbox"  checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} className='scale-125 cursor-pointer'/>
        </div>
        <button disabled={isAdding} type='submit' className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'>{isAdding?"Adding...":"Add Blog"}</button>

      </div>
      
    </form>
  )
}

export default AddBlog
