const express = require("express");
const { spawn } = require("child_process");
const app = express();

app.get("/", (req, res) => {
  var largeDataSet = [];
  // spawn new child process to call the python script
  const python = spawn("python", ["script3.py"]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    largeDataSet.push(data);
  });
  // in close event we are sure that stream is from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(largeDataSet.join("-"));
  });
});

// app.get("/", (req, res) => {
//   var dataToSend;
//   // spawn new child process to call the python script
//   const python = spawn("python", [
//     "script2.py",
//     " Shercosta",
//     " Experimenting with NodeJS Web App and Python",
//     " For TA Purposes",
//   ]);
//   // collect data from script
//   python.stdout.on("data", function (data) {
//     console.log("Pipe data from python script ...");
//     dataToSend = data.toString();
//   });
//   // in close event we are sure that stream from child process is closed
//   python.on("close", (code) => {
//     console.log(`child process close all stdio with code ${code}`);
//     // send data to browser
//     res.send(dataToSend);
//   });
// });

app.listen(3000, () =>
  console.log(`Example app listening on port 
3000! http://localhost:3000`)
);
