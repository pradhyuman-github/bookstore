export default function Footer() {
    return (
        <>
            <footer id="contact" className="p-16 mt-16  text-center">
                <h2 className="text-2xl font-semibold mb-10">Let's Connect</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 text-gray-400">
                <a
                    href="mailto:pradhyumanbhati019@gmail.com"
                    className="hover:text-cyan-400 transition"
                >
                    📧 Gmail
                </a>

                <a
                    href="https://www.linkedin.com/in/pradhyuman-singh-bhati-b2a7a8270/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition"
                >
                    🌐 LinkedIn
                </a>

                <a
                    href="https://github.com/pradhyuman-github"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition"
                >
                    💻 GitHub
                </a>
                </div>
            </footer>
            
        </>
    )
}