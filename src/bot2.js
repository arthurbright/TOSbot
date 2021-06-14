require('dotenv').config();
var dmmm = require('./modules/dm');
var ld = require('./modules/lifeDeath');
var timer = require('./modules/timer');
var Vote = require('./modules/vote');
var Announce = require('./modules/announce');
var Vc = require('./modules/vc');

//prefix const
const PREFIX = "tos";

//making new discord bot client
const Discord = require('discord.js');
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

beats = 195

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
        timer.setTimer(client, parseInt(message.content.split(" ")[1]), () =>{
            console.log('time is up');
        });
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
    else if(message.content === "clearvote"){
        Vote.clearVote();
    }
    else if(message.content === "vet"){
        dmmm.askAlert(client, '304651275423842314', 2, (m) =>{
            
        })
    }
    else if(message.content === "guard"){
        dmmm.askVest(client, '304651275423842314', 1, (m) =>{
            
        })
    }
    else if(message.content.startsWith('testkill')){
        ld.killPlayer(client, message.content.split(" ")[1], "methmatician");
    }
    else if(message.content === 'reviive'){
        ld.reset(client);
    }
    else if(message.content === 'dayyy'){
        Announce.announceDay(client, 420);
    }
    else if(message.content === 'rev'){
        Announce.revealMayor(client, '305069040706256896');
    }
    else if(message.content === 'clearTown'){
        Announce.clearTown(client);
    }
    else if(message.content === 'muteAll'){
        Vc.muteAll(client);
    }
    else if(message.content === 'unmuteAll'){
        Vc.unmuteAll(client);
    }
    else if(message.content === 'poj'){
        message.channel.send("poj indeed");
    }


    //for kevin bday :)
    else if(message.content === "hb"){
        message.channel.send(":tada: :tada: HAPPY 18th BIRTHDAY KEVIN!!!!!!!! :tada: :tada:")
        message.delete();
    }
    else if(message.content === "punch"){
        beats += 1;
        message.channel.send("Kevin has recieved **" + beats + "** birthday beats.");
    }
    else if(message.content === "oog"){
        let m = new Discord.MessageEmbed();
        m.setTitle("DAY 3");
        m.setDescription("Time left: xx s");
        m.setColor('#ff1100');
        
        message.channel.send(m);
        
    }


    else if(message.content === "pollstart"){
        Announce.pollPlayers(client);
    }
    else if(message.content === "pollcount"){
        Announce.getPlayers(client);
    }


});


