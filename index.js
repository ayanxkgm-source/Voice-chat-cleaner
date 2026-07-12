const {
  Client,
  GatewayIntentBits,
  Partials,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const VOICE_CHANNEL_ID = "1515108731866710132";
const TEXT_CHANNEL_ID = "1515342512238235688";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (
    oldState.channelId !== VOICE_CHANNEL_ID &&
    newState.channelId !== VOICE_CHANNEL_ID
  ) {
    return;
  }

  const voiceChannel = client.channels.cache.get(VOICE_CHANNEL_ID);

  if (!voiceChannel) return;

  const members = voiceChannel.members.filter(
    (m) => !m.user.bot
  );

  if (members.size === 0) {
    setTimeout(async () => {
            const checkChannel = client.channels.cache.get(VOICE_CHANNEL_ID);

      if (!checkChannel) return;

      const stillEmpty = checkChannel.members.filter(
        (m) => !m.user.bot
      );

      if (stillEmpty.size > 0) return;

      const textChannel = client.channels.cache.get(TEXT_CHANNEL_ID);

      if (!textChannel) return;

      let fetched;

      do {
        fetched = await textChannel.messages.fetch({ limit: 100 });

        const recentMessages = fetched.filter(
          (msg) =>
            Date.now() - msg.createdTimestamp <
            14 * 24 * 60 * 60 * 1000
        );

        if (recentMessages.size > 0) {
          await textChannel.bulkDelete(recentMessages, true);
        }
      } while (fetched.size >= 2);
    }, 5000);
  }
});
client.login(process.env.TOKEN);