import { motion } from "motion/react";

export default function About() {
    return (
        <>
            <section id="about" className="max-w-4xl mx-auto px-6 py-14">
                <motion.div 
                className="py-16 my-8 text-center" 
                initial={{scale:0}} 
                animate={{scale:1}} 
                transition={{duration: 0.8}}
                >
                <h1 className="text-4xl md:text-5xl font-bold">Hi, I'm Pradhyuman</h1>
                <p className="mt-4 text-lg text-gray-400">
                    Frontend Developer | Tech Enthusiast
                </p>
                </motion.div>
        
            
                <motion.div 
                className='flex items-center justify-center flex-col p-4'
                initial={{scale:0}} 
                animate={{scale:1}} 
                transition={{duration: 0.8}}
                >
                <h2 className="text-2xl font-semibold mb-4 text-center">About</h2>
                <p className="text-gray-400 leading-relaxed text-center w-sm text-xl p-2">
                    I am a Computer Science undergraduate with a strong interest in frontend
                    development. I enjoy building modern, responsive, and user-friendly web
                    applications.
                </p>
                </motion.div>
            
            </section>
        </>
    )
}