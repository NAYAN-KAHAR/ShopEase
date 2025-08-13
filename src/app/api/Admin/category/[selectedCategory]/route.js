import productModel from "../../../../../models/productModel.js";
import connectDB from "../../../../../lib/mongoose.js";


export async function GET(request, { params }) {
    const { selectedCategory } = params;
    console.log('selectedCategory', selectedCategory)
    try {
        await connectDB();
        if(!selectedCategory) return Response.json({error:'Category is required'});
        const products = await productModel.find({productCategory:selectedCategory});
        return Response.json({ message: products }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}