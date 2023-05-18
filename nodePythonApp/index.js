const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 3000;
// import path from "path";
const { PythonShell } = require("python-shell");

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

app.get("/testModel", (req, res) => {
  let received = 4;

  const pie = spawn("python", [
    "model/spell.py",
    "1. Selalu lindungi rambutmu dari sinar matahari, angin dan hujan 2. Setelah keramas jangan langsung menyisir, tunggu beberapa saat sampai rambut agak kering 3. Gunakan kondisioner setelah keramas. Kondisioner dapat membantu agar rambutmu semakin lurus 4. Lakukan conditioning dengan benar. 5. Pilih sampo dan kondisioner dari jenis yang sama karena memiliki formulasi yang sama. 6. Hindari penggunaan hair dryer pada rambut. 7. Hindari menggunakan ikat rambut yang super ketat. 8. Ketika tidur di malam hari, biarkan rambut tergerai pada satu sisi untuk menghindari kekusutan rambut. 9. Tidur menggunakan bantal yang terbuat dari satin. 10. Ketika mengeringkan rambut, lakukan dengan cara ditekan. 11. Gunakan masker rambut yang cocok untuk rambut. 12. Gunakan air dingin untuk keramas. 13. Makan yang benar. Nutrisi tertentu seperti vitamin, zat besi dan protein sangat penting untuk pertumbuhan rambut dan kesehatan.",
  ]);

  pie.stdout.on("data", (data) => {
    received = data;
  });

  pie.on("close", (code) => {
    // res.send(received.toString());
    console.log(received);
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

app.get("/deco", (req, res) => {
  const text1 =
    "Otak merupakan bagian terpenting dari tubuh manusia. Segala aktivitas akan dikoordinasikan dengan otak sebelum dijalankan oleh bagian tubuh. Pikiran positif akan menghindarkan anda dari stres, meningkatkan rasa percaya diri serta menjaga kinerja organ tubuh lainnya tetap maksimal.";
  const text2 =
    "secara psikologi berfikir positif mampu meningkatkan kepercayaan diri yang akan berakibat baik pada sistem kekebalan tubuh. sehingga pola hidup sehat akan terjaga karena fikiran yang selalu positif dan tidak cenderung pada suatu hal negatif. ";

  let deco = 0;

  const deka = spawn("python", ["tocode.py", text1, text2]);

  // deka.stdout.on("data", (data) => {
  //   deco = data;
  // });

  // deka.on("close", (code) => {
  //   console.log(deco);
  //   res.send(deco);
  // });

  res.send("Check JSON");
});

app.get("/deka", (req, res) => {
  let def = 0;

  const deka = spawn("python", ["script1.py", 10, 12]);

  deka.stdout.on("data", (data) => {
    def = data;
  });

  deka.on("close", (code) => {
    console.log(def);
    res.send(def);
  });
});

app.get("/april", (req, res) => {
  // const enmodel = spawn("python", ["EnModel/aprilModel.py"]);

  // let printout = "max";

  // enmodel.stdout.on("data", (data) => {
  //   printout = data;
  // });

  // enmodel.on("exit", (code) => {
  //   res.send(printout);
  // });

  let options = {
    mode: "text",
    // pythonPath: "EnModel/aprilModel.py",
    pythonOptions: ["-u"], //get print result in real time
    // scriptPath: "EnModel/aprilModel.py",
  };

  PythonShell.run("EnModel/aprilModel.py", options).then((messages) => {
    // console.log("finished");
    console.log(messages);
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
