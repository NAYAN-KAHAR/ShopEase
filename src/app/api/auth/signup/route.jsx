import AuthModel from "../../../../models/authModel.js";
import connectDB from "../../../../lib/mongoose.js";
import bcrypt from 'bcrypt';

export async function GET(req,res){
    try{
        await connectDB();
        console.log('Database connected');
        return res.json({message:'DB connected successfully'});
    }catch(err){
        console.log('error', err);
    }
};

// post method for auth users
export async function POST(request){
    const { name, email, password, role} = await request.json();
    try{
       await connectDB();
       const userAlreadyExits = await AuthModel.findOne({email});
       if(userAlreadyExits){
        return Response.json({message:'user Already exits'});
       } 
       const hashPassword = await bcrypt.hash(password,10);

       // Default to 'user' if not provided
       const newUser = new AuthModel({ name, email, password:hashPassword, role: role || 'user' });
       await newUser.save();
       return Response.json({ message:'user created successfully', newUser});
    }catch(err){
        console.log(err);
         return Response.json({ error: 'Something went wrong', details: err.message }, { status: 500 });
    }
}