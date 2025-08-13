import productModel from "../../../../../models/productModel.js";
import connectDB from "../../../../../lib/mongoose.js";


export async function GET(request, { params }) {
    const { userId } = params;
    console.log('userID:', userId);

    try {
        await connectDB();
        if (!userId) {
            return Response.json({ error: 'userId is required' }, { status: 400 });
        }

        // Parse query params for pagination
         const url = new URL(request.url);
         const page = parseInt(url.searchParams.get('page')) || 1;
         const limit = parseInt(url.searchParams.get('limit')) || 6;
         const skip = (page - 1) * limit;

      const products = await productModel.find({ user: userId }).skip(skip).limit(limit);
      return Response.json({ message: products }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/*
If using Query Params (e.g. /api/Admin/productList?userId=123)
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
*/