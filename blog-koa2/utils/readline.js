const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { fileURLToPath } = require("url");

// 文件名
const fileName = path.join(__dirname, "../", "../", "logs", "access.log");
const readStream = fs.createReadStream(fileName);

const rl = readline.createInterface({
  input: readStream,
});

let chromNum = 0;
let num = 0;

// 逐行读取
rl.on("line", (lineData) => {
  if (!lineData) {
    return;
  }
  num++;
  const arr = lineData.split(" -- ");
  if (arr[2] && arr[2].indexOf("Chrom") > 0) {
    chromNum++;
  }
});

// 完毕
rl.on("close", () => {
  if (num == 0) {
    console.log(`Chrom 占比: 0`);
    return;
  }
  console.log(`Chrom 占比: ${chromNum / num}%`);
});
