import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import API from "../config/api";

export default function BookSlider() {
  const containerRef = useRef(null);
  const [sliderBooks, setSliderBooks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // fetch books from db
  useEffect(() => {
    const fetchSliderBooks = async() => {
      try {
        const res = await fetch(`${API}/books/book-slider`);
        const data = await res.json();

        if(data.success) {
          setSliderBooks(data.data);
        }
      }
      catch(err) {
        console.log(err);
      }
    };

    fetchSliderBooks();

    // auto refresh every 5 sec
    const interval = setInterval(fetchSliderBooks, 5000);
    return () => clearInterval(interval);
  }, []);

  // slider animation
  useEffect(() => {
    if (sliderBooks.length === 0) return;

    const container = containerRef.current;
    let animationFrame;

    const updateScale = () => {
      if(!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const children = Array.from(container.children);

      children.forEach((child) => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;

        const distance = Math.abs(containerCenter - childCenter);

        // closer to center → bigger
        const scale = Math.max(0.85, 1.15 - distance / 400);
        const blur = Math.min(8, distance / 120);
        const opacity = Math.max(0.4, 1 - distance / 400);

        child.style.transform = `scale(${scale})`;
        child.style.filter = `blur(${blur}px)`;
        child.style.opacity = opacity;
        child.style.transition = "transform 0.2s linear, filter 0.2s linear, opacity 0.2s linear";
      });
    };

    const scroll = () => {
      if (!container) return;

      const firstChild = container.firstChild;
      if(!firstChild) {
        animationFrame = requestAnimationFrame(scroll);
        return;
      }

      if(!isPaused) {
        container.scrollLeft += 0.6; // speed
        
        // when first image fully goes out
        if (container.scrollLeft >= container.firstChild.offsetWidth + 24) {
          container.appendChild(container.firstChild);      // move first image to end
          container.scrollLeft = 0;
        }
      }

      updateScale();
      animationFrame = requestAnimationFrame(scroll);
    };

    scroll();

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, sliderBooks]);

  return (
    <div className="w-full py-6 bg-linear-to-b from-zinc-900 to-zinc-100 overflow-hidden">
      
      <div
        ref={containerRef}
        className="flex gap-6 w-full h-96 overflow-hidden"
      >
        {sliderBooks.map((book) => (
          <div
            key={book._id}
            className="w-60 h-80 mt-8 flex items-center justify-center shrink-0 transition-all duration-200"
            // pause on hover
            onMouseEnter = {() => setIsPaused(true)}
            onMouseLeave = {() => setIsPaused(false)}
            onClick = {() => navigate(`/product/${book._id}`)}
          >
            <img
              src={`${API}/${book.images[0]}`}
              alt="book"
              className="max-w-full max-h-full object-contain rounded-lg shadow-md pointer-events-none"
            />
          </div>
          )) }
      </div>

    </div>
  );
}