import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { axios, setToken } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/login', { email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F5E6CA] to-[#FAF3E0]">
      <div className="w-full max-w-sm p-8 rounded-2xl shadow-2xl bg-white/90 border border-[#0D1B2A]/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[#FF7A00]/20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-[#0D1B2A]">
            <span className="text-[#FF7A00]">Admin</span> Login
          </h1>
          <p className="font-light text-gray-600 mt-2">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 text-gray-700">
          <div className="flex flex-col mb-6">
            <label className="font-medium text-[#0D1B2A] mb-1">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              placeholder="your email id"
              className="border-b-2 border-gray-300 p-2 outline-none focus:border-[#FF7A00] transition-all duration-200 bg-transparent"
            />
          </div>

          <div className="flex flex-col mb-6">
            <label className="font-medium text-[#0D1B2A] mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              placeholder="your password"
              className="border-b-2 border-gray-300 p-2 outline-none focus:border-[#FF7A00] transition-all duration-200 bg-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 font-semibold rounded-xl bg-[#0D1B2A] text-white transition-all duration-300 shadow-lg hover:shadow-[#FF7A00]/40 hover:bg-[#13293D]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
