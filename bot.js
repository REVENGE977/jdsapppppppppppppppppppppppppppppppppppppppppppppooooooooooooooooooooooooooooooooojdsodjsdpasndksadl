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
const ytdl = require('ytdl-core');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const request = require('request');
const yt_api_key = "AIzaSyDeoIH0u1e72AtfpwSKKOSy3IPp2UHzqi4";
client.on('ready', function() {
    console.log(`i am ready ${client.user.username}`);
});
/*
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
*/
var servers = [];
var queue = [];
var guilds = [];
var queueNames = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
var skippers = [];
var now_playing = [];
/*
\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\V/////////////////////////
*/
client.on('ready', () => {});
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

client.on('message', function(message) {
    const member = message.member;
    const mess = message.content.toLowerCase();
    const args = message.content.split(' ').slice(1).join(' ');

    if (mess.startsWith(prefix + 'play')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        // if user is not insert the URL or song title
        if (args.length == 0) {
            let play_info = new Discord.RichEmbed()
                .setAuthor(client.user.username, client.user.avatarURL)
                .setFooter('طلب بواسطة: ' + message.author.tag)
                .setDescription('**قم بإدراج رابط او اسم الأغنيه**')
            message.channel.sendEmbed(play_info)
            return;
        }
        if (queue.length > 0 || isPlaying) {
            getID(args, function(id) {
                add_to_queue(id);
                fetchVideoInfo(id, function(err, videoInfo) {
                    if (err) throw new Error(err);
                    let play_info = new Discord.RichEmbed()
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .addField('تمت إضافةالاغنيه بقائمة الإنتظار', `**
                          ${videoInfo.title}
                          **`)
                        .setColor("#a637f9")
                        .setFooter('|| ' + message.author.tag)
                        .setThumbnail(videoInfo.thumbnailUrl)
                    message.channel.sendEmbed(play_info);
                    queueNames.push(videoInfo.title);
                    now_playing.push(videoInfo.title);

                });
            });
        }
        else {

            isPlaying = true;
            getID(args, function(id) {
                queue.push('placeholder');
                playMusic(id, message);
                fetchVideoInfo(id, function(err, videoInfo) {
                    if (err) throw new Error(err);
                    let play_info = new Discord.RichEmbed()
                        .setAuthor(client.user.username, client.user.avatarURL)
                        .addField('__**تم التشغيل ✅**__', `**${videoInfo.title}
                              **`)
                        .setColor("RANDOM")
                        .addField(`بواسطه`, message.author.username)
                        .setThumbnail(videoInfo.thumbnailUrl)

                    // .setDescription('?')
                    message.channel.sendEmbed(play_info)
                    message.channel.send(`
                            **${videoInfo.title}** تم تشغيل `)
                    // client.user.setGame(videoInfo.title,'https://www.twitch.tv/Abdulmohsen');
                });
            });
        }
    }
    else if (mess.startsWith(prefix + 'skip')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        message.channel.send('`✔`').then(() => {
            skip_song(message);
            var server = server = servers[message.guild.id];
            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        });
    }
    else if (message.content.startsWith(prefix + 'vol')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        // console.log(args)
        if (args > 100) return message.channel.send('1 - 100 || **__لا أكثر ولا أقل__**')
        if (args < 1) return message.channel.send('1 - 100 || **__لا أكثر ولا أقل__**')
        dispatcher.setVolume(1 * args / 50);
        message.channel.sendMessage(`**__ ${dispatcher.volume*50}% مستوى الصوت __**`);
    }
    else if (mess.startsWith(prefix + 'pause')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        message.channel.send('`✔`').then(() => {
            dispatcher.pause();
        });
    }
    else if (mess.startsWith(prefix + 'ok')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
            message.channel.send('`✔`').then(() => {
            dispatcher.resume();
        });
    }
    else if (mess.startsWith(prefix + 'stop')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        message.channel.send('`✔`');
        var server = server = servers[message.guild.id];
        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    }
    else if (mess.startsWith(prefix + 'تعال')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        message.member.voiceChannel.join().then(message.channel.send(':ok:'));
    }
    else if (mess.startsWith(prefix + 'play')) {
        if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
        if (isPlaying == false) return message.channel.send(':anger: || **__تم التوقيف__**');
        let playing_now_info = new Discord.RichEmbed()
            .setAuthor(client.user.username, client.user.avatarURL)
            .addField('تمت إضافةالاغنيه بقائمة الإنتظار', `**
                  ${videoInfo.title}
                  **`)
            .setColor("RANDOM")
            .setFooter('طلب بواسطة: ' + message.author.tag)
            .setThumbnail(videoInfo.thumbnailUrl)
        //.setDescription('?')
        message.channel.sendEmbed(playing_now_info);
    }
});

function skip_song(message) {
    if (!message.member.voiceChannel) return message.channel.send(':no_entry: || **__يجب ان تكون في روم صوتي__**');
    dispatcher.end();
}

function playMusic(id, message) {
    voiceChannel = message.member.voiceChannel;


    voiceChannel.join().then(function(connectoin) {
        let stream = ytdl('https://www.youtube.com/watch?v=' + id, {
            filter: 'audioonly'
        });
        skipReq = 0;
        skippers = [];

        dispatcher = connectoin.playStream(stream);
        dispatcher.on('end', function() {
            skipReq = 0;
            skippers = [];
            queue.shift();
            queueNames.shift();
            if (queue.length === 0) {
                queue = [];
                queueNames = [];
                isPlaying = false;
            }
            else {
                setTimeout(function() {
                    playMusic(queue[0], message);
                }, 500);
            }
        });
    });
}

function getID(str, cb) {
    if (isYoutube(str)) {
        cb(getYoutubeID(str));
    }
    else {
        search_video(str, function(id) {
            cb(id);
        });
    }
}

function add_to_queue(strID) {
    if (isYoutube(strID)) {
        queue.push(getYoutubeID(strID));
    }
    else {
        queue.push(strID);
    }
}

function search_video(query, cb) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + yt_api_key, function(error, response, body) {
        var json = JSON.parse(body);
        cb(json.items[0].id.videoId);
    });
}


function isYoutube(str) {
    return str.toLowerCase().indexOf('youtube.com') > -1;
}



client.on('message', message => {
    if(!message.channel.guild) return;
if(message.content.startsWith('-bc')) {
if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('**للأسف لا تمتلك صلاحية** `ADMINISTRATOR`' );
let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
let copy = "BreackMC";
let request = `Requested By ${message.author.username}`;
if (!args) return message.reply('**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست**');message.channel.send(`**هل أنت متأكد من إرسالك البرودكاست؟ \nمحتوى البرودكاست:** \` ${args}\``).then(msg => {
msg.react('✅')
.then(() => msg.react('❌'))
.then(() =>msg.react('✅'))







let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });
let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });
reaction1.on("collect", r => {
message.channel.send(`☑ |   ${message.guild.members.size} يتم ارسال البرودكاست الى عضو `).then(m => m.delete(5000));
message.guild.members.forEach(m => {
var bc = new
Discord.RichEmbed()
.setColor('RANDOM')
.setTitle('البرودكاست') .addField('السيرفر', message.guild.name) .addField('المرسل', message.author.username)
.addField('الرساله', args)
.setThumbnail(message.author.avatarURL)
.setFooter(copy, client.user.avatarURL);
m.send({ embed: bc })
msg.delete();
})
})
reaction2.on("collect", r => {
message.channel.send(`**Broadcast Canceled.**`).then(m => m.delete(5000));
msg.delete();
})
})
}
})




const mmss = require('ms');
client.on('message', async message => {
    let muteReason = message.content.split(" ").slice(3).join(" ");
    let mutePerson = message.mentions.users.first();
    let messageArray = message.content.split(" ");
    let muteRole = message.guild.roles.find("name", "Muted");
    let time = messageArray[2];
    if(message.content.startsWith(prefix + "tempmute")) {
                let staff = message.guild.member(message.author).roles.find('name' , 'Chat-Muter');
                                if(!staff) return message.reply('**- You don\'t have the needed permissions!**');
        if(!mutePerson) return message.channel.send("**- منشن الشخص يلي تبي تعطيه الميوت**");
        if(mutePerson === message.author) return message.channel.send('**- ماتقدر تعطي نفسك ميوت**');
        if(mutePerson === client.user) return message.channel.send('**- ماتقدر تعطي البوت ميوت :)**');
        if(message.guild.member(mutePerson).roles.has(muteRole.id)) return message.channel.send('**- هذا الشخص ميوتد بالفعل**');
        if(!muteRole) return message.guild.createRole({ name: "Chat-Muted", permissions: [] });
        if(!time) return message.channel.send("**- اكتب الوقت**");
        if(!time.match(/[1-60][s,m,h,d,w]/g)) return message.channel.send('**- اكتب وقت حقيقي**');
        if(!muteReason) return message.channel.send("**- اكتب السبب**");
        message.guild.member(mutePerson).addRole(muteRole);
        let muteEmbed = new Discord.RichEmbed()
        .setAuthor(`${mutePerson.username}#${mutePerson.discriminator}`,mutePerson.avatarURL)
        .setTitle(`You have been muted in ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL)
        .addField('- تم الميوت بواسطه:',message.author,true)
        .addField('- السبب:',muteReason,true)
        .addField('- الوقت:',`${mmss(mmss(time), {long: true})}`)
        .setFooter(message.author.username,message.author.avatarURL);
        message.channel.sendMessage(muteEmbed)
        .then(() => { setTimeout(() => {
           message.guild.member(mutePerson).removeRole(muteRole);
       }, mmss(time));
    });
    }
});

 

client.on('message', message => {

  if (message.author.bot) return;
  if(!message.channel.guild) return;
  if (message.mentions.users.size < 1) return;
  let args = message.content.split(" ").slice(1);
  
 





var prefix = "$";

client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if(!message.channel.guild) return;
  if(!message.member.hasPermission('MANAGE_MESSAGES')) return;
  if (message.mentions.users.size < 1) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);
  
 

if (command == "warn") {
    let say = new Discord.RichEmbed()
    .setDescription(args.join("  "))
    .setColor(0x831f18)
    message.channel.send(args.join(' '));
    client.channels.get("آي دي روم اللوق").send(`**=========================================**`)
    client.channels.get("آي دي روم اللوق").send(`**New Warn !**`)
    client.channels.get("آي دي روم اللوق").send(args.join(' '))
    client.channels.get("آي دي روم اللوق").send(`**Admin : ${message.author.username}#${message.author.discriminator}**`)
    client.channels.get("آي دي روم اللوق").send(`**In Channel : ${message.channel}**`)
    message.delete();
 
       message.channel.send(`**- Done!, I warned: ${wUser}**`);
  }


});






client.on('message', async message => {
    var moment = require('moment');
    let date = moment().format('Do MMMM YYYY , hh:mm');
    let User = message.mentions.users.first();
    let Reason = message.content.split(" ").slice(3).join(" ");
    let messageArray = message.content.split(" ");
    let time = messageArray[2];
    if(message.content.startsWith(prefix + "tempban")) {
       if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.channel.send("**- BAN_MEMBERSما معك برمشن**");
       if(!User) message.channel.send("**- منشن يلي تبي تبنده**");
       if(User.id === client.user.id) return message.channel.send("**- ماتقدر تبند البوت**");
       if(User.id === message.guild.owner.id) return message.channel.send("**- ماتقدر تبند الاونر**");
       if(!time) return message.channel.send("**- اكتب الوقت**");
       if(!time.match(/[1-60][s,m,h,d,w]/g)) return message.channel.send('**- اكتب وقت حقيقي**');
       if(!Reason) message.channel.send("**- اكتب السبب**");
       let banEmbed = new Discord.RichEmbed()
       .setAuthor(`You have been banned from ${message.guild.name} !`)
       .setThumbnail(message.guild.iconURL || message.guild.avatarURL)
       .addField('- تم التبنيد بواسطه: ',message.author.tag,true)
       .addField('- السبب:',Reason,true)
       .addField('- الوقت يلي حصل فيه الباند:',date,true)
       .addField('- مده الباند:',time,true)
       .addField('رابط السيرفر https://discord.gg/h2KpNkt')
       .setFooter(message.author.tag,message.author.avatarURL);
       User.sendMessage({embed: banEmbed}).then(() => message.guild.member(User).ban({reason: Reason}))
       .then(() => message.channel.send(`**# Done! I banned: ${User}**`)).then(() => { setTimeout(() => {
           message.guild.unban(User);
       }, mmss(time));
        client.users.get(User.id).send('https://discord.gg/gw3eVa2')
    });
   }
});


client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.split(" ")[0];
  command = command.slice(prefix.length);
  let args = msg.content.split(" ").slice(1);

    if(command === "clear") {
        const emoji = client.emojis.find("name", "wastebasket")
    let textxt = args.slice(0).join("");
    if(msg.member.hasPermission("MANAGE_MESSAGES")) {
    if (textxt == "") {
        msg.delete().then
    msg.channel.send("***```ضع عدد الرسائل التي تريد مسحها 👌```***").then(m => m.delete(3000));
} else {
    msg.delete().then
    msg.delete().then
    msg.channel.bulkDelete(textxt);
        msg.channel.send("```php\nعدد الرسائل التي تم مسحها: " + textxt + "\n```").then(m => m.delete(3000));
        }
    }
}
});

})

client.login(process.env.BOT_TOKEN);
