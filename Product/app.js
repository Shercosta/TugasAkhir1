const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/home/"),
]);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(1234, () => {
  console.log("Listening to http://localhost:1234");
});
