import productModel from "../../../../../models/productModel.js";
import connectDB from "../../../../../lib/mongoose.js";


export async function GET(request, { params }) {
    const { productId } = params;
    console.log('productId:', productId);

    try {
        await connectDB();
        if (!productId) {
            return Response.json({ error: 'productId is required' }, { status: 400 });
        }

        const products = await productModel.find({ _id: productId });
        return Response.json({ message: products }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}


