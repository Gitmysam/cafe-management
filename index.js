require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./connection");
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "Wel come ",
  });
});

app.use("/user", require("./routes/user"));

app.listen(port, (err) => {
  if (err) {
    console.log("Server connection error");
  } else {
    console.log(`Server is connected :${port}`);
  }
});
