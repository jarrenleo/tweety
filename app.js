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
    return message.includes("://x") || message.includes("://twitter");
  }

  editTwitterUrl(message) {
    let editedMessage = message;

    if (message.includes("://x"))
      editedMessage = message.replace("://x", "://fxtwitter");

    if (message.includes("://twitter"))
      editedMessage = message.replace("://twitter", "://fxtwitter");

    return editedMessage;
  }

  async fetchChannel(channelId) {
    return await this.discord.channels.fetch(channelId);
  }

  async sendMessage(channel, message, author) {
    await channel.send(`${message}\nTweet shared by <@${author}>`);
  }

  async deleteOriginalMessage(channel, messageId) {
    await channel.messages.delete(messageId);
  }

  async handleMessage() {
    this.discord.on(Events.MessageCreate, async (m) => {
      const message = m.content.toLowerCase();
      if (!this.hasTwitterUrl(message)) return;

      const editedMessage = this.editTwitterUrl(message);
      const channel = await this.fetchChannel(m.channelId);

      this.sendMessage(channel, editedMessage, m.author.id);
      this.deleteOriginalMessage(channel, m.id);
    });
  }
}

new Discord();
