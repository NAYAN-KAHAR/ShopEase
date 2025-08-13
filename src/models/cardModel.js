import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
    items:[
        {
             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
             quantity: { type: Number, default: 1 },
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);