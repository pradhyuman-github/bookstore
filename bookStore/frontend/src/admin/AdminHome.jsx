import { useState, useEffect } from "react";
import API from "../config/api";

export default function AdminHome() {
  const [stats, setStats] = useState({});
  const [recentBooks, setRecentBooks] = useState([]);

  // for showing stats
  useEffect(() => {
    const fetchStats = async() => {
      const res = await fetch(`${API}/books/book-stats`);
      const data = await res.json();
      setStats(data.data);
    };

    fetchStats();
  }, []);

  // for showing recent books
  useEffect(() => {
    const fetchRecentBooks = async() => {
      try {
        const res = await fetch(`${API}/books/view-book`);
        const data = await res.json();

        // only 4 books
        setRecentBooks( data.data.slice(0,4) );
      }
      catch(err) {
        console.log(err);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500"> Total Books </h2>
          <p className="text-2xl font-bold mt-2"> {stats.totalBooks} </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500"> Available </h2>
          <p className="text-2xl font-bold mt-2 text-green-500"> {stats.availableBooks} </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500"> Out of Stock </h2>
          <p className="text-2xl font-bold mt-2 text-red-500"> {stats.outOfStockBooks} </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Book sold</h2>
          <p className="text-2xl font-bold mt-2"> 2 </p>
        </div>

      </div>

      {/* Recent Books */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">Recent Books</h2>

        <div className="grid sm:grid-cols-4 gap-4 overflow-x-auto">

          {recentBooks.map((book) => (
            <div
              key={book._id}
              className="min-w-37.5 bg-stone-300 p-3 rounded-lg"
            >
              <img
                src={`${API}/${book.images[0]}`}
                alt="book"
                className="w-full h-fit object-cover rounded"
              />
              <p className="mt-2 font-medium"> {book.bookName} </p>
              <p className="text-sm text-gray-500"> ₹{book.bookPrice} </p>
            </div>
          ))}

        </div>

      </div>

      {/* Quick Actions */}
      <div className="mt-10 flex items-center justify-center gap-6">

        <button className="bg-purple-500 text-white w-sm p-4 rounded-lg shadow hover:bg-purple-600">
          Analytics
        </button>

      </div>

    </div>
  );
}