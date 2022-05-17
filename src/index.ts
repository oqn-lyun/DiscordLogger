import { Client, Message, MessageEmbed } from "discord.js";
import { getConfig } from "./config";

const config = getConfig();
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const buildEmbedMessage = (message: Message): MessageEmbed => {
  const embed = new MessageEmbed()
    .setAuthor({
      name:
        message.author.username + `（${message.member?.displayName ?? ""}）`,
      iconURL: message.author.avatarURL() ?? undefined,
    })
    .setDescription(message.content);
  return embed;
};

client.once("ready", () => {
  const loggingChannel = client.channels.cache.get(config.loggingId);
  const outputChannel = client.channels.cache.get(config.outputId);
  if (!loggingChannel?.isText()) {
    console.log("メッセージ取得先チャンネルが存在しません");
    process.exit();
  }
  if (!outputChannel?.isText()) {
    console.log("出力先チャンネルが存在しません");
    process.exit();
  }
  console.log("start");
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) {
    return;
  }
  if (message.channelId !== config.loggingId) {
    return;
  }

  const channel = client.channels.cache.get(config.outputId);
  if (!channel?.isText()) {
    return;
  }

  await channel.send({ embeds: [buildEmbedMessage(message)] });
});

client.login(config.token);
