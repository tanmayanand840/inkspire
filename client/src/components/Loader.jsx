import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#FFF9F3]">
      <div className="relative">
        <div className="animate-spin h-16 w-16 rounded-full border-4 border-t-[#FF6F3C] border-[#1D3557]/20"></div>
      </div>
    </div>
  )
}

export default Loader
