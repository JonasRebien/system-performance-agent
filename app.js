var os = require("os");
const winos = require("loadavg-windows");

winos.enableCustomLoadavg();

http = require("http");
var port = 8585;

http
  .createServer(function (req, res) {
    res.writeHeader(200, { "Content-Type": "application/json" });
    switch (req.url) {
      case "/system":
        console.log('New incoming client request for ' + req.url)
        res.write(osInfo());
        break;
      default:
        res.write('{"hello" : "world"}');
    }
    res.end();
  })
  .listen(port);
console.log("Server listening on http://localhost:" + port);

function osInfo() {
  var obj = {
    totalMemory_mb: os.totalmem() / 1024 / 1024,
    freeMemory_mb: os.freemem() / 1024 / 1024,
    memUsages_percentage: (os.freemem() * 100) / os.totalmem(),
    uptime: os.uptime(),
    platform: os.platform(),
    architecture: os.arch(),
    cpu: os.cpus()[0].model,
    nr_of_cpu_logical_core: os.cpus().length,
    load_avg: os.loadavg(),
  };
  var output = JSON.stringify(obj);
  return output;
}

function exit(err) {
  if (err) console.log("An error occurred: " + err);
  process.exit();
}
process.on("SIGINT", exit);

process.on("SIGINT", () => {
  clearInterval(interval);
  process.exit();
});
