'use client';

import { useEffect, useState } from 'react';
import Card from '../components/card';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const HomePageClient = () => {
  const router = useRouter(); 
  const [loader, setLoader] = useState(false);
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const getProducts = async () => {
      setLoader(true);
      try {
        const res = category
          ? await axios.get(`/api/Admin/category/${category}`)
          : await axios.get(`/api/Admin/allProducts`);
        setProducts(res.data.message);
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    };
    getProducts();
  }, [category]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full">
          <div className="p-4 px-4">
            <h1 className="px-10 font-bold text-2xl">Popular Products</h1>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-10 mt-6">
              <Card data={products} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePageClient;
