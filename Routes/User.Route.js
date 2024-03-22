const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../Database/User.Schema");

router.post("/", async (req, res) => {
    const { fname, lname, email, phone, password, userType, status } = req.body;

    try {
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
            status,
        });

        const savedUser = await user.save();

        const responseUser = await User.findById(savedUser._id);

        res.json({ message: "User added", responseUser })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/", async (req, res) => {
    try {
        const allUser = await User.find();

        const totalUser = allUser.length;

        res.status(200).json({ message: "All user", totalUser, allUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get("/:id", isUser, async (req, res) => {
    res.json(res.user);
})

router.delete("/:id", isUser, async (req, res) => {
    try {
        await res.user.deleteOne();
        res.status(200).json({ message: "User deleted" })
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

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
        res.user.status = req.body.status;
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

router.get("/page/:id", async (req, res) => {
    let page = parseInt(req.params.id);
    if (page < 1) page = 1;

    let limit = 3;
    let skip = (page - 1) * limit;

    try {
        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();

        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            totalPages,
            message: `Showing users for page ${page}`,
            users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

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