import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import BlogTableItem from '../../components/admin/BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashBoardData, setDashBoardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [animatedNumbers, setAnimatedNumbers] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
  });

  const { axios } = useAppContext();

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        setDashBoardData(data.dashBoardData); // Original fetch logic unchanged
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Animate numbers when dashBoardData changes
  useEffect(() => {
    const animateCount = (key, target) => {
      let start = 0;
      const duration = 800; // animation duration in ms
      const increment = target / (duration / 20); // 20ms interval

      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(interval);
        }
        setAnimatedNumbers(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 20);
    };

    animateCount('blogs', dashBoardData.blogs);
    animateCount('comments', dashBoardData.comments);
    animateCount('drafts', dashBoardData.drafts);
  }, [dashBoardData.blogs, dashBoardData.comments, dashBoardData.drafts]);

  return (
    <div
      className="flex-1 p-6 md:p-10 min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #F7EFE5 0%, #FDFBF8 100%)',
      }}
    >
      {/* Stats Section */}
      <div className="flex flex-wrap gap-6 mb-10">
        {[
          { icon: assets.dashboard_icon_1, label: 'Blogs', value: animatedNumbers.blogs },
          { icon: assets.dashboard_icon_2, label: 'Comments', value: animatedNumbers.comments },
          { icon: assets.dashboard_icon_3, label: 'Drafts', value: animatedNumbers.drafts },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white p-5 min-w-[180px] rounded-2xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-[#0B1E3F]/10"
          >
            <img src={item.icon} alt="" className="w-10 h-10" />
            <div>
              <p className="text-2xl font-bold text-[#0B1E3F]">{item.value}</p>
              <p className="text-sm font-light text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Blogs Section */}
      <div className="max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <img src={assets.dashboard_icon_4} alt="" className="w-6 h-6" />
          <p className="text-lg font-semibold text-[#0B1E3F]">Latest Blogs</p>
        </div>

        <div className="relative overflow-x-auto shadow-xl rounded-xl bg-white border border-[#0B1E3F]/10">
          <table className="w-full text-sm text-gray-600">
            <thead
              className="text-xs uppercase bg-[#0B1E3F] text-white tracking-wider"
              style={{
                background: 'linear-gradient(90deg, #0B1E3F 0%, #132D63 100%)',
              }}
            >
              <tr>
                <th scope="col" className="px-4 py-3 text-left">#</th>
                <th scope="col" className="px-4 py-3 text-left">Blog Title</th>
                <th scope="col" className="px-4 py-3 max-sm:hidden text-left">Date</th>
                <th scope="col" className="px-4 py-3 max-sm:hidden text-left">Status</th>
                <th scope="col" className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashBoardData.recentBlogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchDashboardData}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Accent */}
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-400">
          Designed with <span className="text-[#FF7A00]">creativity</span> and{' '}
          <span className="text-[#0B1E3F] font-semibold">Inkspire</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
