import mongoose from "mongoose";


const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent model overwrite in development (important for Next.js hot reload)
const AuthModel = mongoose.models.AuthUsers || mongoose.model("AuthUsers", authSchema);

export default AuthModel;
