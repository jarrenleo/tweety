import { config } from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
config();

class Discord {
  constructor() {
    this.discord = this.initDiscord();
    this.handleMessage();
  }

  initDiscord() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    client.login(process.env.DISCORD_TOKEN);

    return client;
  }

  hasTwitterUrl(message) {
    return (
      message.includes("https://twitter.com") ||
      message.includes("https://x.com")
    );
  }

  getTwitterUrls(message) {
    const urls = [];
    const index = message.indexOf("https");

    let messages = message.slice(index).split(" ");
    if (message === messages[0]) messages = messages[0].split("\n");

    for (const m of messages) {
      if (m.includes("https://twitter.com"))
        urls.push(m.replace("twitter", "fxtwitter"));

      if (m.includes("https://x.com")) urls.push(m.replace("x", "fxtwitter"));
    }

    return urls;
  }

  sendMessage(m, urls) {
    for (const url of urls) {
      m.reply({
        content: url,
        allowedMentions: {
          repliedUser: false,
        },
      });
    }
  }

  handleMessage() {
    this.discord.on(Events.MessageCreate, async (m) => {
      const message = m.content.toLowerCase();
      if (!this.hasTwitterUrl(message)) return;

      const urls = this.getTwitterUrls(message);
      this.sendMessage(m, urls);
    });
  }
}

new Discord();
