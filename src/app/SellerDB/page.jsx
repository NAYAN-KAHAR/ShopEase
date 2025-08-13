'use client';
import { act, useEffect, useState } from "react";
import { IoMenuSharp, IoCloseSharp } from "react-icons/io5";
import { IoIosCloudUpload } from "react-icons/io";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';


const SellerDashBoard = () => {
  const[userId,setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if(id){
      setUserId(id);
      setLoading(false);
    }else{
      router.push('/');
    }
    
  }, []);

    if (loading) {
    return (
     <div class="flex justify-center items-center h-screen">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

    );
  }
  
  const [active, setActive] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [productName,  setProductName] =   useState('');
  const [productDesc,  setProductDesc] =   useState('');
  const [productPrice, setProductPrice] =  useState('');
  const [productOffer, setProductOffer] =  useState('');
  const [selectValue, setSelectValue] =    useState('');

  const [images, setImages] = useState(['', '', '', '']);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(['', '', '', '']);

  const [products, setProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // to track if next page exists
  const limit = 6;
  const [searchValue, setSearchValue] = useState('');
  const [allProducts, setAllProducts] = useState([]); 

  const productCategories = [
    "Electronics",
    "Mobiles",
     "Tablets",
    "Laptops ",
    "Home Appliances",
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
    "Automotive",
    "Pet Supplies",
    "Jewelry",
    "Watches",
    "Footwear",
    "Baby Products",
    "Musical Instruments",
    "Garden & Outdoors",
    "Industrial & Scientific",
    "Office Supplies",
    "Software",
    "Digital Downloads",
  ];

  
  // filters products based on the search query.
const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  if (query) {
       const filtered = allProducts.filter((product) =>
         product.productName?.toLowerCase().includes(query));
       
       setProducts(filtered);
    }
    
  else {
    setProducts(allProducts);
  }
};


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 639);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

     const allOrders = async () => {
      if (!userId) return; 
      try{
        const res = await axios.get(`/api/Admin/orderList/${userId}`);
        // console.log('from order', res.data.message);
        setOrderList(res.data.message);
      }catch(err){
        console.log(err);
      }
    };


useEffect(() => {
  const allProducts = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`/api/Admin/productList/${userId}?page=${page}&limit=${limit}`);
      const fetchedProducts = res.data.message;

      if (fetchedProducts.length === 0) {
        setProducts([]);
        setAllProducts([]);
        setHasMore(false);
      } else {
        setProducts(fetchedProducts);
        setAllProducts(fetchedProducts);
        setHasMore(fetchedProducts.length === limit);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  allProducts();
  allOrders();
}, [userId, page]);





  const handleImage = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[id] = file;
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviewUrl];
    updatedPreviews[id] = URL.createObjectURL(file);
    setImagePreviewUrl(updatedPreviews);
  };



  const handleProduct = async () => {
    if (
      !productName.trim() ||
      !productDesc.trim() ||
      !selectValue.trim() ||
      !productPrice.toString().trim() ||
      !productOffer.toString().trim() ||
      !userId.toString().trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedCount = images.filter((f) => f !== null).length;
    if (selectedCount < 1) {
      alert("Please upload at least 2 images");
      return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productDesc', productDesc);
    formData.append('productPrice', productPrice);
    formData.append('productOffer', productOffer);
    formData.append('selectValue', selectValue);
    formData.append('userId', userId);

    images.forEach((img, i) => {
      if (img) {
        formData.append(`image${i + 1}`, img);
      }
    });
    setLoader(true);
    try {
      const res = await axios.post('/api/Admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("Product uploaded successfully");
      console.log("Response:", res.data);
      setProductPrice('')
      setProductDesc('')
      setProductName('')
      setProductOffer('')
      setSelectValue('')
      setImagePreviewUrl(null)
      setLoader(false);
  
    } catch (err) {
      console.error(err);
      alert("Failed to upload product");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    router.push('/')
    
};


  return (
    <>
      <div className="w-full shadow-sm mb-4">
        <div className="p-2 px-8 flex justify-between items-center">
          <Link href={'/'}><h1 className="text-lg font-bold">Quick Card</h1></Link>
          <button onClick={handleSignOut} 
          className="px-4 py-1 bg-red-800 text-white rounded cursor-pointer"> Logout </button>
        </div>
      </div>

      <div className="relative flex w-full h-full min-h-[90vh]">
        {/* Toggle button for mobile */}
        {isMobile ? (
          <div
            className="px-2 cursor-pointer absolute top-2 left-2 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <IoCloseSharp size={33} /> : <IoMenuSharp size={33} />}
          </div>
        ) : (
          <div className="p-2 w-[18%] shadow-sm border-r border-gray-400 flex flex-col gap-5">
            <div onClick={() => setActive(1)}
              className={`p-2 text-sm text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 ${active === 1 ? "bg-gray-300" : ""}`}>➕ Added Product
            </div>

            <div onClick={() => setActive(2)}
              className={`p-2 text-sm text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 ${active === 2 ? "bg-gray-300" : ""}`}> 📦 Product Lists
            </div>

            <div onClick={() => setActive(3)}
              className={`p-2 text-sm text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 ${active === 3 ? "bg-gray-300" : ""}`}>🛒 Orders
            </div>

          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 z-50 flex h-full w-full bg-white">
            <div className="p-2 w-[60%] shadow-sm border-r border-gray-400 flex flex-col gap-5 bg-white">
              <div onClick={() => setActive(1)}
                className={`p-2 text-sm text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 ${active === 1 ? "bg-gray-300" : ""}`}> ➕ Added Product
              </div>
              <div onClick={() => setActive(2)}
                className={`p-2 text-sm text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 ${active === 2 ? "bg-gray-300" : ""}`}>📦 Product Lists
              </div>

              <div onClick={() => setActive(3)}
                className={`p-2 text-sm text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 ${active === 3 ? "bg-gray-300" : ""}`}>🛒 Orders
              </div>
            </div>

            {/* Transparent remaining part of screen */}
            <div className="w-[40%]" onClick={() => setIsMenuOpen(false)} />
          </div>
        )}



        {/* Main Content */}
       {active === 1 && (
        <>
           <div className="flex-1 p-2 md:w-[82%] w-full mt-14 md:mt-0">
          <div className="p-2">
            <div className="mb-4">
              <h1 className="font-semibold mb-3">Product Image</h1>
              <div className="flex flex-wrap gap-4 items-center">
                {[0, 1, 2, 3].map((id) => (
                  <div key={id} className="border p-2 px-6 border-gray-300 rounded flex flex-col items-center">
                    {imagePreviewUrl[id] ? (
                      <img src={imagePreviewUrl[id]} alt={`Preview ${id + 1}`} className="w-10 h-10" />
                    ) : (
                      <>
                        <IoIosCloudUpload size={18} />
                        <label htmlFor={`id${id}`} className="cursor-pointer">Upload</label>
                        <input onChange={(e) => handleImage(e, id)} type="file" id={`id${id}`} className="hidden" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-3 mt-2">
              <label htmlFor="name" className="font-semibold">Product Name</label>
              <input
                type="text"
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 bg-gray-200 outline-none rounded"
                placeholder="Type here"
              />
            </div>

            <div className="mb-4">
              <h1 className="font-semibold mb-2">Product Description</h1>
              <textarea placeholder="Type here..." value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                className="p-2 w-full h-40 outline-none border border-gray-200 resize-none rounded"
              />
            </div>

            <div className="w-full flex flex-wrap gap-4">
              <div>
                <h1 className="font-semibold mb-1">Category</h1>
                <select value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  className="p-2 border border-gray-300">
                  <option value="">Select Category</option>
                  {productCategories.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <h1 className="font-semibold mb-1">Product Price</h1>
                <input type="number" value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="p-2 border border-gray-300 outline-none"/>
              </div>
              <div>
                <h1 className="font-semibold mb-1">Price Offers</h1>
                <input type="number" value={productOffer}
                  onChange={(e) => setProductOffer(e.target.value)}
                  className="p-2 border border-gray-300 outline-none" />
              </div>
            </div>

            <button onClick={handleProduct}
              className="mt-6 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 cursor-pointer">
                <div className="flex items-center gap-2 justify-center ">
                  {loader && (<div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>)} <span>Add Product</span>
               </div>
              </button>
          </div>
        </div>
        </>
       )}

       {active === 2 && (
        <>
        
         <div className="flex-1 p-2 md:w-[82%] w-full mt-14 md:mt-0">
          <div className="p-2 flex items-center justify-between md:flex-row flex-col gap-2">
            <h1 className="font-bold text-lg ">All Products</h1>
            <input type="text" placeholder="search products" className="w-full md:w-1/3 p-2 outline-none border border-gray-200 rounded-lg" onChange={handleSearch}/>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[700px] w-full table-auto  border-collapse border border-gray-200 overflow-x-auto">
              <thead className="bg-gray-100 text-gray-700 text-left">
                    <tr>
                    <th className="p-3  border-b border-gray-200">#Id</th>
                    <th className="p-3  border-b border-gray-200">Product</th>
                    <th className="p-3 border-b border-gray-200">Category</th>
                    <th className="p-3 border-b border-gray-200">Price</th>
                    <th className="p-3 border-b border-gray-200">Offer</th>
                    <th className="p-3 border-b border-gray-200">Action</th>
                  </tr>
              </thead>
                <tbody className="text-sm text-gray-800">
                {products ? products.map((value, i) => {
                  return <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="text-center border-b border-gray-100 font-bold">{i+1}</td>
                  <td className="flex items-center gap-4 p-3 border-b border-gray-100 text-truncate">
                    <img src={value.imageUrl[0]} alt="img" className="w-8 object-contain" />{value.productName}</td>
                  <td className="p-3 border-b border-gray-100 text-truncate">{value.productCategory}</td>
                  <td className="p-3 border-b border-gray-100">${value.productPrice}</td>
                  <td className="p-3 border-b border-gray-100">${value.productOffer} Off</td>
                  <td className="p-3 border-b border-gray-100">
                    <Link href={`/BuyPage/${value._id}`}><button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer">View </button></Link>
                </td>
                </tr>
                }):<div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
    
             </tbody>

            </table>

            <div className="p-6 flex items-center justify-between">
                  {page > 1 ?  <button className="px-4 py-1 rounded cursor-pointer bg-blue-700
                   text-white hover:bg-blue-500 transition" onClick={() => setPage(page -1)}>
                    Previous</button> : <div></div>}

                {hasMore && products.length > 0 && (
         <button className="px-4 py-1 rounded cursor-pointer bg-blue-700 text-white hover:bg-blue-500 transition"
          onClick={() => setPage((prev) => prev + 1)}>  Next</button>)}
            </div>
          </div>
        </div>
        </>
       )

       }

       {active ==3 && (
        <>
         <div className="flex-1 p-2 md:w-[82%] w-full mt-14 md:mt-0">
             <div className="p-2 flex items-center justify-between md:flex-row flex-col gap-2">
            <h1 className="font-bold text-lg ">All Orders</h1>
          </div>

          <div className="p-2 overflow-x-auto">
          
           <table className="min-w-[700px] w-full table-auto border-collapse border border-gray-200 overflow-x-auto">
  <thead className="bg-gray-100 text-gray-700">
    <tr>
      <th className="p-3 border-b border-gray-200 text-left">Product</th>
      <th className="p-3 border-b border-gray-200 text-left">Address</th>
      <th className="p-3 border-b border-gray-200 text-left">Price</th>
      <th className="p-3 border-b border-gray-200 text-left">Status</th>
    </tr>
  </thead>

  <tbody className="text-sm text-gray-800">
    {orderList?.map((order, orderIndex) =>
      order.items.map((item, itemIndex) => (
        <tr key={`${orderIndex}-${itemIndex}`} className="hover:bg-gray-50 transition-colors">
          
          {/* Product Column */}
          <td className="p-3 border-b border-gray-100 whitespace-nowrap align-middle">
            <div className="flex items-center gap-3">
              <img src={item.productId?.imageUrl?.[0]} alt="product"
                className="w-10 h-10 object-cover rounded "/>
              <span>{item.productId?.productName || "No name"}</span>
            </div>
          </td>

          {/* Address Column */}
          <td className="p-3 border-b border-gray-100 align-top">
            <div className="flex flex-col gap-0.5">
              <span>{order.shippingAddress?.address}</span>
              <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
              <span>{order.shippingAddress?.phone}</span>
              <span>{order.shippingAddress?.postalCode}</span>
            </div>
          </td>

          {/* Price Column */}
          <td className="p-3 border-b border-gray-100 align-middle">
            ₹{item.priceAtPurchase}
          </td>

          {/* Status Column */}
          <td className="p-3 border-b border-gray-100 align-middle capitalize">
            <div className="flex flex-col gap-0.5">
              <span>Method: {order.paymentInfo?.method || "Unknown"}</span>
              <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
             <span>Payment: {order.paymentInfo?.status || "Unknown"}</span>
            </div>
          </td>

        </tr>
      ))
    )}
  </tbody>
</table>


          </div>
        </div>

        </>
       )

       }
{/* main content end */}


      </div>
    </>
  );
};

export default SellerDashBoard;
