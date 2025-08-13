"use client";
import HeroSection from '@/components/hero';
import Navbar from '../components/navbar';
import HomePage from './Home/page';
import FormPage from './Form/page';
import { useState,Suspense } from 'react';
import { isLoggedIn } from './ContextApi/form';
import Footer from './Footer/page';


const Home = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <isLoggedIn.Provider value={{ isLogin, setIsLogin }}>
      <div className="flex flex-col min-h-screen">
        {/* Top content */}
        <Navbar />
        <HeroSection />
        
        {/* Main content expands to fill space */}
        <main className="flex-grow">
          <Suspense fallback={<div>Loading...</div>}>
                 <HomeContent />
           </Suspense>
          <FormPage />
        </main>
        {/* Footer stays at the bottom */}
        <Footer />
      </div>
     </isLoggedIn.Provider>
  );
};

export default Home;


// https://fakestoreapi.com/products
// https://dummyjson.com/products