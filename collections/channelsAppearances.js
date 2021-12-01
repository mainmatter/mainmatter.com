// This collection glues all the appearances to their respective channels to build out the /talks page

module.exports = (collection) => {
  const appearances = require("./appearances")(collection);
  const channelsAppearances = require("./channels")(collection);

  appearances.forEach((appearance) => {
    const channelId = appearance.data.channel;
    const channel = channelsAppearances.find((channel) => {
      return channelId === channel.template.parsed.name;
    });
    if (!channel.appearances) {
      channel.appearances = [];
    }
    channel.appearances.push(appearance);
  });

  return channelsAppearances;
};
