"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import iconDark from "@/public/assets/global/icon_dark.svg";

export function NavBar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + mobile menu */}
        <div className="flex items-center gap-4">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white/80 backdrop-blur-lg rounded-xl mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/shop">Shop</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
            </ul>
          </div>
          <a href="/">
            <Image src={iconDark} alt="Logo" className="h-10 w-auto" />
          </a>
        </div>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-600 text-sm">
          {["Home", "Shop", "About"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative transition-all duration-300 hover:text-gray-900"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/menu"
            className="btn btn-primary rounded-full px-5 bg-gray-900 text-white hover:opacity-90 transition-all duration-300"
          >
            Play Board
          </a>
        </div>
      </div>
    </motion.header>
  );
}
