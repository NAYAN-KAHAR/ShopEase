import Order from "../../../../models/orderModel.js";
import connectDB from "../../../../lib/mongoose.js";;
import { NextResponse } from "next/server"; 
import mongoose from 'mongoose';

// POST: Create a new order
export async function POST(request) {
  try {
    const { userId, cartItems, shippingAddress, totalPrice } = await request.json();
    if (!userId || !cartItems || cartItems.length === 0 || !shippingAddress || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await connectDB();
    // Format items with priceAtPurchase
    const items = cartItems.map((item) => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
    }));
    const paymentInfo =  {
    method: 'COD',
    status: 'Pending',
  }
    const order = await Order.create({userId,items,shippingAddress,totalPrice,paymentInfo});
    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
