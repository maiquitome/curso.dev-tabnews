const { execSync, spawn } = require("node:child_process");

async function cleanUp() {
  process.stdout.write("Wrapping script...");

  spawn("npm", ["run", "wrap:dev"], {
    killSignal: "SIGINT",
    stdio: "inherit",
  });

  process.on("SIGINT", () => {
    process.stdout.write("\nCleaning up 🧹...");
    execSync("npm run services:stop");
  });
}

cleanUp();
