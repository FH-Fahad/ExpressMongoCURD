const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fname: {
        type: String,
        require: true,
    },
    lname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    userType: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ["Active", "Away"]
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("User", UserSchema);