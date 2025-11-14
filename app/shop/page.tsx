"use client";
import { motion } from "framer-motion";
import Footer from "@/components/global/footer";
import portable from "@/public/assets/global/chess/portable.png";
import classic from "@/public/assets/global/chess/classic.png";
import marble from "@/public/assets/global/chess/marble.png";
import { NavBar } from "@/components/global/NavBar";
import Image from "next/image";
const boards = [
  {
    id: "classic",
    name: "Classic Walnut",
    subtitle: "Hand‑crafted walnut & maple",
    price: "$129",
    img: classic,
    accent: "#E6E1DC",
  },
  {
    id: "marble",
    name: "Marble Deluxe",
    subtitle: "Solid marble for collectors",
    price: "$249",
    img: marble,
    accent: "#F3F7F9",
  },
  {
    id: "travel",
    name: "Portable Folding",
    subtitle: "Compact & elegant — take it anywhere",
    price: "$89",
    img: portable,
    accent: "#FBF7F2",
  },
];

export default function Shop() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />

      {/* Fullpage container with scroll-snap */}
      <main
        className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {boards.map((b, i) => (
          <section
            key={b.id}
            className="snap-start min-h-screen flex items-center justify-center p-6"
            aria-label={b.name}
          >
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: text area */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.05 * i }}
                viewport={{ once: true }}
                className="py-12"
              >
                <div className="max-w-xl">
                  <div className="text-sm uppercase text-gray-500 mb-3">
                    Collection
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                    {b.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">{b.subtitle}</p>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-3xl font-semibold">{b.price}</div>
                    <button className="btn btn-primary rounded-full px-6">
                      Add to cart
                    </button>
                    <button
                      className="btn btn-ghost btn-circle"
                      aria-label="wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-500">
                    A minimal product description that highlights materials,
                    finish and the experience of owning this chessboard. Clean
                    lines, premium feel.
                  </p>
                </div>
              </motion.div>

              {/* Right: product hero */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 * i }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center"
              >
                {/* Soft arch / background accent */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-2/3 md:w-3/5 h-4/5 rounded-tl-[40%] rounded-tr-[40%] bg-linear-to-b"
                    style={{
                      background: `linear-gradient(180deg, ${b.accent}, rgba(255,255,255,0))`,
                      filter: "blur(0px)",
                      transform: "translateY(10%)",
                    }}
                  ></div>
                </div>

                {/* Product card */}
                <div className="relative w-full md:w-[520px] lg:w-[600px] h-[520px] md:h-[620px] flex items-center justify-center">
                  {/* floating social bubbles */}
                  <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute right-8 top-0"
                  >
                    <div className="shadow-xl  bg-white rounded-full flex justify-around items-center gap-2">
                      <div className="text-sm">
                        <div className="font-medium">Clients</div>
                        <div className="text-xs text-gray-500">
                          have liked this
                        </div>
                      </div>
                      <div className="ml-4 text-red-500 text-2xl">♥</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <div className="w-[360px] md:w-[420px] lg:w-[520px] h-[360px] md:h-[480px] lg:h-[560px] rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center bg-white">
                      <Image
                        src={b.img}
                        alt={b.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* download/chevrons indicator */}
                    <div className="absolute bottom-8 flex flex-col items-center gap-3">
                      <div className="text-xs text-gray-400">
                        Swipe up to discover
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
