'use client';
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import Footer from "../../Footer/page";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";

const BuyPage = () => {


  const [index, setIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    const productById = async () => {
      try {
        const res = await axios.get(`/api/Admin/productId/${productId}`);
        const data = res.data.message;
        console.log(data[0]);
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        }
      } catch (err) {
        console.log("API error:", err);
      }
    };

    productById();
  }, [productId]);


 const handleCard = async (productId) => {
    const userId = localStorage.getItem('userId'); // assuming you save on login
    if(!userId) return toast.error('Need to login first');
  try {
    const res = await axios.post('/api/card/add', {userId, productId, quantity:1});
    console.log("Cart updated:", res.data);
    toast.success('Oroder add to card');
  } catch (err) {
    console.error("Cart error:", err);
  }
};

const handleBuyNow = async (productId) => {
  const userId = localStorage.getItem('userId'); // assuming you save on login
  if (!userId) return toast.error('Need to login first');
  
  try {
    // Add product to cart first
    const res = await axios.post('/api/card/add', { userId, productId, quantity: 1 });
    console.log("Cart updated:", res.data);
    toast.success('Product added to cart');

    // Redirect to the cart page
    window.location.href = '/myCard'; // Or you can use next/router to navigate programmatically
  } catch (err) {
    console.error("Cart error:", err);
  }
};


  return (
    <>
    <ToastContainer />
      <Navbar/>
      {product ? (
            <div className="w-full max-w-[1200px] mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
{/* Left: Image section */}
        {product?.imageUrl && (
        <div className="bg-white p-4 ">
            <img
            src={product.imageUrl[index]}
            alt="Main"
            className="rounded-2xl shadow-2xl w-full object-contain max-h-[400px] mx-auto"
            />

            <div className="flex gap-2.5 mt-5 flex-wrap text-center">
            {product.imageUrl.map((imgSrc, i) => (
                <img key={i} src={imgSrc} alt={`Thumbnail ${i}`}
                onClick={() => setIndex(i)}
                className={`cursor-pointer border-2 rounded w-[70px] h-[70px] object-cover ${
                    index === i ? 'border-blue-500' : 'border-gray-300'
                }`} />
            ))}
            </div>
        </div>
)}

          {/* Right: Product Info section */}
          <div>
            <h1 className="text-2xl font-semibold mt-2">
              {product?.productName || 'Loading...'}
            </h1>
            <p className="text-sm text-gray-400 mt-3">
              {product?.productDesc}
            </p>
            <h1 className="p-2 shadow text-2xl font-bold text-gray-700 mt-6">
              ${product?.productPrice- product?.productOffer}
              <sub className="text-gray-500 text-sm ml-2">
                <del>${product?.productPrice || 299}</del>
              </sub>
            </h1>

            <div className="p-4 mt-6 bg-white shadow-sm space-y-6">
              <div className="flex justify-between">
                <p>Category</p>
                <p>{product?.productCategory || 'unkown'}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                <button className="w-full sm:w-[48%] px-6 py-3 bg-gray-400 rounded cursor-pointer hover:bg-gray-300 transition ease-in-out duration-300" onClick={() => handleCard(product?._id)}>
                    Add to Cart</button>
                <button  onClick={() => handleBuyNow(product?._id)} className="w-full sm:w-[48%] px-6 py-3 bg-orange-400 text-white rounded cursor-pointer hover:bg-orange-300 transition ease-in-out duration-300">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      ):(
        <div class="flex justify-center items-center h-screen">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      )}
    
    
    </>
  );
};

export default BuyPage;