import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <div className="min-h-screen pt-18 flex flex-col bg-stone-100 overflow-x-hidden">

      <Header />

      <div className="grow w-full mx-auto px-6 py-12">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl text-zinc-800 underline font-bold text-center mb-6">
          Contact Us
        </h1>

        {/* Intro */}
        <p className="text-lg sm:text-xl text-zinc-700 text-center mb-10 wrap-break-word">
          We'd love to hear from you. Reach out to us for any <span className="text-amber-500"> queries,
          feedback, or support. </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-evenly gap-2">
          <motion.div
            initial={{scale:0}}
            animate={{scale:1 }}
            transition={{duration: 0.8}}
          >
            {/* Contact Info */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl text-zinc-800 font-semibold mb-2">
                Get in Touch
              </h2>
              <p className="text-zinc-700">
                <span className="font-semibold"> Email: </span> support@bookstore.com <br />
                <span className="font-semibold"> Phone: </span> +91 9911991199
              </p>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl text-zinc-800 font-semibold mb-2">
                Address
              </h2>
              <p className="text-zinc-700">
                BookStore Pvt. Ltd. <br />
                Rajasthan, India
              </p>
            </div>

            {/* Hours */}
            <div className="mt-6">
              <h2 className="text-xl sm:text-2xl text-zinc-800 font-semibold mb-2">
                Working Hours
              </h2>
              <p className="text-zinc-700">
                Monday - Saturday <br />
                10:00 AM - 6:00 PM <br />
                <span className="font-semibold"> Sunday: Closed </span>
              </p>
            </div>
          </motion.div>
      
          <motion.div 
            className="flex items-center justify-center mb-8"
            initial={{scale:0}}
            animate={{scale:1}}
            transition={{duration: 1}}  
          >
            {/* Map */}
            <div className="bg-stone-300 p-4 rounded-2xl shadow-lg mt-10">
              <h2 className="text-xl sm:text-2xl text-zinc-800 font-bold mb-4">
                Our Location
              </h2>

              <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57694.230254351416!2d74.5905363150529!3d25.341492393620562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c2368c070a55%3A0xc92f70a42dcb5294!2sBhilwara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1777568254196!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      <Footer />

    </div>
  );
}