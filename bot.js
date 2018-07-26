const Discord = require('discord.js');
const client = new Discord.Client();
 const prefix = "-";
client.on('ready', () => {
    console.log('I am ready!');
});

let rebel;
client.on("ready", async  => {
    let guild = client.guilds.get("472156986444873749");
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
guild.channels.find('id', '472156986444873749').setName(" ONLINE • : "+rebel+"");
  client.setInterval(() =>{
    let d = Date.now()
  }, 5000);
});
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let guild = client.guilds.get("472156986444873749");
let newUserChannel = newMember.voiceChannel
let oldUserChannel = oldMember.voiceChannel
 if(oldUserChannel === undefined && newUserChannel !== undefined) {
   rebel++;
guild.channels.find('id', '472156986444873749').setName(" ONLINE • : "+rebel+"");
} else if(newUserChannel === undefined){
  rebel--;
guild.channels.find('id', '472156986444873749').setName(" ONLINE • : "+rebel+"");
}
});
client.on('message', Codes => {
  
  if(Codes.content === "-صوت") {
      Codes.channel.send(" المتصلين الان : "+rebel+"");
}
});





client.login(process.env.BOT_TOKEN);
