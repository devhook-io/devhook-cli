const fs = require("fs-extra");
const path = require("path");

module.exports = async function (options) {
  await fs.outputJson(
    path.join(this.config.configDir, "config.json"),
    {
      host: "https://api.devhook.io",
      clientId: "wG8nB4q0WcGULFfViov4hWSAObduNpKe",
      audience: "https://api.devhook.io",
    },
    { flag: "w+" }
  );
};
