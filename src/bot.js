require('dotenv').config();

//prefix
const prefix = "tos";
//town channel constant
const town = '833755900098379837'

//import functions from other files
const Dm = require('./modules/dm.js');
const Announce = require('./modules/announce.js');
const Ld = require('./modules/lifeDeath.js');
const Timer = require('./modules/timer.js');
const Vc = require('./modules/vc.js');
const Vote = require('./modules/vote.js');
const GameMessages = require('./modules/gameMessages.js');


//start timer periodic function
Timer.startTimer();

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
//const Player = require('./classes/player.js');

let players = new Map();
module.exports.players = players;
let users = [];
//const roles = require("./modules/roles.js");



//const selectTarget = require("./modules/selectTarget.js");


//when a message is sent
client.on('message', (message) => {
   

    var id = message.author.discriminator;
    var args = message.content.split(" ");

    /*if (args.length > 0) {

        if (args[0] === "join") {
            players.set(id, new Player(id, message.author));
        }
        else if (args[0] === "query") {

            if (players.get(id) != null) {
                message.channel.send("Name: " + players.get(id).user.username);
                message.channel.send("Role: " + players.get(id).role);
                message.channel.send("Alive: " + players.get(id).isAlive);
            }
        }

        else if (args[0] === "kill") {
            if (args.length > 1 && players.get(args[1]) != null) {   
                
                if (players.get(id).data.atk > players.get(id).data.def) {
                    players.get(args[1]).isAlive = false;
                    message.channel.send(args[1] + " was killed! D:");
                }
                else {
                    message.channel.send(args[1] + "'s defence was too strong!");
                }

            }
        }

        else if (args[0] === "role") {
            if (args.length > 1) {   
                players.get(id).setRole(args[1]);
                console.log(players.get(id).data);

            }
        }
        else if (args[0] === "target") {
            //selectTarget.getTargets(roles.isGodfather);
        }
    }*/

    //game commands with prefix
    if(args[0] === prefix){
        if(args[1] === "getPlayers"){
            Announce.pollPlayers(client);
        }

        if(args[1] === "start"){
            users = Announce.getPlayers(client); //TODO, temporary; this gets an array of all players playing
            startDay();
        }

        if(args[1] === "clear"){
            Announce.clearTown(client);
        }
    }



});

dayNum = 1;

//day cycle
function startDay(){
    Announce.announceDay(client, dayNum, () =>{
        //end of day cycle
        channel = client.channels.cache.get(town);
        channel.send( Vote.countVotes() + " was lynched");
        Vote.clearVote();
        

        checkWin();
        startNight();
    });


    Vc.unmuteAll(client);
    Vote.sendVote(client, users, dayNum);
}

//night cycle
function startNight(){
    
    Announce.announceNight(client, dayNum, () =>{
        //end of night cycle
        


        checkWin();
        startDay();
        
    });
    dayNum ++;
    
    Vc.muteAll(client);

}

//checks if the game is over based on who is still alive
function checkWin(){

}


