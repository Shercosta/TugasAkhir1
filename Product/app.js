const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
var fs = require("fs");
const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");
// var csv = require("csv");
// const Papa = require("papaparse");
// const { log } = require("console");

const app = express();

app.set("views", [
  path.join(__dirname, "views"),
  // path.join(__dirname, "views/home/"),
  // path.join(__dirname, "views/help/"),
]);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));

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

  let Dataset = `keyAnswer,studentAnswer\n"${keyAnswer}","${answer}"`;

  let scoreLoad;

  // const config = {
  //   quotes: false, //or array of booleans
  //   quoteChar: '"',
  //   escapeChar: '"',
  //   delimiter: ",",
  //   header: true,
  //   newline: "\r\n",
  //   skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
  //   columns: null, //or array of strings
  // };

  // console.log(keyAnswer + " ---- " + answer);

  // let siesvi = Papa.unparse(Dataset);

  // csv.generate();

  fs.writeFileSync("dataset.csv", Dataset, "utf8");

  let options = {
    mode: "json",
    pythonOptions: ["-u"],
  };

  PythonShell.run("models/english/aprilModel.py", options)
    .then((messages) => {
      // console.log(messages);
      scoreLoad = messages;
    })
    .then(() => {
      // console.log(scoreLoad);

      res.render("result/singleResult", {
        language: language,
        keyAnswer: scoreLoad[0].keyAnswer["0"],
        answer: scoreLoad[0].studentAnswer["0"],
        score: (scoreLoad[0].scoreModelStem["0"] / 5) * 100,
      });
    });
});

app.post("/enb", (req, res) => {
  const keyAnswer = req.body.teacherAnswer;
  const studentNames = req.body.nameColumns;
  const answerColumns = req.body.answerColumns;
  const studentAnswers = JSON.parse(req.body.jsonAnswerColumns);
  const language = req.body.language;
  const dummyanswer = "negative";

  // res.send(studentAnswers);

  res.render("result/bulkResult", {
    language: language,
    keyAnswer: keyAnswer,
    // answer: dummyanswer,
  });
});

app.listen(1234, () => {
  console.log("Listening to http://localhost:1234");
});
