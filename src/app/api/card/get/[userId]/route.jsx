// import Cart from "../../../../../models/cardModel.js";
// import productModel from "../../../../../models/productModel.js";
// import connectDB from "../../../../../lib/mongoose.js";;
// import { NextResponse } from "next/server"; 
// import mongoose from 'mongoose';

// // post method for auth users
// export async function GET(request, { params }){
//     const { userId } = params;

//     if (!userId) {
//         return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }
//     try {
//         await connectDB();
//         const userObjectId = new mongoose.Types.ObjectId(userId);
//         console.log("🆔 Converted userId to ObjectId:", userObjectId);
//         const cart = await Cart.findOne({ userId: userObjectId }).populate("items.productId");
//         if (!cart) {
//             return NextResponse.json({ error: "Cart not found for this user" }, { status: 404 });
//         }
//         return NextResponse.json({ message: "Cart fetched successfully", cart }, { status: 200 });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
//     }
// }

import Cart from "../../../../../models/cardModel.js";
import productModel from "../../../../../models/productModel.js";
import connectDB from "../../../../../lib/mongoose.js";
import { NextResponse } from "next/server"; 
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await connectDB();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("🆔 Converted userId to ObjectId:", userObjectId);

    const cart = await Cart.findOne({ userId: userObjectId }).populate("items.productId");

    if (!cart) {
      return NextResponse.json({ error: "Cart not found for this user" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cart fetched successfully", cart }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}
