const http = require("http");

const PORT = 8000;
const serverHandle = require("../app");

const server = http.createServer(serverHandle);

server.listen(PORT, (err) => {
  if (err) {
    return console.log("error", err);
  }
  console.log(`port: ${PORT}启动成功~`);
});
