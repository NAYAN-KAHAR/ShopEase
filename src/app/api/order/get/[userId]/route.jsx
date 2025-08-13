import Order from "@/models/orderModel.js";
// import connectDB from "../../../../lib/mongoose.js";
import connectDB from "@/lib/mongoose.js";
import { NextResponse } from "next/server"; 
import mongoose from 'mongoose';

// POST: Create a new order
export async function GET(request, { params }) {
    const { userId } = params;
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    if(!objectId) return NextResponse.json({error:'userId is required'});
    const orders = await Order.find({userId:objectId }).populate("items.productId");
    return NextResponse.json({ success: true, orders }, { status: 201 });

  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}

