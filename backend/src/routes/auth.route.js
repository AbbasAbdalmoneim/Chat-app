import express from "express"
import { signup,login,logout, updateProfile, checkAuth } from "../controller/auth.controller.js"
import { protectRoute } from "../middleware/auth.middlewere.js"
const router = express.Router()

router.post("/signup" , signup)

router.post("/login" , login)

router.post("/logout" , logout)

router.post("/updateProfile", protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth)

export default router