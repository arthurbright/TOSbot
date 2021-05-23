require('dotenv').config();
var dmmm = require('./modules/dm')
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
        dmmm(client);
    }

});


