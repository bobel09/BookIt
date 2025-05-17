const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExistsEmail = await User.findOne({ email });
    if (userExistsEmail) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userExistsUsername = await User.findOne({
      username,
    });
    if (userExistsUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ username, email, password});
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password, rememberMe} = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (rememberMe) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET
      );
     res.json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          preferences: user.preferences
        }
      });
    }
    else {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          preferences: user.preferences
        }
      });
    }
   
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.json({ available: false });
    }

    res.json({ available: true });
  } catch (err) {
    console.error("Error checking username:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const patchUserPreferences = async (req, res) => {
  const userId = req.params.id;
  const { preferences } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating preferences:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const updateVisitedCountries = async (req, res) => {
  const userId = req.params.id;
  const { visitedCountries } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { visitedCountries },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating visited countries:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  checkUsername,
  getCurrentUser,
  patchUserPreferences,
  updateVisitedCountries
};
