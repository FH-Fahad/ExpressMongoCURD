const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();

const userRoute = require("./Routes/User.Route")
const pagination = require("./Routes/Pagination.Route");
const DBConnection = require("./Database/DBConnection");

DBConnection();

app.use(express.json());
app.use("/", pagination);
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})
