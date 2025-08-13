import Cart from "../../../../models/cardModel.js";
import connectDB from "../../../../lib/mongoose.js";;
import { NextResponse } from "next/server"; 
import mongoose from 'mongoose';

// post method for auth users
export async function POST(request){
    const { userId, productId, quantity } = await request.json();
    try{
       if(!userId || !productId || !quantity){
          return NextResponse.json({ error: 'All credentials are required' }, { status: 400 });
       }
    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId: userObjectId });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        userId: userObjectId,
        items: [{ productId: productObjectId, quantity }]
      });
    } else {
      // Find if the product already exists in cart
      const existingItem = cart.items.find(item =>
        item.productId.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;   // If it exists, update quantity
      } else {
        cart.items.push({ productId: productObjectId, quantity }); // Otherwise, add new item
      }
      await cart.save();
    }
        return NextResponse.json({ message: 'Product added/updated in cart', data: cart }, { status: 201 });

    }catch(err){
        console.log(err);
         return NextResponse.json({ error: 'Something went wrong', details: err.message }, { status: 500 });
    }
}


