import React from 'react'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-[#FAF3E0]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-10 border-b border-[#1D3557]/20 text-[#1D3557]/80">
        
        {/* Logo + About */}
        <div>
          <img src={assets.logo} alt="logo" className="w-32 sm:w-44" />
          <p className="max-w-[410px] mt-6 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos rerum ut amet iste deserunt veniam perspiciatis maxime sit, nobis assumenda hic aliquid illo nostrum ducimus similique neque quidem, a unde.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-[#1D3557] md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a 
                      href="#" 
                      className="text-[#1D3557]/80 hover:text-[#FF6F3C] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright */}
      <p className="py-4 text-center text-sm md:text-base text-[#1D3557]/70">
        copyright 2025 @ Inkspire - All Rights Reserved
      </p>
    </div>
  )
}

export default Footer
