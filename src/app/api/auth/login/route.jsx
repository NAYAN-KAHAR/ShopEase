import AuthModel from "../../../../models/authModel.js";
import connectDB from "../../../../lib/mongoose.js";
import jwt from 'jsonwebtoken';

export async function POST(request){
    const { email, role } = await request.json();
    try{
        await connectDB();
        if(!email || !role){
             return Response.json({ error: 'Invalid credentials' });
        }
        const existUser = await AuthModel.findOne({ email, role });
        if(!existUser){
            return Response.json({error:'User Not found'});
        };
         const token = jwt.sign({email:email},  process.env.JWT_SECRET, {
            expiresIn:'7d' // token valid for 7 days
        });
        return Response.json({message:'Login successfully', user:existUser});
    }catch(err){
       console.error(err);
       return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
};

