require('dotenv').config();
var dmmm = require('./modules/dm');
var ld = require('./modules/lifeDeath');
//prefix const
const PREFIX = "tos";

//making new discord bot client
const { Client } = require('discord.js');
const client = new Client();

//bot login, bot goes online
client.login(process.env.DISCORDJS_BOT_TOKEN);

//on ready method runs when bot first logs on
client.on('ready', () => {
    console.log("Bot successfully logged in: " + client.user.tag);
});

//when a message is sent
client.on('message', (message) =>{
    if(message.content === 'dm'){
        dmmm(client, message.author.id, 1, ["304651275423842314", "771541698731835403", "360963947479957514", "305069040706256896"], (msg) =>{
            console.log(msg);
        });
        
    }
    if(message.content === 'dmm'){
        dmmm(client, message.author.id, 2, ["304651275423842314", "771541698731835403", "360963947479957514", "305069040706256896"], (msg) =>{
            console.log(msg);
        });
        
    }
    if(message.content.startsWith("tkill")){
        ld.kill(client, message);
    }
    else if(message.content.startsWith("tlive")){
        ld.revive(client, message);
    }
    else if(message.content.startsWith("liveall")){
        ld.reviveAll(client, message);
    }


});


