import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-100">

      <Header />

      <motion.div 
        className="grow max-w-4xl mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
    >

        {/* Title */}
        <h1 className="text-4xl text-zinc-800 underline font-bold text-center mb-6">
          About Us
        </h1>

        {/* Intro */}
        <p className="text-xl font-semibold text-zinc-700 text-center py-8 mb-10">
          Welcome to our bookstore — your destination for discovering
          great reads, from timeless classics to modern bestsellers.
        </p>

        {/* Section 1 */}
        <div className="mb-8">
          <h2 className="text-2xl text-zinc-800 font-semibold mb-2">
            Our Mission
          </h2>
          <p className="text-zinc-700">
            We aim to make <span className="text-amber-500">books easily accessible</span> to everyone by offering
            a curated collection across genres that inspire, educate, and entertain.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-8">
          <h2 className="text-2xl text-zinc-800 font-semibold mb-2">
            What We Offer
          </h2>
          <ul className="list-disc pl-5 text-zinc-700">
            <li><span className="text-amber-500"> Wide range </span> of books</li>
            <li><span className="text-amber-500"> Easy browsing </span> and search</li>
            <li><span className="text-amber-500"> Simple and secure </span> shopping experience</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-2xl text-zinc-800 font-semibold mb-2">
            Contact
          </h2>
          <p className="text-zinc-700">
            <span className="font-semibold"> Email: </span> support@bookstore.com <br />
            <span className="font-semibold"> Phone: </span> +91 9911991199
          </p>
        </div>

      </motion.div>

      <Footer />

    </div>
  );
}