import React, { useEffect, useState } from 'react';
import { comments_data } from '../../assets/assets';
import CommentsTableItem from '../../components/admin/CommentsTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('Not Approved');
  const { axios } = useAppContext();

  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments');
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-[#F5E6CA] to-[#FAF3E0] text-gray-700 px-5 sm:px-16 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          <span className="text-[#FF7A00]">User</span> Comments
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setFilter('Approved')}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${
              filter === 'Approved'
                ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                : 'bg-white text-[#0D1B2A] hover:bg-[#FF7A00]/10 border-[#0D1B2A]/20'
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setFilter('Not Approved')}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${
              filter === 'Not Approved'
                ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                : 'bg-white text-[#0D1B2A] hover:bg-[#FF7A00]/10 border-[#0D1B2A]/20'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      {/* Comments Table */}
      <div className="relative max-w-4xl mx-auto overflow-x-auto bg-white/90 border border-[#0D1B2A]/10 shadow-2xl rounded-xl backdrop-blur-sm">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-[#0D1B2A] text-white text-left">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Blog Title & Comment
              </th>
              <th scope="col" className="px-6 py-3 max-sm:hidden font-semibold">
                Date
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {comments
              .filter((comment) => {
                if (filter === 'Approved') return comment.isApproved === true;
                return comment.isApproved === false;
              })
              .map((comment) => (
                <CommentsTableItem
                  key={comment._id}
                  comment={comment}
                  fetchComments={fetchComments}
                />
              ))}

            {comments.filter((comment) =>
              filter === 'Approved'
                ? comment.isApproved
                : !comment.isApproved
            ).length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-10 text-gray-500 italic"
                >
                  No comments found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
