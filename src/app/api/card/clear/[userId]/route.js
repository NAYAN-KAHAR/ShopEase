import connectDB from "@/lib/mongoose";
import Cart from "@/models/cardModel";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();
  const { userId } = params;
  try {
      const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    return NextResponse.json({ success: true, message: "Cart cleared" });
    
  } catch (error) {
    console.error("Cancel item failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}