import './App.css'

function App() {

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-900 via-fuchsia-900 to-black text-gray-200">
    
      
      {/* HEADER */}
      <header className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Hi, I'm Pradhyuman</h1>
        <p className="mt-4 text-lg text-gray-400">
          Frontend Developer | Tech Enthusiast
        </p>
      </header>

      {/* ABOUT */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="">
          <h2 className="text-2xl font-semibold mb-4 text-center">About</h2>
          <div className='flex items-center justify-center p-4'>
            <p className="text-gray-400 leading-relaxed text-center w-sm text-xl p-2">
              I am a Computer Science undergraduate with a strong interest in frontend
              development. I enjoy building modern, responsive, and user-friendly web
              applications.
            </p>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-6">
          <p className="leading-relaxed">
            JECRC University, Jaipur
            <p>B.Tech in Computer Science Engineering</p>
            (2021 - 2025)
          </p>
        </div>
      </section>


      {/* SKILLS */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Skills</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          {["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git", "Python django", "Playwright"].map(
            (skill) => (
              <span
                key={skill}
                className="px-4 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-md"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </section>


      {/* EXPERIENCE */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-8">Experience</h2>

        <div className="space-y-6">

          {/* Experience Card */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
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
          </div>

        </div>
      </section>


      {/* PROJECTS */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-10">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Project Card */}
          <div className="bg-[#111827] rounded-xl p-6 shadow-lg transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:border hover:border-cyan-400">
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

          <div className="bg-[#111827] rounded-xl p-6 shadow-lg transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:border hover:border-cyan-400">
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

          <div className="bg-[#111827] rounded-xl p-6 shadow-lg transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:border hover:border-cyan-400">
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

        </div>
      </section>



      {/* FOOTER */}
      <footer className="p-16 text-center">
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

    </div>
  
  );
}

export default App
