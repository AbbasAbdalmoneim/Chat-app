 // backend/src/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // يمنع تكرار نفس الإيميل
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "", // صورة الحساب الافتراضية
    },
  },
  { timestamps: true } // يضيف تلقائياً حقول createdAt و updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;