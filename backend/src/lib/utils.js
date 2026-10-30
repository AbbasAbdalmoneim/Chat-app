import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // السطر الأول: صناعة التوكن نفسه
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // السطر الثاني: وضعه داخل Cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    httpOnly: true,                  // حماية ضد XSS
    sameSite: "strict",              // حماية ضد CSRF
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};