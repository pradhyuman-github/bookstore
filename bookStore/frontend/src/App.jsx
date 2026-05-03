import './App.css'
import { Route, Routes, useLocation } from 'react-router';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import About from './components/About';
import Contact from './components/Contact';
import ProductPage from './pages/ProductPage';
import AllBooks from './pages/AllBooks';

import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './components/UserProfile';

import AdminLogin from './admin/AdminLogin';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminPage from './admin/AdminPage';
import AdminHome from './admin/AdminHome';
import AddBooks from './admin/AddBooks';
import DisplayBooks from './admin/DisplayBooks';
import CreateCoupon from './admin/CreateCoupon';
import DisplayCoupon from './admin/DisplayCoupon';
import DisplayOrder from './admin/DisplayOrder';

import AddCart from './components/AddCart';
import Checkout from './pages/Checkout';
import InvoicePage from './components/InvoicePDF';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    console.log("ADDING PRODUCT:", product);
    
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);

      if (existing) {
          return prev.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } 
        else {
          return [
            ...prev,
            {
              _id: product._id,
              bookName: product.bookName,
              price: Number(product.price),
              image: product.image,
              quantity: 1,
              category: product.category,
              genre: product.genre
            }
          ];
        }
      }
    )
    
    setIsCartOpen(true);
  };

  return (
    <div>
      <div className={`transition-all duration-300 ${isCartOpen && !isAdminRoute ? "blur-sm pointer-events-none" : ""}`}>
        <Routes>
          <Route path='/' element={
            <Home 
              openCart={() => setIsCartOpen(true)} 
              addToCart={addToCart} />
            } 
          /> 

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<UserProfile />} />

          <Route path='/checkout' element={<Checkout />} />
          <Route path='/invoice' element={<InvoicePage />} />

          <Route path='/product/:productId' element={<ProductPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />

          <Route path='/books' element={
            <AllBooks
              openCart={() => setIsCartOpen(true)} />
            } 
          />

          <Route path='/admin/login' element={<AdminLogin />} />

          <Route path='/admin' 
            element={
              <AdminProtectedRoute>
                <AdminPage /> 
              </AdminProtectedRoute>
              } 
          >
            <Route index element={<AdminHome /> } />
            <Route path="add" element={ <AddBooks /> } />
            <Route path="view" element={ <DisplayBooks /> } />
            <Route path="create-coupon" element={ <CreateCoupon /> } />
            <Route path="view-coupon" element={ <DisplayCoupon /> } />
            <Route path="all-orders" element={ <DisplayOrder /> } />
          </Route> 
        </Routes>
      </div>

      { !isAdminRoute && (
        <AddCart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          setCart={setCart} 
        />
        )
      }

    </div>

  );
}

export default App;

// using auth admin - pending