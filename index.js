const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();

const userController = require("./Controllers/User.Controller")
const paginationController = require("./Controllers/Pagination.Controller");
const DBConnection = require("./Models/DBConnection");

DBConnection();

app.use(express.json());
app.use("/", paginationController);
app.use("/", userController);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
