import connectDB from "@/lib/mongoose";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();
  const { orderId, itemId } = params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: deletedOrder });
  } catch (error) {
    console.error("Cancel item failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/*
// File: src/app/api/order/delete/[orderId]/route.js
import connectDB from "@/lib/mongoose";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { orderId } = params;

  await connectDB();

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


const handleDeleteOrder = async (orderId) => {
  try {
    const res = await axios.delete(`/api/order/delete/${orderId}`);
    if (res.data.success) {
      alert("Order deleted");
      // Optionally refresh list of orders
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } else {
      alert("Failed to delete order");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Error deleting order");
  }
};

*/