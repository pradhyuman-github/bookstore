import './App.css'
import Header from "./components/Header";
import About from "./components/About";
import Skill from "./components/Skill";
import Project from "./components/Project";
import Footer from './components/Footer';

function App() {

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-900 via-fuchsia-900 to-black text-gray-200">
    
      <Header />
      <About />
      <Skill />
      <Project />
      <Footer />

    </div>
  
  );
}

export default App
