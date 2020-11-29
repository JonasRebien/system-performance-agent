const os = require("os");
const Shell = require("node-powershell");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true,
});

http = require("http");
var port = 8585;

http
  .createServer(async function (req, res) {
    res.writeHeader(200, { "Content-Type": "application/json" });
    switch (req.url) {
      case "/system":
        console.log("New incoming client request for " + req.url);
        res.write(osInfo());
        break;
      case "/cpu":
        console.log("New incoming client request for " + req.url);
        let cpu_output = await cpuInfo();
        res.write(cpu_output);
        break;
      case "/service":
        console.log("New incoming client request for " + req.url);
        let service_output = await servicesInfo();
        res.write(service_output);
        break;
      case "/process":
        console.log("New incoming client request for " + req.url);
        let process_output = await processInfo();
        res.write(process_output);
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
    cpu: os.cpus()[0].model,
  };
  var output = JSON.stringify(obj);
  return output;
}

async function servicesInfo() {
  ps.addCommand("Get-Service | Where-Object {$_.Status -eq 'Running'}");
  let result;
  try {
    result = await ps.invoke();
  } catch {
    // do nothing
  }
  return result;
}

async function cpuInfo() {
  ps.addCommand(
    "Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select Average"
  );
  let result;
  try {
    result = await ps.invoke();
  } catch {
    // do nothing
  }
  return result;
}

async function processInfo() {
  ps.addCommand(
    "Get-Process"
  );
  let result;
  try {
    result = await ps.invoke();
  } catch {
    // do nothing
  }
  return result;
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
