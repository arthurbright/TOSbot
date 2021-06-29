require('dotenv').config();

//prefix
const prefix = "tos";
//channel constants
const town = '833755900098379837';
const mafiaChannel = '833755959745577040';
const deadSea = '841847192184422430';
const guild = '758155951240642572';
const botId = '844065886541185074';


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
const { Client, Guild } = require('discord.js');
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

            //assign roles TODO ROLEGEN + DM ROLES TO PLAYERS
            for(let i = 0; i < users.length; i ++){
                players.get(users[i]).setRole("Medium"); //debug line
            }

            //start the first day
            gameOver = false;
            startDay();
        }

        if(args[1] === "clear"){
            resetChannels();
        }
    }

    //mayor reveal
    if(message.content === "reveal" && day == true && players.get(message.author.id).role === "Mayor" && !players.get(message.author.id).data.revealed){
        Announce.sendTown(client, client.users.cache.get(message.author.id).username +  " has officially revealed themselves as the Mayor!");
        players.get(message.author.id).data.revealed = true;
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
        promoteMafioso();

        //important: these two if statements MUST be separate
        if(!gameOver){
            checkWin();
        }
        if(!gameOver){
            startNight();
        }
    });

    //start of day cycle
    closeMedium();
    closeMafia();
    Vc.unmuteAll(client);
    Vote.sendVote(client, getPlayerIds(), dayNum);
}

//night cycle
function startNight(){
    day = false;
    Announce.announceNight(client, dayNum, () =>{
        //end of night cycle
        //CALCULATIONS
        //NOTE: if doctor decides to not save anyone, store prevId as -1, not 0.

        //Priority 1
        //REMEMBER TO INCLUDE VIGILANTE SUICIDE






        promoteMafioso();
        if(!gameOver){
            checkWin();
        }
        if(!gameOver){
            startDay();
        }
    });
    ///////////////////////////////////////////start of night cycle
    dayNum ++;
    openMedium();
    openMafia();
    Vc.muteAll(client);

    //storage for ppls moves
    let nightActions = new Map();
    
    //dm people for their moves
    for(let player of players.values()){
        //exceptions (veteran, bus driver, bodyguard, vigilante, arsonist, doctor)
        if(player.role === "Veteran" && player.data.alerts > 0){
            Dm.askAlert(client, player.id, player.data.alerts, (_alert)=>{
                if(_alert == 1){
                    player.data.alerts -= 1;
                }
                nightActions.set(player.id, _alert);
            });
        }
        else if(player.role === "Bus Driver"){
            Dm.askBusDriver(client, player.id, getPlayerIds(), (targets)=>{
                nightActions.set(player.id, targets);
            });
        }
        else if(player.role === "Vigilante" && player.data.bullets > 0){
            Dm.askMove(client, player.id, 1, getPlayerIds().filter(item => item !== player.id), (target)=>{
                nightActions.set(player.id, target);
                if(target != 0){
                    player.data.bullets -= 1;
                }
            });
            
        }
        else if(player.role === "Doctor"){
            Dm.askMove(client, player.id, 1, getPlayerIds().filter(item => item !== player.data.prevId), (target)=>{
                nightActions.set(player.id, target);
            });
        }
        else if(player.role === "Bodyguard"){
            Dm.askBodyGuard(client, player.id, getPlayerIds().filter(item => item!== player.id), player.data.vests, (response)=>{
                nightActions.set(player.id, response);
            });
        }
        else if(player.role === "Arsonist"){
            Dm.askArsonist(client, player.id, getPlayerIds().filter(item => item !== player.id), (response)=>{
                nightActions.set(player.id, response);
            });
        }


        //asking mafia members who cannot choose each other
        else if(player.role === "Consort" || player.role === "Consigliere" || 
                player.role === "Mafioso" || (player.role === "Godfather" && noMafioso())){

            Dm.askMove(client, player.id, 1, getNonMafia(), (target) =>{
                nightActions.set(player.id, target);
            });
        }


        //asking people who can unconditionally choose someone excluding themselves
        else if(player.role === "Escort" || player.role === "Sheriff" || player.role === "Tracker" ||
                player.role === "Serial Killer"){

            Dm.askMove(client, player.id, 1, getPlayerIds().filter(item => item !== player.id), (target)=>{
                nightActions.set(player.id, target);
            });
        }


        //asking people who can unconditionally choose someone else INCLUDING themselves
        else if(player.role === "Lookout"){

            Dm.askMove(client, player.id, 1, getPlayerIds(), (target)=>{
                nightActions.set(player.id, target);
            });
        }
    }

    


}





//checks if the game is over based on who is still alive
function checkWin(){

    //if only mafia left
    let mafiaWin = true;
    for(let player of players.values()){
        if(!(player.data.alignment === "Mafia")){
            mafiaWin = false;
        }
    }
    if(mafiaWin){
        endgame("mafia");
    }

    //if only town left
    let townWin = true;
    for(let player of players.values()){
        if(!(player.data.alignment === "Town")){
            townWin = false;
        }
    }
    if(townWin){
        //endgame("town");
    }


    //if only one neutral left (not jester)   ////note: jester needs separate win code!
    if(players.size == 1 && players.values().next().value.data.alignment == "Neutral"){
        endgame(players.values().next().value.role);
    }

}



function endgame(winner){
    gameOver = true;
    Timer.stopTimer();
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


//function that returns all alive player ids in an array
function getPlayerIds(){
    let arr = [];
    for(let playerId of players.keys()){
        arr.push(playerId);
    }
    return arr;
}

//returns an array of all alive non-mafia players
function getNonMafia(){
    let arr = [];
    for(let player of players.values()){
        if(player.data.alignment !== "Mafia"){
            arr.push(player.id);
        }
    }
    return arr;
}


//function that checks if a mafioso is alive
function noMafioso(){
    let mafiosoAlive = false;
    for(let player of players.values()){
        if(player.role === "Mafioso"){
            mafiosoAlive = true;
        }
    }
    return !mafiosoAlive;
}

//function that checks if godfather is alive
function noGodfather(){
    let godfatherAlive = false;
    for(let player of players.values()){
        if(player.role === "Godfather"){
            godfatherAlive = true;
        }
    }
    return !godfatherAlive;
}

//checks if a mafioso promotion is in order
function promoteMafioso(){
    if(noMafioso() && noGodfather()){
        //promote at random
        //first, find all candidates
        let candidates = [];
        for(let player of players.values()){
            if(player.data.alignment === "Mafia"){
                candidates.push(player.id);
            }
        }


        //if no mafia left
        if(candidates.length == 0){
            return;
        }
        else if(candidates.length == 1){
            promote(candidates[0]);
        }
        else{
            promote(candidates[Math.floor(Math.random() * candidates.length)]);
        }
    }
}

//actually promotes someone to mafioso
function promote(id){
    players.get(id).setRole("Mafioso");
    Dm.dmMessage(client, id, "**You have been promoted to Mafioso!**");
}

function openMafia(){
    let channel = client.channels.cache.get(mafiaChannel);
    for(let player of players.values()){
        if(player.data.alignment === "Mafia"){
            channel.updateOverwrite(player.id, {VIEW_CHANNEL: true});
        }
    }
}

function closeMafia(){
    let channel = client.channels.cache.get(deadSea);
    channel.overwritePermissions([
        {
            id: guild,
            deny: ['VIEW_CHANNEL']
        },
        {
            id: botId,
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS']
        }
    ])
}

function openMedium(){
    let channel = client.channels.cache.get(deadSea);
    for(let player of players.values()){
        if(player.role === "Medium"){
            channel.updateOverwrite(player.id, {VIEW_CHANNEL: true});
        }
    }
}

function closeMedium(){
    let channel = client.channels.cache.get(deadSea);
    channel.overwritePermissions([
        {
            id: guild,
            deny: ['VIEW_CHANNEL']
        },
        {
            id: botId,
            allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS']
        },
        //allowing dead ppl to talk still
        {
            id: '833756181985886280',
            allow: ['VIEW_CHANNEL']
        }
    ])
}

function resetChannels(){
    Announce.clearTown(client);
    Ld.clearGraveyard(client);

    //clear mafia channel
    let _mafia = client.channels.cache.get(mafiaChannel);
    _mafia.messages.fetch({limit: 100}).then(messages =>{
        _mafia.bulkDelete(messages);
    })
    
    //clear deadsea
    let _deadSea = client.channels.cache.get(deadSea);
    _deadSea.messages.fetch({limit: 100}).then(messages =>{
        _deadSea.bulkDelete(messages);
    })
}


