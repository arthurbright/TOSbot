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
const roles = require("./modules/roles.js");
const rolegen = require("./modules/rolegen.js");
//const selectTarget = require("./modules/selectTarget.js");


// Player Class
const Player = require('./classes/player.js');

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




let players = new Map();
module.exports.players = players;

gameOver = false;


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
            //get all players in the players map
            let users =  Announce.getPlayers(client); //array of all players who reacted to start message
            for(let i = 0; i < users.length; i ++){
                players.set(users[i], new Player(users[i], client.users.cache.get(users[i])));
            }

            //assign roles TODO
            for(let i = 0; i < users.length; i ++){
                players.get(users[i]).setRole("Mayor"); //debug line
            }

            //start the first day
            gameOver = false;
            startDay();
            console.log(players);
        }

        if(args[1] === "clear"){
            Announce.clearTown(client);
        }
    }

    //mayor reveal
    if(message.content === "I reveal" && day == true && players.get(message.author.id).role === "Mayor"){
        Announce.sendTown(client, client.users.cache.get(message.author.id).username +  " has officially revealed themselves as the Mayor!");

    }



});

dayNum = 1;
day = true;


//day cycle
function startDay(){
    day = true;

    Announce.announceDay(client, dayNum, () =>{
        //end of day cycle
        channel = client.channels.cache.get(town);
        let lynchee = Vote.countVotes();
        if(lynchee != 0){
            //lynch someone!
            Ld.lynch(client, lynchee, players.get(lynchee).role);

            if(players.get(lynchee).role === "Jester"){
                endgame("jester");
            }

            players.delete(lynchee);

        }
        else{
            Announce.sendTown(client, "No one was lynched today!");
        }
        Vote.clearVote();
        

        //important: these two if statements MUST be separate
        if(!gameOver){
            checkWin();
        }
        if(!gameOver){
            startNight();
        }
    });

    //start of day cycle
    Vc.unmuteAll(client);
    Vote.sendVote(client, users, dayNum);
}

//night cycle
function startNight(){
    day = false;
    Announce.announceNight(client, dayNum, () =>{
        //end of night cycle
        



        if(!gameOver){
            checkWin();
        }
        if(!gameOver){
            startDay();
        }
    });
    //start of night cycle
    dayNum ++;
    Vc.muteAll(client);

    //dm people for their moves
    for(let player of players.values()){
        
    }


}





//checks if the game is over based on who is still alive
function checkWin(){
    //if mafia is equal to or more than half (?)

    //if only town left
    let townWin = true;
    for(let player of players.values()){
        if(!(player.data.alignment === "Town")){
            townWin = false;
        }
    }
    if(townWin){
        endgame("town");
    }


    //if only one neutral left (not jester)   ////note: jester needs separate win code!
    if(players.size == 1 && players.values().next().value.data.alignment == "Neutral"){
        endgame(players.values().next().value.role);
    }

}



function endgame(winner){
    gameOver = true;
    Timer.stopTimer();
    Ld.clearMsgs;
    players = new Map();
    dayNum = 1;
    Ld.reset(client);

    //do perms for mafia and medium TODO

    if(winner === "mafia"){
        Announce.announceMafiaWin(client);
    }
    else if(winner === "town"){
        Announce.announceTownWin(client);
    }
    //if a neutral wins, pass winner = role name
    else{
        Announce.announceNeutralWin(client, winner);
    }
    
}


