const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-type", "applicetion/json");
  res.end(
    JSON.stringify({
      errno: 0,
      msg: "pm2 test server",
    })
  );
});

const port = 8099;
server.listen(port, (err) => {
  console.log(`port: ${port}`);
});
