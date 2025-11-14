"use client";
import { motion } from "framer-motion";
import { NavBar } from "../../components/global/NavBar";
import Footer from "../../components/global/footer";
import "../../styles/Pages/global/footer.css";

const AboutPage = () => {
  return (
    <>
      <NavBar />
      <div className="bg-base-100 min-h-screen overflow-hidden my-1">
        {/* Hero Section */}
        <div className="hero min-h-[70vh] relative overflow-hidden">
          {/* Background Image with soft blur + parallax */}
          <motion.img
            src="https://images.pexels.com/photos/814133/pexels-photo-814133.jpeg"
            className="absolute inset-0 h-full object-cover w-full opacity-20 scale-105 blur-sm"
            alt="chessboard background"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          <div className="hero-content flex-col lg:flex-row-reverse relative z-10">
            <motion.img
              src="https://images.pexels.com/photos/814133/pexels-photo-814133.jpeg"
              className="max-w-sm rounded-3xl sm:w-md shadow-2xl hover:scale-105 transition-transform duration-500"
              alt="chessboard foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            <motion.div
              className="mt-6 lg:mt-0"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="md:text-5xl font-bold text-gray-800 tracking-wide leading-tight">
                About Us
              </h1>
              <p className="py-6 md:text-lg text-gray-800 leading-relaxed">
                At <span className="font-bold">Interactive Chessboard</span>, we
                blend tradition with technology to create an immersive chess
                experience. Our mission is to make chess smarter, more engaging,
                and more connected for everyone — from curious beginners to
                seasoned masters.
              </p>
              <motion.button
                whileHover={{
                  scale: 1.08,
                  backgroundColor: "#000",
                  color: "#fff",
                }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary text-black bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                Join the Journey
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Mission & Vision */}
        <motion.section
          className="py-16 px-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="md:text-4xl font-bold mb-6">🎯 Our Mission</h2>
          <p className="max-w-3xl font-light mx-auto md:text-2xl leading-relaxed">
            We aim to empower players by combining{" "}
            <span className="font-semibold ">real-time insights</span>,
            <span className="font-semibold"> adaptive learning</span>, and{" "}
            <span className="font-semibold">community-driven features</span>.
            Whether you want to train, compete, or simply enjoy the beauty of
            the game, ICB is your home for smarter chess.
          </p>
        </motion.section>

        {/* Features */}
        <section className="py-16 px-8" style={{ backgroundColor: "#1C1C1C" }}>
          <h2 className="md:text-4xl font-bold text-white text-center mb-12">
            🚀 What Makes Us Different
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Adaptive Training",
                desc: "Customized learning paths that evolve with your progress and style of play.",
                img: "https://images.pexels.com/photos/51930/chess-game-chessboard-glass-51930.jpeg",
              },
              {
                title: "Smart Matchmaking",
                desc: "Instantly connect with peers, mentors, and rivals at your skill level.",
                img: "https://images.pexels.com/photos/33681805/pexels-photo-33681805.jpeg",
              },
              {
                title: "Community & Events",
                desc: "Bridging online and real-world chess through live tournaments and meetups.",
                img: "https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="card h-80 bg-base-100 shadow-2xl hover:scale-105 transition-transform duration-500 overflow-hidden rounded-3xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <figure className="overflow-hidden rounded-t-3xl">
                  <motion.img
                    src={feature.img}
                    alt={feature.title}
                    className="h-auto w-full object-cover transform transition-transform duration-500 hover:scale-110"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          className="py-20 text-center bg-gradient-to-r from-gray-800 via-gray-900 to-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white tracking-wide">
            ♟ Ready to Play Smarter?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-300 leading-relaxed">
            Join our growing community and be part of the movement that’s
            shaping the future of chess.
          </p>
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 10px 30px rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary text-black bg-white rounded-xl shadow-lg transition-all"
          >
            Get Started with ICB
          </motion.button>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
