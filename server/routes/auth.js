const express=require("express");
const userRouter=express.Router();

const {auth}=require("../middleware/authMiddleware");
const {signUp,loginByGoogle,login,updateProfile,checkAuth} =require("../controllers/UserController")


userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.post("/googlelogin",loginByGoogle);
userRouter.put("/update-profile",auth,updateProfile);
userRouter.get("/check",auth,checkAuth);

module.exports=userRouter;