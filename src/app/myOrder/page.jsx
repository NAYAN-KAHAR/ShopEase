'use client';
import Navbar from "@/components/navbar"
import axios from "axios";
import { useEffect, useState } from "react";


const MyOrder = () => {
  const[myOrder, setMyOrder] = useState([]);
 
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if(!userId) return console.log('required userId');
    const getAllOrders = async () => {
     try{
        const res = await axios.get(`/api/order/get/${userId}`);
        console.log(res.data.orders);
        setMyOrder(res.data.orders);
     }catch(err){
       console.log(err);
     }
  }
   getAllOrders();
  },[]);

const handleCancel = async (orderId, itemId) => {
  try {
    const res = await axios.delete(`/api/order/${orderId}/cancelItem/${itemId}`);
    if (res.data.success) {
      alert("Item canceled successfully");

      // Remove item from UI
      setMyOrder((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, items: order.items.filter((item) => item._id !== itemId) }
            : order
        ).filter((order) => order.items.length > 0) // remove orders with no items left
      );
    }
  } catch (err) {
    console.error("Cancel failed:", err);
    alert("Failed to cancel item");
  }
};


    return(
        <>
        <Navbar />
        <div className="h-full w-[80%] mx-auto">
  <div className="p-4">
    <h1 className="text-left mt-5 text-2xl font-bold">My Order</h1>
  </div>

  {/* Scrollable table container for small screens */}
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead className="bg-gray-100 text-center">
        <tr>
          <th className="p-3  text-sm font-medium text-gray-700"># No</th>
          <th className="p-3  text-sm font-medium text-gray-700">Product</th>
          <th className="p-3  text-sm font-medium text-gray-700">Quantity</th>
          <th className="p-3 text-sm font-medium text-gray-700">Price</th>
          <th className="p-3  text-sm font-medium text-gray-700">Address</th>
          <th className="p-3  text-sm font-medium text-gray-700">Date</th>
          <th className="p-3  text-sm font-medium text-gray-700">Action</th>
        </tr>
      </thead>
     <tbody>
  {myOrder.length > 0 ?
    myOrder.map((order, orderIndex) =>
      order.items.map((item, itemIndex) => (
        <tr key={item._id} className="text-center">
          <td className="p-3 text-sm">{orderIndex + 1}.{itemIndex + 1}</td>
          <td className="p-3 flex items-center gap-3 max-w-[250px]">
            <img
              src={item.productId.imageUrl?.[0] || "/placeholder.jpg"}
              alt="Product"
              className="w-12 h-12 object-cover rounded"
            />
            <span className="truncate">{item.productId.productName}</span>
          </td>
          <td className="p-3 text-sm">{item.quantity}</td>
          <td className="p-3 text-sm">₹{item.productId.productPrice - item.productId.productOffer}
           </td>
          <td className="truncate p-3 text-sm ">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </td>
          <td className="truncate p-3 text-sm ">
            {new Date(order.createdAt).toLocaleDateString()}
          </td>
          <td className="p-3 text-sm">
           <button onClick={() => handleCancel(order._id, item._id)}
             className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer transition"
             > Cancel</button>
          </td>
        </tr>
      ))
    ):  <tr>
          <td colSpan="4" className="text-center p-3">
             No products in the cart.</td>
            </tr>
    }
</tbody>

    </table>
  </div>
</div>

        </>
    )
}

export default MyOrder