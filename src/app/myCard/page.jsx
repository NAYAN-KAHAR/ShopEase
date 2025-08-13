'use client'
import Navbar from "@/components/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";


const MyCardPage = () => {
    const[showForm, setShowForm] = useState(false);
    const[cart, setCart] = useState([]);
    const[productCount, setProductCount] = useState(1);

    const[name, setName] = useState('');
    const[phone, setPhone] = useState('');
    const[postalCode, setPostalCode] = useState('');
    const[address, setAddress] = useState('');
    const[city, setCity] = useState('');
    const[state, setState] = useState('');
    const[loader, setLoader] = useState(false);

    const handleShowBtn = () => {
        setShowForm(!showForm);
    };

  useEffect(() => {
  const fetchUserCart = async () => {
    const user_id = localStorage.getItem('userId');
    if (!user_id) return;
    try {
      const res = await axios.get(`/api/card/get/${user_id}`);
      console.log(res.data.cart);
      setCart(res.data.cart);
      
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  fetchUserCart();
}, []);

 // Increase quantity of item at index
  const increaseQuantity = (index) => {
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const newItems = [...prevCart.items];
      newItems[index] = {
        ...newItems[index],
        quantity: newItems[index].quantity + 1,
      };
      return { ...prevCart, items: newItems };
    });
  };

  // Decrease quantity of item at index (min 1)
  const decreaseQuantity = (index) => {
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const newItems = [...prevCart.items];
      newItems[index] = {
        ...newItems[index],
        quantity: Math.max(1, newItems[index].quantity - 1),
      };
      return { ...prevCart, items: newItems };
    });
  };

const handleShipping =  () => {
    console.log(name,phone,postalCode,address,city,state);
    if (!name.trim() || !phone.trim() || !postalCode.trim() || !address.trim() || !state.trim()) {
        return alert("All shipping credentials are required");
    }
     setTimeout(() => {
        setShowForm(!showForm);
     },200);
}

// order logic 
const handlePlaceOrder = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId || !cart?.items?.length) return alert("Cart is empty or user not logged in");

  if (!name.trim() || !phone.trim() || !postalCode.trim() || !address.trim() || !state.trim()) {
    return alert("All shipping credentials are required");
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + (item.productId.productPrice - item.productId.productOffer) * item.quantity,0);

    const cartItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      priceAtPurchase: item.productId.productPrice - item.productId.productOffer,
  }));
  const shippingAddress = {name,phone,postalCode,address,city,state};
  try {
     setLoader(true);
    const res = await axios.post("/api/order/placed", {userId,cartItems,shippingAddress,totalPrice});
    console.log(res.data);
    setLoader(false);
    if (res.data.success) {
     // Clear cart in DB
      await axios.delete(`/api/card/clear/${userId}`);
  
      // Clear cart in frontend state
      setCart({ items: [] });
     alert("Order placed successfully!");
   }
  } catch (err) {
    console.error("Order failed:", err);
    alert("Failed to place order");
  }
};

const handleDel = async (itemId) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return alert("User not logged in");

  console.log('itemId', itemId);
  console.log('userId', userId);
  try {
    const res = await axios.delete(`/api/card/${encodeURIComponent(userId)}/${encodeURIComponent(itemId)}`);
    if (res.data.success) {
      // Remove from local state
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item._id !== itemId),
      }));
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Could not delete item");
  }
};


    return(
        <>
        <Navbar />
        <div className="w-full max-w-[1200px] mt-6 mx-auto px-4">
        <div className="p-4 px-2">
          <h1 className="text-orange-500 font-bold text-2xl mb-3">My Cart</h1>
        </div>

        {/* Container flex stack on mobile, row on md+ */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cart Table Wrapper - full width on mobile, 2/3 on md */}
          <div className="w-full md:w-2/3 overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded-md">
              <thead className="text-center border-b border-gray-300 bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Product Details</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Subtotal</th>
                    <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {cart?.items?.length > 0 ? (
                  cart.items.map((curr, i) => (
                    <tr key={curr._id || i}
                      className="border-b border-gray-200 last:border-0">
                      <td className="p-3 flex items-center gap-3 max-w-[250px]">
                        <img src={curr.productId.imageUrl[0]} alt="img"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="truncate">{curr.productId.productName}</span>
                      </td>
                      <td className="p-3">${curr.productId.productPrice - curr.productId.productOffer}</td>
                    <td className="p-3">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => decreaseQuantity(i)}
                            className="px-2 py-1 border rounded hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="p-2 border border-gray-200 min-w-[30px] text-center">
                            {curr.quantity}
                          </span>
                          <button onClick={() => increaseQuantity(i)}
                            className="px-2 py-1 border rounded hover:bg-gray-200"> +
                          </button>
                        </div>
                      </td>
                      
                      <td className="p-3">${(curr.productId.productPrice - curr.productId.productOffer) * curr.quantity}</td>
                      <td className="p-3 text-sm">
                       <button  onClick={() => handleDel(curr._id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm 
                       cursor-pointer transition">Del</button>
                     </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-3">
                      No products in the cart.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Summary - full width on mobile, 1/3 on md */}
          <div className="w-full md:w-1/3 bg-white rounded-md shadow-2xl p-4 flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-lg mb-3">Order Summary</h2>
              <div className="flex flex-col gap-3">
                <label htmlFor="add" className="text-gray-600 font-semibold">Selected Address</label>
                <textarea id="add"
                  className="p-2 border border-gray-300 rounded resize-none outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Address" value={address}/>
                <button onClick={handleShowBtn}
                  className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition cursor-pointer">
                  Add Address
                </button>
              </div>

              <div className="border-t border-gray-300 mt-6 pt-4 space-y-3 font-semibold text-gray-700">
                <div className="flex justify-between">
                 <span>
                     Items ({cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0})
                 </span>
                   <span>
                     ${cart?.items?.reduce((acc, item) => acc + (item.productId.productPrice - item.productId.productOffer) * item.quantity, 0) || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping Fee</span>
                  <span className="text-gray-400">Free</span>
                </div>

                <div className="flex justify-between border-t border-gray-400 pt-3 font-bold text-lg">
                   <span>Total</span>
                   <span>
                     ${cart?.items?.reduce((acc, item) => acc + (item.productId.productPrice - item.productId.productOffer) * item.quantity, 0) || 0}
                  </span>
                
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 
            transition cursor-pointer" onClick={handlePlaceOrder}> 
              <div className="flex items-center gap-2 justify-center ">
                 {loader && (<div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>)} <span>Place Order</span>
              </div>
            </button>
          </div>
        </div>
      </div>

        {showForm && (
            <>
               <div className="fixed inset-0 z-50 flex justify-center items-center form " >
               <div className="p-2 px-6 bg-white shadow rounded-lg w-[90%] max-w-md">
                    <div className="p-4 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold"><span className="text-gray-500">Add Shipping</span> Adress</h1>
                        <IoMdClose size={28} className="cursor-pointer font-bold" onClick={() => setShowForm(!showForm)}/>
                    </div>
                    <div className="p-2">
                        <input type="text" className="w-full rounded-lg border border-gray-300 p-3 outline-none mb-3 " placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}/>

                        <input type="number" className="w-full rounded-lg border border-gray-300 p-3 outline-none mb-3 " placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)}/>

                        <input type="number" className="w-full rounded-lg border border-gray-300 p-3 outline-none mb-3 " placeholder="PostalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}/>

                         <textarea className="w-full rounded-lg border border-gray-300 p-3 outline-none mb-3 h-22" placeholder="Address (Area and Street)" value={address} onChange={(e) => setAddress(e.target.value)}/>

                         <div className="flex justify-between items-center gap-5 flex-col lg:flex-row md:flex-row">
                           <input type="text" className="w-full rounded-lg border border-gray-300 p-3 outline-none mb-3 " placeholder="City/District/Town" value={city} onChange={(e) => setCity(e.target.value)}/>

                           <input type="text" className="w-full rounded-lg border border-gray-300 p-3 outline-none mb-3 " placeholder="State" value={state} onChange={(e) => setState(e.target.value)}/>
                         </div>
                   
                          <button onClick={handleShipping}  className="w-full px-4 py-2 rounded cursor-pointer bg-orange-500 text-white ">
                            Save Adress</button>
                      
                    </div>
                </div>
             </div>
            </>
        )}
        </>
    )
}

export default MyCardPage;