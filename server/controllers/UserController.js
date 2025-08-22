const bcrypt = require("bcrypt");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { generateToken } = require("../utils/generateToken");
const client = require("../config/googleLoginConfig")


exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, bio } = req.body;
    const file = req.files?.profilePic;

    if (!firstName || !lastName || !email || !password  ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
    if (file) {
      const uploadResult = await uploadImageToCloudinary(file, "ChatApp");
      profilePicUrl = uploadResult.secure_url || uploadResult.public_id;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      bio:bio ?? "",
      provider:"local",
      profilePic: profilePicUrl,
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong while sign up" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    user.password = undefined;
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      user: user,
      token
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "something went wrong in the login" });
  }
};

exports.loginByGoogle = async (req, res) => {

  try {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "Code is required" });

    console.log("CODE RECEIVED ONT EH BACKEND ", code)

    // get tokens from google in exchage for code recieved from frontend
    const { tokens } = await client.getToken(code);

    //   VerifyClient by ID token (to get user info)
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // now get the payload conataing the user details

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

 
    // check for the user with the email 
    // if present then loing and return the jwt toekn 
    // else ccreate the user and then create jwt token 
    // and return response
    let user = await User.findOne({
      email: email,

    });

    if (!user) {
      // create the user 

      const firstName = name?.split(" ")[0] || "";
      const lastName = name?.split(" ")[1] || "";
      let profilePicUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
      user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePic: profilePicUrl || null,
        provider: "google",
      })
    }

    else {
      //user is present 
      if (user.provider !== "google") {
        // Means user signed up with password earlier
        return res.status(400).json({
          success: false,
          message:
            "Email already registered with password. Please login with email & password instead.",
        });
      }

    }

    const token = generateToken(user?._id);

    // Set cookie  
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: user,
      token
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }


}
exports.checkAuth = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  })
}

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // req.user._id
    const { firstName, lastName, bio } = req.body;
    const profilePic = req?.files?.profilePic;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio) updateData.bio = bio;
    //if (email) updateData.email = email; // Optional: Add verification flow

    if (profilePic) {
      const imageResponse = await uploadImageToCloudinary(profilePic, "ChatApp");
      updateData.profilePic = imageResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
