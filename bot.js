
const Discord = require('discord.js');
const client = new Discord.Client();
 const prefix = "-";
client.on('ready', () => {
    console.log('I am ready!');
});

client.on('voiceStateUpdate', (old, now) => {
    const channel = client.channels.get('472156986444873749');
    const currentSize = channel.guild.members.filter(m => m.voiceChannel).size;
    const size = channel.name.match(/\[\s(\d+)\s\]/);
    if (!size) return channel.setName(`ONLINE • 「${currentSize}」`);
    if (currentSize !== size) channel.setName(`ONLINE • 「${currentSize}」`);
  });




client.login(process.env.BOT_TOKEN);

