const { Command } = require("@oclif/command");
const axios = require("axios");
const chalk = require("chalk");
const { cli } = require("cli-ux");
const fs = require("fs-extra");
const path = require("path");

class Login extends Command {
  async generateCode(config) {
    const reqBody = {
      client_id: config.clientId,
      audience: config.audience,
    };

    let res = await axios.post(
      "https://devhook.us.auth0.com/oauth/device/code",
      reqBody
    );
    if (res.status != 200) {
      this.error("Error generating login code.");
    }
    const code = res.data;

    await cli.open(code.verification_uri_complete);

    cli.action.start("Waiting for browser verification");

    let verified = false;
    while (!verified) {
      let reqBody = {
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        client_id: config.clientId,
        device_code: code.device_code,
      };

      let res = await axios.post(
        "https://devhook.us.auth0.com/oauth/token",
        reqBody,
        {
          timeout: 5000,
          validateStatus: function (status) {
            return status === 200 || status === 403;
          },
        }
      );

      if (res.status === 403) {
        await cli.wait(5000);
      }

      if (res.status === 200) {
        verified = true;
        cli.action.stop(chalk.green("✅ successful login!"));
        config.accessToken = res.data.access_token;
        await fs.writeJSON(
          path.join(this.config.configDir, "config.json"),
          config
        );
      }
    }
  }

  async run() {
    console.log(this.config.configDir);
    const config = await fs.readJSON(
      path.join(this.config.configDir, "config.json")
    );
    await this.generateCode(config);
  }
}

Login.description = `Authenticate your machine with Devhook. Will need an existing Devhook account
`;

module.exports = Login;
