const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  let dataToSend;
  let largeDataSet = [];
  // spawn new child process to call the python script
  const python = spawn("python", ["script3.py"]);

  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    //dataToSend =  data;
    largeDataSet.push(data);
  });

  // in close event we are sure that stream is from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(largeDataSet.join(""));
  });
});

app.get("/2", (req, res) => {
  let dataToSend;

  const python = spawn("python", [
    "script2.py",
    "Shercosta ",
    "is learning Node + Python ",
    "for Tugas Akhir praypray",
  ]);

  python.stdout.on("data", (data) => {
    dataToSend = data;
  });

  python.on("close", (code) => {
    res.send(dataToSend.toString());
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

const scenario_1 = () => {
  keyAnswer =
    "To sumulate the behaviour of portions of the desired software product.";
  studentAnswer =
    "Simulating the behavior of only a portion of the desired software product.";
};

const scenario_2 = () => {
  keyAnswer =
    "To sumulate the behaviour of portions of the desired software product.";
  // studentAnswers = "//open CSV Files containing the answers"
};
