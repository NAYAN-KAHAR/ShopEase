import connectDB from "@/lib/mongoose";
import Cart from "@/models/cardModel";
import { NextResponse } from "next/server";

import mongoose from "mongoose"; // add this

export async function DELETE(req, { params }) {
  const { userId, itemId } = params;
  await connectDB();

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } } }, // ✅ cast it!
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("Delete cart item failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
