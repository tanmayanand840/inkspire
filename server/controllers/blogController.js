import main from '../configs/gemini.js';
import { imagekit, uploadImage, getUrl } from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

export const addBlog = async (req, res) => {
    try {
        // blog metadata is expected as a JSON string field named "blog" in multipart form-data
        let payload = {};
        try {
            payload = req.body?.blog ? JSON.parse(req.body.blog) : req.body || {};
        } catch (e) {
            return res.json({ success: false, message: 'Invalid blog payload JSON' });
        }

        const { title, subTitle, description, category, isPublished } = payload;
        const imageFile = req.file; // multer.memoryStorage gives buffer, originalname, mimetype

        // Validate required fields
        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        // Use in-memory buffer from multer
        const fileBuffer = imageFile.buffer; // Buffer expected by ImageKit SDK
        if (!fileBuffer) {
            return res.json({ success: false, message: 'Uploaded file buffer missing' });
        }

        // Diagnostics: log runtime shape of imagekit before upload
        try {
            console.log('[ImageKit] keys:', imagekit && Object.keys(imagekit));
            console.log('[ImageKit] typeof upload:', imagekit && typeof imagekit.upload);
        } catch (diagErr) {
            console.log('[ImageKit] diagnostic error:', diagErr && diagErr.message);
        }

        // Upload image to ImageKit using unified helper
        const response = await uploadImage({
            file: fileBuffer,
            fileName: imageFile.originalname || 'upload',
            folder: '/blogs',
        });

        // Optimization through ImageKit URL transformation (via helper)
        const optimizedImageUrl = getUrl({ path: response.filePath, transformation: [
            { quality: 'auto' }, // Auto compression
            { format: 'webp' }, // Convert to modern format
            { width: '1280' }, // Width resizing
        ] });

        const image = optimizedImageUrl;
        await Blog.create({ title, subTitle, description, category, image, isPublished });

        res.json({ success: true, message: 'Blog added successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const getAllBlogs=async(req,res)=>{
    try {
        const blogs=await Blog.find({isPublished:true});
        res.json({success:true,blogs});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

export const getBlogById=async(req,res)=>{
    try {
        const {blogId}=req.params;
        const blog=await Blog.findById(blogId);
        if(!blog){
            return res.json({success:false,message:'Blog not found'});
        }
        res.json({success:true,blog});
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}


export const deleteBlogById=async(req,res)=>{
    try {
        const {id}=req.params;
        await Blog.findByIdAndDelete(id);

        //delete all comments associated with the blog
        await Comment.deleteMany({blog:id});


        res.json({success:true,message:'Blog deleted successfully'});
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}


export const togglePublish=async(req,res)=>{
    try {
        const {id}=req.body;
        const blog=await Blog.findById(id);
        blog.isPublished=!blog.isPublished;
        await blog.save();
        res.json({success:true,message:'Blog publish status toggled successfully'});
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}



export const addComment =async(req,res)=>{
    try {
        const {blog,name,content}=req.body;
         await Comment.create({blog,name,content});
            res.json({success:true,message:'Comment added successfully'});
    } catch (error) {
       res.json({success:false,message:error.message}) 
    }
}


export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const generateContent=async(req,res)=>{
    try {
       const {prompt}=req.body;
       const content=await main(prompt + "generate a blog content for this topic in simple text format");
       res.json({success:true,content});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}






