'use client';
import { useState,useEffect } from "react";
import Navbar from "@/components/navbar";
import axios from "axios";
import Card from "@/components/card";
import { IoMenu, IoClose } from "react-icons/io5";
import Footer from "../Footer/page";

const categories = [
    "All Products",
    "Electronics",
    "Mobiles & Tablets",
    "Laptops ",
    "Fashion - Men",
    "Fashion - Women",
    "Fashion - Kids",
    "Beauty Care",
    "Health & Wellness",
    "Sports & Fitness",
    "Books & Stationery",
    "Grocery & Gourmet",
    "Toys & Games",
    "Furniture",
    "Home & Kitchen",
    "Jewelry",
    "Watches",
    "Footwear",
    "Baby Products",
    "Musical Instruments",

];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 639);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  useEffect(() => {
    const getProducts = async () => {
      try{
        const res = await axios.get(`/api/Admin/allProducts`);
        // console.log(res.data.message);
        setProducts(res.data.message);
        setAllProducts(res.data.message);
      }catch(err){
        console.log(err)
      }
    }
    getProducts();
  },[]);

const handleChecked = async (cat) => {
  const newCategory = cat === selectedCategory ? "" : cat;
  setSelectedCategory(newCategory);
  // console.log('cat',cat);
  try {
    if (cat === "All Products" || newCategory === "") {
       const res = await axios.get(`/api/Admin/allProducts`);
       setProducts(res.data.message);
       setAllProducts(res.data.message);
    } else {
      const res = await axios.get(`/api/Admin/category/${cat}`);
      if (Array.isArray(res.data.message)) {
          setProducts(res.data.message);
          setAllProducts(res.data.message);
      } else {
        setProducts([]);
        setAllProducts([]);
      }
    }
  } catch (err) {
    console.error(err);
  }
};


const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  if (query) {
    const filtered = allProducts.filter((product) =>
      product.productName?.toLowerCase().includes(query) ||
      product.productDesc?.toLowerCase().includes(query)
    );
    // console.log("Filtered:", filtered);

    setProducts(filtered);
  } else {
    setProducts(allProducts);
  }
};



// Sidebar content (reuse for both mobile and desktop)
  const Sidebar = () => (
    <div className="p-2 bg-white rounded shadow-lg w-full sm:w-[65%] mt-6">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul>
        {categories.map((cat, i) => (
          <li key={i} className="mb-2 flex gap-2 items-center text-sm font-semibold">
            <input id={`cat-${i}`} type="checkbox"
              checked={selectedCategory === cat}
              // onChange={() =>setSelectedCategory(cat === selectedCategory ? "" : cat)}
              onChange={() => handleChecked(cat)}
            />
            <label htmlFor={`cat-${i}`} className="cursor-pointer">{cat}</label>
          </li>
        ))}
      </ul>


    </div>
  );

  return (
    <>
      <Navbar />

      <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Mobile Menu Icon */}
        {isMobile && (
          <div className="flex justify-between items-center mb-4 ">
            <h1 className="text-xl font-semibold">Filters</h1>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
            </button>
          </div>
        )}

        {/* Responsive Layout */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidebar */}
          {isMobile ? (
            isMenuOpen && <Sidebar />
          ) : (
            <div className="w-[30%]">{<Sidebar />}</div>
          )}

          {/* Products Section */}
          <div className="w-full sm:w-[75%] mt-6">
           <div className="flex gap-2 items-center justify-between md:flex-row flex-col">
              <h1 className="text-2xl font-bold mb-4">
            {selectedCategory && selectedCategory !== "All Products"? selectedCategory : "All Products"}
           </h1>
           <input onChange={handleSearch} type="text" className="w-full md:w-1/3 outline-none p-2  rounded-lg border border-gray-400" placeholder="find product here" />
           </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
              lg:grid-cols-3 gap-6 mt-6">
             {Array.isArray(products) && products.length > 0 ?   <Card data={products} /> : <div className="text-center font-semibold">
                No products found in this category. </div>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
            <Footer />
      </div>
    </>
  );
};

export default ShopPage;