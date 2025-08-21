import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  try {                                                        
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {

      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong password" });
    }

    const JWT_KEY = process.env.JWT_KEY || "default_jwt_secret_key_for_development";
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const register = async (req,res)=>{
  const { name, email, password, role } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
  }
  try{
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    const JWT_KEY = process.env.JWT_KEY || "default_jwt_secret_key_for_development";
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      JWT_KEY,
      { expiresIn: "10d" }
    );
    res.status(201).json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const verify = (req,res) =>{
  return res.status(200).json({success:true, User:req.user})
}

export { login, register, verify };
