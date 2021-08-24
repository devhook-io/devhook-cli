const { Command } = require("@oclif/command");
const axios = require("axios");
const chalk = require("chalk");
const fs = require("fs-extra");
const { hri } = require("human-readable-ids");
const path = require("path");
const prompts = require("prompts");
const { Socket } = require("phoenix-channels");

class MonitorCommand extends Command {
  startMonitor(room, config) {
    let activeWebhook = {};
    let socket = new Socket(`${config.host}/socket`, {
      params: { token: config.accessToken },
    });
    socket.connect();

    let channel = socket.channel(room, { token: config.accessToken });
    channel.on("event:new", (event) => {
      event.metadata.id = hri.random();
      this.logIncomingEvent(event);
      this.forwardEvent(event, activeWebhook);
    });

    channel
      .join()
      .receive("ok", ({ webhook }) => {
        activeWebhook = webhook;
        this.log(
          `Ready! 👂 Listening at http://localhost:4000/webhooks/${webhook.uid}`
        );
      })
      .receive("error", (resp) => {
        this.log("Unable to join", resp);
      });
  }

  forwardEvent(event, webhook) {
    axios
      .post(webhook.destination, event.body, {
        headers: event.headers,
      })
      .then((res) => {
        this.log(res);
        this.logResult(chalk.green.bold(`${res.status} 👍`), event, webhook);
      })
      .catch((err) => {
        this.logResult(
          chalk.red.bold(`${err.response.status} 👎`),
          event,
          webhook
        );
      });
  }

  logIncomingEvent(event) {
    this.log(
      `${event.metadata.timestamp} --> Received event from ${chalk.bold(
        event.metadata.request_ip
      )} [${event.metadata.id}]`
    );
  }

  logResult(status, event, webhook) {
    let timestamp = new Date().toISOString();
    this.log(
      `${timestamp} <-- [${status}] POST ${webhook.destination} [${event.metadata.id}]`
    );
  }

  async getWebhooks(config) {
    let webhooks;
    await axios
      .get(`${config.host}/api/webhooks`, {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      })
      .then((res) => {
        webhooks = res.data;
      });
    return webhooks;
  }

  async run() {
    const config = await fs.readJSON(
      path.join(this.config.configDir, "config.json")
    );
    const webhooks = await this.getWebhooks(config);
    let selectedWebhook = "";
    if (webhooks.length === 1) {
      selectedWebhook = webhooks[0].uid;
    } else {
      const choices = webhooks.map((webhook) => {
        return {
          title: webhook.human_name,
          description: webhook.destination,
          value: webhook.uid,
        };
      });

      const response = await prompts({
        type: "select",
        name: "value",
        message: "Select a webhook",
        choices: choices,
        initial: 0,
      });

      selectedWebhook = response.value;
    }
    this.startMonitor(`webhooks:${selectedWebhook}`, config);
  }
}

MonitorCommand.description = `Receive and forward webhook events for the webhook you select
...
You will need to create your webhooks in the Web UI (https://app.devhook.io)
`;

module.exports = MonitorCommand;
