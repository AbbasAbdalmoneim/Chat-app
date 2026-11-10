import User from "../models/user.model.js";
import bcrypt, { truncates } from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { protectRoute } from "../middleware/auth.middlewere.js";
import cloudinary from "../lib/cloudinary.js"

// 1. تسجيل مستخدم جديد
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // التأكد من وصول جميع الحقول
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // التأكد من طول كلمة المرور
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // التأكد من عدم تكرار البريد الإلكتروني
    const checkUserExist = await User.findOne({ email });
    if (checkUserExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // تجهيز كائن المستخدم
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    (generateToken(user._id, res),
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      }));
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.status(200).json({ message: " Logged out successfully " });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req,res) => {
  try {
    res.status(200).json(req.user)

  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
