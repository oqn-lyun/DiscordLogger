import { Client, MessageEmbed } from "discord.js";
import { getConfig } from "./config";

const config = getConfig();
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

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

client.on("messageCreate", async (message) => {
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
  const embed = new MessageEmbed()
    .setAuthor({
      name:
        message.author.username + `（${message.member?.displayName ?? ""}）`,
      iconURL: message.author.avatarURL() ?? undefined,
    })
    .setDescription(message.content);
  for (const url of message.attachments.map((attachment) => attachment.url)) {
    embed.addField("画像", url);
  }

  await channel.send({ embeds: [embed] });
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (
    !oldMessage.author ||
    oldMessage.author.bot ||
    !newMessage.author ||
    newMessage.author.bot
  ) {
    return;
  }
  if (
    oldMessage.channelId !== config.loggingId &&
    newMessage.channelId !== config.loggingId
  ) {
    return;
  }

  const channel = client.channels.cache.get(config.outputId);
  if (!channel?.isText()) {
    return;
  }
  const embed = new MessageEmbed()
    .setAuthor({
      name:
        newMessage.author.username +
        `（${newMessage.member?.displayName ?? ""}）`,
      iconURL: newMessage.author.avatarURL() ?? undefined,
    })
    .setFields([
      { name: "編集前", value: oldMessage.content ?? "`削除`" },
      { name: "編集後", value: newMessage.content ?? "`削除`" },
    ]);

  await channel.send({ embeds: [embed] });
});

client.login(config.token);
