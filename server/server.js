const express = require("express");
const dotenv = require("dotenv").config();
const { ConnectDb } = require("./config/dbconnection");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

ConnectDb();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authenticationRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});