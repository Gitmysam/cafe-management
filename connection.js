const mongoose = require("mongoose");

//name of the db is attenta-backend
mongoose.connect(process.env.DATABASE_URL_MONGO);
const db = mongoose.connection;

//for error
db.on("error", console.error.bind(console, "ERROR CONNECTING TO DATABASE!!"));

//on success
db.once("open", () => {
  console.log("Conncted to Database :: MongoDB");
});

module.exports = db;
