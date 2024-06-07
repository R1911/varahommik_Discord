module.exports = {
    name: "guildCreate",
    execute(guild) {
      const generalChannel = guild.channels.cache.find(
        (channel) =>
          (channel.name === "general" &&
            channel.type === 0 &&
            channel.permissionsFor(guild.members.me).has("SendMessages")) ||
          (channel.type === 0 &&
            channel.permissionsFor(guild.members.me).has("SendMessages"))
      );
  
      if (generalChannel) {
        generalChannel
          .send(
            "Tänan, et lisasite mind oma serverisse!\nSelleks, et ma saaksin korrektselt toimida, palun seadistage teadete kanal kasutades **`/seadistateated`** käsku (vajab admin õiguseid)."
          )
          .catch((error) =>
            console.error(
              `Failed to send welcome message in channel: ${generalChannel.name}`,
              error
            )
          );
      } else {
        console.log(
          "No suitable text channel found where the bot has post permissions."
        );
      }
    },
  };
  