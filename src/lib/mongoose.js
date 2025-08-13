
import mongoose from 'mongoose'
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yar3p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=MY-DATABASE`;

if(!url) throw new Error('Add mongoDB Url to evn local file');

// // Use global cache to prevent multiple connections in dev mode
// let cached = global.mongoose || { conn: null, promise: null};

// // global.mongoose helps cache the database connection between hot reloads in development.
// // conn -> the actual MongoDB connection
// // promise: the promise returned while connecting

// const connectDB = async () => {

//        if(cached.conn) return cached.conn; // reuse connected
//        if(!cached.promise){
//          cached.promise = mongoose.connect(url); // If there’s no on-going connection, start connecting and store the promise.
//        }
//         try {
//           cached.conn = await cached.promise;
//           console.log('✅ MongoDB connected successfully');
//           return cached.conn;
//         } catch (err) {
//             console.error('MongoDB connection error:', err);
           
//          }

// };

// // Stores the cached connection in global.mongoose so that hot reloads in development don’t create multiple connections.
// // Hot reloading is when your app updates automatically after you change the code — without a full refresh or restart. It’s great for speed, but you need to handle things like database connections carefully.

// if (typeof global !== 'undefined') {
//     global.mongoose = cached;
// }

let cached = global.mongoose || {conn: null, promise:null};

const connectDB = async () => {
  if(cached.conn) return cached.conn;
  if(!cached.conn){
    cached.promise = mongoose.connect(url);
  }
  try{
      cached.conn = await cached.promise;
      console.log('✅ MongoDB connected successfully');
      return cached.conn;
  }catch(err){
     console.error('MongoDB connection error:', err);
  }
}

if(typeof global !== 'undefined'){
  global.mongoose = cached;
}
export default connectDB;