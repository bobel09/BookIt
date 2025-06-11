const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const { registerUser, getAllUsers, loginUser, checkUsername, getCurrentUser, patchUserPreferences, updateVisitedCountries, updateWishlist } = require("../controllers/UserController");

router.post("/",  registerUser); 
router.get("/", protect,getAllUsers);    
router.post("/login", loginUser);
router.get("/check-username", checkUsername);
router.get("/me", protect, getCurrentUser)
router.patch("/:id/preferences", protect, patchUserPreferences);
router.patch("/:id/visited-countries", protect, updateVisitedCountries);
router.patch("/:id/wishlist", protect, updateWishlist);
module.exports = router;
