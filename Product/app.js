const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { log } = require("console");

const app = express();

app.set("views", [
  path.join(__dirname, "views"),
  // path.join(__dirname, "views/home/"),
  // path.join(__dirname, "views/help/"),
]);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home/home");
});

app.get("/help", (req, res) => {
  res.render("help/help");
});

app.route("/option").post((req, res) => {
  const obj = {
    language: req.body.language,
    select: req.body.select,
  };
  if (obj.language === "Indonesia") {
    if (obj.select === "single") {
      res.render("indonesia/single", { language: obj.language });
    } else {
      res.render("indonesia/bulk");
    }
  } else if (obj.language === "Inggris") {
    if (obj.select === "single") {
      res.render("inggris/single");
    } else {
      res.render("inggris/bulk");
    }
  } else {
    res.redirect("/");
  }
});

app.post("/ids", (req, res) => {
  const keyAnswer = req.body.teacherAnswer;
  const answer = req.body.studentAnswer;
  const language = req.body.language;

  // console.log(keyAnswer + " ---- " + answer);

  res.render("result/singleResult", {
    language: language,
    keyAnswer: keyAnswer,
    answer: answer,
  });
});

app.post("/ens", (req, res) => {
  const keyAnswer = req.body.teacherAnswer;
  const answer = req.body.studentAnswer;
  const language = req.body.language;

  // console.log(keyAnswer + " ---- " + answer);

  res.render("result/singleResult", {
    language: language,
    keyAnswer: keyAnswer,
    answer: answer,
  });
});

app.listen(1234, () => {
  console.log("Listening to http://localhost:1234");
});
