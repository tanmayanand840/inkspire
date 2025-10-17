import React, { useRef } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Header = () => {
  const { setInput, input } = useAppContext()
  const inputRef = useRef()

  const onSubmitHandler = (e) => {
    e.preventDefault()
    setInput(inputRef.current.value)
  }

  const onClear = () => {
    setInput('')
    inputRef.current.value = ''
  }

  return (
    <header className="relative text-center py-20 px-6 sm:px-16 xl:px-24 overflow-hidden">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 opacity-40"
      />

      <div className="inline-flex items-center justify-center gap-3 px-5 py-2 mb-5 border border-[#FF6F3C]/30 bg-[#FF6F3C]/10 rounded-full text-[#FF6F3C] text-sm shadow-sm">
        <p>✨ NEW: AI Feature Integrated</p>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1D3557] leading-tight">
        Your own <span className="text-[#FF6F3C]">blogging</span> platform.
      </h1>
      <p className="mt-6 mb-10 max-w-2xl mx-auto text-[#475569] text-sm sm:text-base">
        This is your space to think out loud — to share what matters and write
        without filters. Whether it's one word or a thousand, your story starts
        right here.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="flex justify-between max-w-lg mx-auto bg-white shadow-md border border-gray-200 rounded-full overflow-hidden"
      >
        <input
          ref={inputRef}
          className="w-full pl-5 py-3 text-gray-700 outline-none rounded-l-full"
          type="text"
          placeholder="Search for blogs..."
          required
        />
        <button
          className="bg-[#1D3557] text-white px-8 py-3 rounded-r-full hover:bg-[#2A4373] transition-all"
          type="submit"
        >
          Search
        </button>
      </form>

      {input && (
        <button
          onClick={onClear}
          className="mt-4 text-xs font-light border border-gray-300 text-gray-600 px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 transition-all"
        >
          Clear Search
        </button>
      )}
    </header>
  )
}

export default Header
