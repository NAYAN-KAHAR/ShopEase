import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDesc: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productOffer: { type: Number, required: true },
  productCategory: { type: String, required: true },
  imageUrl: { type: [String], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default productModel;
