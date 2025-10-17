import React from 'react'

const Newsletter = () => {
  return (
    <section className="text-center py-20 bg-[#FFF9F3] rounded-xl mx-8 sm:mx-16 xl:mx-40 shadow-md border border-[#1D3557]/10">
      <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-[#1D3557]">
        Never Miss a Blog!
      </h1>
      <p className="text-[#475569] mb-8 max-w-xl mx-auto text-sm sm:text-base">
        Subscribe to get the latest blogs, creative ideas, and tech insights
        right in your inbox.
      </p>

      <form className="flex items-center justify-center max-w-xl mx-auto bg-white shadow-md rounded-full overflow-hidden border border-gray-200">
        <input
          className="flex-1 px-5 py-3 outline-none text-[#1D3557] text-sm"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          className="bg-[#FF6F3C] text-white px-8 py-3 hover:bg-[#FF8759] transition-all rounded-r-full"
          type="submit"
        >
          Subscribe
        </button>
      </form>
    </section>
  )
}

export default Newsletter
