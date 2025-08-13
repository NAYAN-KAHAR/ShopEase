import productModel from "../../../../models/productModel.js";
import connectDB from "../../../../lib/mongoose.js";


export async function GET(request) {
    try {
        await connectDB();
        const products = await productModel.find();
        return Response.json({ message: products }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}