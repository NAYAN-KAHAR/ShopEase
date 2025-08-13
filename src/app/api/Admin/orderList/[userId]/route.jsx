import mongoose from 'mongoose';
import orderModel from '../../../../../models/orderModel.js';
import connectDB from '../../../../../lib/mongoose.js';

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ error: 'Invalid adminId format' }, { status: 400 });
    }

    // Fetch all orders, populate product info in items
    const orders = await orderModel.find().populate('items.productId');

    // Filter orders that include at least one product owned by this admin
    const adminOrders = orders.filter(order =>
      order.items.some(item => {
        const product = item.productId;
        return product?.user?.toString() === userId;
      })
    );

    return Response.json({ message: adminOrders }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
