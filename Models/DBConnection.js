const mongoose = require("mongoose")

const DBConnection = async () => {
const URI = process.env.DB;
    try {
        await mongoose.connect(URI);
        console.log("Database connection successful.");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

module.exports = DBConnection;