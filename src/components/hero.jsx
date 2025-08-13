
'use client';
import Link from "next/link";
import { useDebugValue, useEffect, useState } from "react";

const HeroSection = () => {
    const [images, setImages] = useState([
       {
        id:1,
        src:'https://itseeze.com/_webedit/cached-images/3214-0-792-1736-8416-6312-1132.png'
       },
       {
        id:2,
        src:'https://briansolis.com/wp-content/uploads/2022/01/eCommerce-Website-Components-photo.jpg',
       },
       {
        id:3,
        src: 'https://t3.ftcdn.net/jpg/07/94/31/84/360_F_794318493_zd15A3T9jwufIZbz13GhXleOZlNCu8Vj.jpg'
       }
    ]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // let interval =  setInterval(() => {
        //     if(index === 0){
        //         setIndex(1)
        //     }else if (index === 1){
        //         setIndex(2);
        //     }else if (index ===3){  
        //             setIndex(3)                
        //     }else{
        //         setIndex(0)
        //     }
        // },7000);
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 7000);

        return () => clearInterval(interval);
    },[index])
       
    return(
        <>
             <div className="w-full h-[400px] relative overflow-hidden">
            {/* Gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>

        <img src={images[index].src} alt="hero"className="w-full h-full object-cover"/>
            
              {/* Text content */}
  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-gray-100 z-20">
      <h1 className="text-5xl font-bold mb-4  text-center">Welcome to SHOP.CO</h1>
       <p className="text-lg text-center max-w-xl">Discover timeless style, cutting-edge tech, and bold elegance.</p>
      <Link href={'/Shop'}><button className="mt-4 px-6 py-2 text-black bg-white rounded hover:bg-gray-200  cursor-pointer"> Shop Now</button></Link>
  </div>
        </div>

        </>
    )
};

export default HeroSection;