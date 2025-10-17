import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-[#FFF9F3] to-[#FAF3E0] min-h-screen text-[#0B0B0B]">
      <Navbar />
      <Header />
      <BlogList />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
