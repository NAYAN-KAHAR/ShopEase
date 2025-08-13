import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true } // save price to avoid price changes affecting past orders
    }
  ],
  shippingAddress: {
    name:String,
    phone:String,
    postalCode: String,
    address:String,
    city: String,
    state: String,
  },
  totalPrice: Number,
  paymentInfo: {
    method: String,
    status: String
  },
  createdAt: { type: Date, default: Date.now },
});

const orderModel =  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel






/*
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true } // save price to avoid price changes affecting past orders
    }
  ],
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  status: {
    type: String,
    enum: ['pending', 'porcessing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
  paymentInfo: {
    method: String,
    status: String,
    transactionId: String,
  }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
*/