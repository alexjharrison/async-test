const fs = require("fs-extra");
const { exec } = require("child_process");

(async () => {
  const execShellCommand = cmd => {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error || stderr);
        }
        resolve(stdout);
      });
    });
  };

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  const cmds = [
    () => fs.rename("./folder1", "./folder2"),
    () => fs.rename("./folder2 copy", "./folder1")
  ];

  for (const cmd of cmds) {
    await execute(cmd, 10);
    console.log("Executed " + cmd);
  }

  async function execute(cmd, count) {
    try {
      //   console.log("trying" + JSON.stringify(cmd));
      console.log(cmd);
      await cmd();
    } catch (e) {
      if (count < 0)
        throw new Error("Failed to execute " + cmd + " too many times");
      await wait(2000);
      console.log(cmd + " failed to execute, trying again");
      console.log(count + " attempts remain");
      console.log(e.message);
      await execute(cmd, count - 1);
    }
  }
})();
