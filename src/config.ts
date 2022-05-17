import ConfigParser from "configparser";

const configFilename = "config.ini";
const discordSection = "discord";
const tokenKey = "token";
const loggingIdKey = "loggingId";
const outputIdKey = "outputId";

type Config = {
  token: string;
  loggingId: string;
  outputId: string;
};

const printHelpMessage = (): void => {
  console.log("token : 使用するbotのtoken");
  console.log("loggingId : ログを取るチャンネルのID");
  console.log("outputId : ログを書き込むチャンネルのID");
};

export const getConfig = (): Config => {
  const configParser = new ConfigParser();
  try {
    configParser.read(configFilename);
    const token = configParser.get(discordSection, tokenKey);
    const loggingId = configParser.get(discordSection, loggingIdKey);
    const outputId = configParser.get(discordSection, outputIdKey);
    if (!token || !loggingId || !outputId) {
      console.log("設定値を修正してください");
      printHelpMessage();
      process.exit();
    }
    return { token, loggingId, outputId };
  } catch (e) {
    configParser.addSection(discordSection);
    configParser.set(discordSection, tokenKey, "");
    configParser.set(discordSection, loggingIdKey, "");
    configParser.set(discordSection, outputIdKey, "");
    configParser.write(configFilename);
    console.log(`${configFilename}を生成しました`);
    console.log(`${configFilename}をに設定を書いてください`);
    printHelpMessage();
    process.exit();
  }
};
