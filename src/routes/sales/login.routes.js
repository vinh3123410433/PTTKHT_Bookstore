import express from "express";
import { checkUser } from "../models/user.models.js";

const router = express.Router();

// kiểm tra đăng nhập
router.get("/login", (req, res) => {
  // lấy thông tin từ form
  const { userName, Password } = req.body;

  // Kiều kiện ở đâu
  const user = checkUser(userName, Password);
  if (!user) {
    res.send("Sai thông tin đăng nhập");
    return;
  }

  res.send("Login page");
});

export default router;
