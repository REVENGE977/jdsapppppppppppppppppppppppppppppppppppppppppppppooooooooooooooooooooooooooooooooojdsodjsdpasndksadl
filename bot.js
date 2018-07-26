const Discord = require('discord.js');
const client = new Discord.Client();
 const prefix = "-";
client.on('ready', () => {
    console.log('I am ready!');
});

client.on("ready", async  => {
    let guild = client.guilds.get("408352800133873664");
  let users = guild.members.map(member => member.user.id);
  let i;
  rebel=0;
for (i=0 ; i < users.length ; i++) {
 let   check = guild.members.get(users[i]);
if(!check.voiceChannelID){
        continue;
}else{
  rebel++;
}
}
guild.channels.find('id', '469540555886559262').setName(" Mars Online「"+rebel+"」");
  client.setInterval(() =>{
    let d = Date.now()
  }, 5000);
});
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let guild = client.guilds.get("408352800133873664");
let newUserChannel = newMember.voiceChannel
let oldUserChannel = oldMember.voiceChannel
 if(oldUserChannel === undefined && newUserChannel !== undefined) {
   rebel++;
guild.channels.find('id', '472156986444873749').setName(" Mars Online「"+rebel+"」");
} else if(newUserChannel === undefined){
  rebel--;
guild.channels.find('id', '472156986444873749').setName(" Mars Online「"+rebel+"」");
}
});
client.on('message', Codes => {

  if(Codes.content === "-صوت") {
      Codes.channel.send(" Voice「"+rebel+"」");
}
});






client.login(process.env.BOT_TOKEN);
