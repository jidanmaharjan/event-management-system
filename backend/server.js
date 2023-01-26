const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");

const connectDb = require("./config/db");
//Config dot env variables
require("dotenv").config({ path: "backend/config/.env" });

const bodyParser = require("body-parser");

//allow postman and html forms to be parsed
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDb();

app.get("/v1", (req, res) => {
  res.status(200).send("Welcome to Eve");
});

mongoose.set("strictQuery", true);

//Routes imports
const auth = require("./routes/auth");
const category = require("./routes/category");
const event = require("./routes/event");

//Routes
app.use("/v1/auth", auth);
app.use("/v1/category", category);
app.use("/v1/event", event);

app.use(express.static(path.join(__dirname, "../frontend/build/")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server started on PORT : ${process.env.PORT || 5000} in ${
      process.env.NODE_ENV
    } mode.`
  );
});
