const fs = require("fs-extra");
const path = require("path");

module.exports = async function (options) {
  await fs.outputJson(
    path.join(this.config.configDir, "config.json"),
    {
      host: "http://localhost:4000",
      clientId: "GFyXdPPyXPdzquBZ4sK9puKvUKksZl9F",
      audience: "https://devhook.io",
    },
    { flag: "wx" }
  );
};
