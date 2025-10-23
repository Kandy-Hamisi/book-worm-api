import User from "../models/User.models.js";
import jwt from "jsonwebtoken";
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
export const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        //     check if the fields are not empty
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        //     check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        //     check if the password is strong
        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password must be at least 8 characters long" });
        }
        //     check if the username is less than 3 characters
        if (username.length < 3) {
            return res
                .status(400)
                .json({ message: "Username must be at least 3 characters long" });
        }
        // get random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&radius=50&backgroundColor=random&size=100`;
        // create a new user
        const newUser = new User({ email, username, password, profileImage });
        await newUser.save();
        // generate token
        const token = generateToken(newUser._id);
        // send the token back to the client
        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
            },
            message: "User registered successfully",
        });
    }
    catch (e) {
        console.log("Error in registerUser: ", e);
        return res.status(400).json({ message: "Internal Server Error" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        //   check if user exists
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        //   check if the password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //   generate token
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: "Login successful",
        });
    }
    catch (e) {
        console.log("Error in loginUser: ", e);
        return res.status(400).json({ message: "Internal Server Error" });
    }
};
//# sourceMappingURL=user.controller.js.map