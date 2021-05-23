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




// Player Class
const Player = require('./classes/player.js');

let players = new Map();





//when a message is sent
client.on('message', (message) =>{
   

    var id = message.author.discriminator;
    var args = message.content.split(" ");

    if (args.length > 0) {

        if (args[0] === "join") {
            players.set(id, new Player(id, message.author));
        }
        else if (args[0] === "query") {

            if (players.get(id) != null) {
                message.channel.send("Name: " + players.get(id).user.username);
                message.channel.send("Alive: " + players.get(id).isAlive);
            }
        }

        else if (args[0] === "kill") {
            if (args.length > 1 && players.get(args[1]) != null) {   
                players.get(args[1]).isAlive = false;
                //message.channel.send(args[1] + " was killed! D:");

            }
        }
    }


});


