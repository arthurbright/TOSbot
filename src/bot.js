require('dotenv').config();

//making new discord bot client
const { Client } = require('discord.js');
const client = new Client();

//bot login, bot goes online
client.login(process.env.DISCORDJS_BOT_TOKEN);

//on ready method runs when bot first logs on
client.on('ready', () => {
    console.log("Bot successfully logged in: " + client.user.tag);
});

eugena = true;
//when a message is sent
client.on('message', (message) =>{
    if(message.author.discriminator === '5069'){

        if(message.content === "swap"){
            eugena = !eugena;
            message.delete();
        }
        else if(eugena){
            message.channel.send("Kirsten is now my hostage. She says: " + message.content);
            message.delete();
        }
       
    }
});


