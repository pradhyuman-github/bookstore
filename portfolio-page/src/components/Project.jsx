import { motion } from "motion/react";

export default function Project() {
    return (
        <>
            <section id="project" className="max-w-4xl mx-auto mt-8 px-6 py-12">
                <h2 className="text-2xl font-semibold mb-10">Projects</h2>

                <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                >

                {/* Project Card */}
                <div className="bg-[#111827] rounded-xl p-6 shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:border hover:border-cyan-400">
                    <h3 className="text-lg font-semibold">Sky Glimpse</h3>
                    <p className="text-gray-400 text-sm mt-2">
                    A real-time weather application using public weather APIs with
                        dynamic UI updates and responsive design.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {["HTML", "CSS", "JavaScript", "API"].map((tech) => (
                        <span
                            key={tech}
                            className="text-xs px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300"
                        >
                            {tech}
                        </span>
                        ))}
                    </div>
                    <a
                    href="https://pradhyuman-github.github.io/weather/" target='_blank'
                    className="inline-block mt-5 text-cyan-400 hover:underline"
                    >
                    View Project →
                    </a>
                </div>

                <div className="bg-[#111827] rounded-xl p-6 shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:border hover:border-cyan-400">
                    <h3 className="text-lg font-semibold">Pizza House</h3>
                    <p className="text-gray-400 text-sm mt-2">
                    Designed a visually appealing pizza website for showcasing menu items, offers, and contact details.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {["HTML","CSS","JavaScript", "UI Design"].map((tech) => (
                        <span
                            key={tech}
                            className="text-xs px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300"
                        >
                            {tech}
                        </span>
                        ))}
                    </div>

                    <a
                        href="https://pradhyuman-github.github.io/pizza-page/" target='_blank'
                        className="inline-block mt-5 text-cyan-400 hover:underline"
                    >
                        View Project →
                    </a>
                </div>

                <div className="bg-[#111827] rounded-xl p-6 shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:border hover:border-cyan-400">
                    <h3 className="text-lg font-semibold">Frontend projects</h3>
                    <p className="text-gray-400 text-sm mt-2">
                    Collection of some frontend-specific projects.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {["HTML/CSS", "JS", "React", "Tailwind"].map((tech) => (
                        <span
                            key={tech}
                            className="text-xs px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300"
                        >
                            {tech}
                        </span>
                        ))}
                    </div>

                    <a
                        href="https://pradhyuman-github.github.io/Components/"
                        className="inline-block mt-5 text-cyan-400 hover:underline"
                    >
                        View Project →
                    </a>
                </div>

                </motion.div>
            </section>
            
        </>
    )
}