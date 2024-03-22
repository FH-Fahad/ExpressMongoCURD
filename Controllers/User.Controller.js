const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../Models/User.Schema");

// Create a user
router.post("/", async (req, res) => {
    const { fname, lname, email, phone, password, userType, status } = req.body;

    try {
        const userStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        if (!["Active", "Away"].includes(userStatus)) {
            return res.status(400).json({ error: "Invalid status value. Choose from Active and Away" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" })
        }
        let hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fname,
            lname,
            email,
            phone,
            password: hashedPassword,
            userType,
            status: userStatus,
        });

        const savedUser = await user.save();

        const responseUser = await User.findById(savedUser._id);

        res.json({ message: "User added", responseUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get all user
router.get("/", async (req, res) => {
    try {
        const allUser = await User.find();

        const totalUser = allUser.length;
        const away = await User.countDocuments({ status: "Away" })
        const active = await User.countDocuments({ status: "Active" })

        res.status(200).json({ message: "All user", totalUser, away, active, allUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Get a specific user
router.get("/:id", isUser, async (req, res) => {
    res.json(res.user);
})

// Delete a user
router.delete("/:id", isUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        res.status(200).json({ message: "User deleted" })
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

// Update a user
router.patch("/:id", isUser, async (req, res) => {
    if (req.body.email != null) {
        return res.status(404).json({ message: "Email cannot be updated" })
    }
    if (req.body.fname != null) {
        res.user.fname = req.body.fname;
    }
    if (req.body.lname != null) {
        res.user.lname = req.body.lname;
    }
    if (req.body.phone != null) {
        res.user.phone = req.body.phone;
    }
    if (req.body.userType != null) {
        res.user.userType = req.body.userType;
    }
    if (req.body.status != null) {
        const userStatus = req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1).toLowerCase();

        if (!["Active", "Away"].includes(userStatus)) {
            return res.status(400).json({ error: "Invalid status value. Choose from Active and Away" });
        }
        res.user.status = userStatus;
    }
    if (req.body.password != null) {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        res.user.password = hashedPassword;
    }
    try {
        const updatedUser = await res.user.save();
        res.status(201).json({ message: "User info updated", updatedUser })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

// Middleware function to get the correct user
async function isUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);

        if (user == null) {
            return res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user;
    next();
}

module.exports = router;