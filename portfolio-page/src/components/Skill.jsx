import { motion } from "motion/react";

export default function Skill() {
    return (
        <>
            {/* Education */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-semibold mb-4">Education</h2>
                <motion.div 
                className="glowbox p-6"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                >
                <p className="leading-relaxed">
                    JECRC University, Jaipur <br />
                    B.Tech in Computer Science Engineering <br />
                    (2021 - 2025)
                </p>
                </motion.div>
            </section>


            {/* SKILLS */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-semibold mb-6">Skills</h2>

                <motion.div 
                className="grid grid-cols-3 gap-4 text-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                {["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Responsive Web design", "Git", "Python django", "Playwright"].map(
                    (skill) => (
                    <span
                        key={skill}
                        className="glowbox px-4 py-3 text-md"
                    >
                        {skill}
                    </span>
                    )
                )}
                </motion.div>
            </section>


            {/* EXPERIENCE */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-semibold mb-8">Experience</h2>

                {/* Experience Card */}
                <motion.div 
                    className="bg-[#111827] border border-gray-800 rounded-xl p-6"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold">
                        Software Automation Intern
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                        Cocoabirch India • Internship • March 2025 - April 2025
                    </p>

                    <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
                        <li>
                            Conducted manual and automated testing to maintain product quality and reliability.
                        </li>
                        <li>
                            Designed and executed UI automation scripts using Playwright with JavaScript.
                        </li>
                        <li>
                            Verified new features to ensure proper functionality and alignment with business requirements.
                        </li>
                    </ul>
                </motion.div>
            </section>

        </>
    )
}