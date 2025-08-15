// /app/Home/page.js
'use client';

import { Suspense } from 'react';
import HomePageClient from './HomePageClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageClient />
    </Suspense>
  );
}



// 'use client';
// import { useEffect, useState } from 'react';
// import Card from '../../components/card';
// import axios from 'axios';
// import { useRouter } from 'next/navigation'; // ✅ correct import
// import { useSearchParams } from 'next/navigation';

// const HomePage = () => {
//   const router = useRouter(); 

//   const[loader, setLoader] = useState(false);
//   const [products, setProducts] = useState([]);

//   const searchParams = useSearchParams();
//   const category = searchParams.get('category');


//   useEffect(() => {
//     const getProducts = async () => {
//       setLoader(true);
//       let res;
//       try{
//         if(category){
//             res = await axios.get(`/api/Admin/category/${category}`);
//         }else{
//            res = await axios.get(`/api/Admin/allProducts`);
//         }
//           // console.log(res.data.message);
//         setProducts(res.data.message);
//         setLoader(false);
//       }catch(err){
//         console.log(err)
//       }
//     }
//     getProducts();
//   },[category]);

//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     if (userRole === 'admin') {
//       // router.push('/SellerDB');
//     } else {
//       router.push('/');
//     }
//   }, [router]);


//     return(
//         <>
//         {loader ?(
//           <div class="flex justify-center items-center h-screen">
//             <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>

//         ): (
//             <div className=" w-full">
//              <div className="p-4 px-4">              
//                    <h1 className="px-10 font-bold text-2xl">Popular Products</h1>      
//                               <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-10 mt-6">
          
//                       <Card data={products} />
                    
//                  </div>
//             </div>
//         </div>
//       )}
      
//         </>
//     )}

// export default HomePage;



// // app/page.js (or app/page.tsx)
// import Card from '../../components/card'; // ✅ Adjust path as needed

// export default async function HomePage({ searchParams }) {
//   const category = searchParams?.category || null;
//   let products = [];

//   try {
//     const url = category
//       ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/Admin/category/${category}`
//       : `${process.env.NEXT_PUBLIC_BASE_URL}/api/Admin/allProducts`;

//     const res = await fetch(url, { cache: 'no-store' }); // 👈 disables caching during dev
//     const data = await res.json();

//     products = data.message || [];
//   } catch (error) {
//     console.error('Error fetching products:', error);
//   }

//   return (
//     <div className="w-full">
//       <div className="p-4 px-4">
//         <h1 className="px-10 font-bold text-2xl">
//           {category ? `${category} Products` : 'Popular Products'}
//         </h1>
//         <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-10 mt-6">
//           <Card data={products} />
//         </div>
//       </div>
//     </div>
//   );
// }
