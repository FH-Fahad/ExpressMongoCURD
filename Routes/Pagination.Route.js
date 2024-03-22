const express = require("express");
const router = express.Router();

const User = require("../Database/User.Schema");

// Pagination with query parameter
router.get("/page", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 3;

        const paginationResult = await paginateUsers(page, limit);

        res.status(200).json(paginationResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Pagination with routes parameter
router.get("/page/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const limit = 3;

        const paginationResult = await paginateUsers(id, limit);

        res.status(200).json(paginationResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function paginateUsers(page, limit) {
    page = parseInt(page) || 1;
    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    try {
        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        if (page > totalPages) {
            throw new Error("Requested page does not exist");
        }

        return {
            totalPages,
            currentPage: `${page}`,
            users
        };
    } catch (err) {
        throw new Error(err.message);
    }
}


module.exports = router;