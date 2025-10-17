import React from 'react'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 bg-[#FAF3E0] border-t border-[#1D3557]/10">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 py-12 text-[#1D3557]/80">
        <div>
          <img src={assets.logo} alt="Inkspire logo" className="w-36 sm:w-44" />
          <p className="max-w-sm mt-5 text-sm leading-relaxed text-[#475569]">
            Inkspire empowers writers and thinkers to share their stories
            creatively — connecting inspiration with expression.
          </p>
        </div>

        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-[#1D3557] mb-3">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-[#475569] hover:text-[#FF6F3C] transition-colors"
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

      <p className="py-5 text-center text-sm text-[#475569] border-t border-[#1D3557]/10">
        © 2025 Inkspire — All Rights Reserved
      </p>
    </footer>
  )
}

export default Footer
