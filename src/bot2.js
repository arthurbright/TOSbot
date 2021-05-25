require('dotenv').config();
var dmmm = require('./modules/dm');
var ld = require('./modules/lifeDeath');
var timer = require('./modules/timer');
var Vote = require('./modules/vote');

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

//start the timer
timer.startTimer();



//when a message is sent
client.on('message', (message) =>{
    if(message.content === 'dm'){
       
        dmmm.askMove(client, message.author.id, 1, ["304651275423842314", "771541698731835403", "360963947479957514", "305069040706256896"], (msg) =>{
            console.log(msg);
        });
        
    }
    if(message.content === 'dmm'){
        dmmm.askMove(client, message.author.id, 2, ["304651275423842314", "771541698731835403", "360963947479957514", "305069040706256896"], (msg) =>{
            console.log(msg);
        });
        
    }

    //temp functions for game
    if(message.content.startsWith("tkill") && message.mentions.users.first()){
        ld.kill(message);
    }
    else if(message.content.startsWith("tlive") && message.mentions.users.first()){
        ld.revive(message);
    }
    else if(message.content.startsWith("liveall")){
        ld.reviveAll(message);
    }
    else if(message.content.startsWith("setTimer")){
        timer.setTimer(parseInt(message.content.split(" ")[1]), message);
    }
    else if(message.content === "vote"){
        Vote.sendVote(client, ['304651275423842314', "305069040706256896", "290320543973113858"], 69);
    }
    else if(message.content === "count"){
        k = Vote.countVotes();
        if(k == 0){
            message.channel.send("No one voted out");
        }
        else{
            message.channel.send("Voted out: " + client.users.cache.get(Vote.countVotes()).username);
        }
        
    }
    else if(message.content === "vet"){
        dmmm.askAlert(client, '304651275423842314', 2, (m) =>{
            
        })
    }
    else if(message.content === "guard"){
        dmmm.askVest(client, '304651275423842314', 1, (m) =>{
            
        })
    }


});


