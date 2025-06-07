const mongoose = require("mongoose");
const express = require("express");
const { db } = require("./models/nicotine.model");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  })
);
app.use(express.json({ extended: true }));
app.use("/api/nicotine", require("./routes/nicotine"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const start = async () => {
  try {
    await mongoose.connect(process.env.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(process.env.PORT, () => {
      console.log("bob");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
start();
