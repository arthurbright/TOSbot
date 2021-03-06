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
const Rolegen = require("./modules/rolegen.js");
const selectTarget = require("./modules/selectTarget.js");


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
let playersCache = new Map();
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

            //assign roles and dm roles to players
            let roleList = selectTarget.shuffle(Rolegen.generateRoles(users.length));
            for(let i = 0; i < users.length; i ++){
                players.get(users[i]).setRole(roleList[i]);
                Dm.dmRole(client, users[i], roleList[i]);
            }

            //start the first day
            gameOver = false;
            for(let player in players.values()){
                playersCache.set(player.id, player.data.alignment);
            } //store cache of all players for end (dm ppl who won/lost)
            startDay();
        }

        if(args[1] === "clear"){
            resetChannels();
        }

        //debug functions
        if(args[1] === "gen"){
            console.log(Rolegen.generateRoles(2));
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
                endgame("Jester");
            }

            players.delete(lynchee);

        }
        else{
            Announce.sendTown(client, "**No one was lynched today!**");
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
    //storage for ppls moves
    let nightActions = new Map();

    //storage for who visited who
    let visit = new Map();
    let visited = new Map();

    Announce.announceNight(client, dayNum, () =>{
        //end of night cycle

        //TODO: reset temp fields for each player: blocked, tattack, tdefense, as well as
        //visited and visit maps
        for(let player of players.values()){
            //store the temporary (t) attack and defense each night
            player.data.tattack = 0;
            player.data.tdefense = 0;
            //store the role of who attacked/defended
            player.data.attacker = "";
            player.data.defender = "";

            player.data.allAttacks = [];
            player.data.allDefenses = [];  //store pairs [id, power] just so we can send messages after

            //store who visited who/
            visit.set(player.id, []);
            visited.set(player.id, []);

            

        }

        //CALCULATIONS
        //Priority 1

        //vigilante suicide (UNSTOPPABLE ATTACK ON THEMSELF)
        for(let playerId of selectTarget.allRole("Vigilante")){
            if(players.get(playerId).data.suicidal == true){
                players.get(playerId).attack(playerId, 10);
            }
        }

        //bus driver (EXECUTES NO MATTER WHAT)
        for(let playerId of selectTarget.allRole("Bus Driver")){
            let actions = nightActions.get(playerId);
            if(actions[0] != 0){
                //update visits
                visit.get(playerId).push(actions[0]);
                visit.get(playerId).push(actions[1]);
                visited.get(actions[0]).push(playerId);
                visited.get(actions[1]).push(playerId);

                //send messages
                Dm.dmMessage(client, actions[0], GameMessages.presets.busDriver.target);
                Dm.dmMessage(client, actions[1], GameMessages.presets.busDriver.target);

                //swap all actions bewtween the players with id actions[0] and actions[1]
                for(let [id, _nightAction] of nightActions.entries()){
                    //for double input actions
                    if(typeof(_nightAction) === 'object'){
                        if(_nightAction[0] === actions[0]){
                            nightActions.set(id, [actions[1], _nightAction[1]]);
                        }
                        else if(_nightAction[0] === actions[1]){
                            nightActions.set(id, [actions[0], _nightAction[1]]);
                        }

                        if(_nightAction[1] === actions[0]){
                            nightActions.set(id, [_nightAction[0], actions[1]]);
                        }
                        else if(_nightAction[1] === actions[1]){
                            nightActions.set(id, [_nightAction[0], actions[0]]);
                        }
                        
                    }
                    //for single input actions
                    else if(typeof(_nightAction) === 'string'){
                        if(_nightAction === actions[0]){
                            nightActions.set(id, actions[1]);
                        }
                        else if(_nightAction === actions[1]){
                            nightActions.set(id, actions[0]);
                        }
                    }
                }

            }
        }


        //NOTE: if doctor decides to not save anyone, store prevId as -1, not 0.


        //consort blocking
        for(let playerId of selectTarget.allRole("Consort")){
            let action = nightActions.get(playerId);
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                //if its not a serial killer or vet
                if(players.get(action).role !== "Serial Killer" && players.get(action).role !== "Veteran"){

                    if(nightActions.has(action)){
                        if(typeof(nightActions.get(action)) === "object"){
                            if(nightActions.get(action)[0] != 0){
                                Dm.dmMessage(client, action, GameMessages.presets.consort.target);
                            }
                            nightActions.set(action, [0, 0]);
                        }
                        else{
                            if(nightActions.get(action) != 0){
                                Dm.dmMessage(client, action, GameMessages.presets.consort.target);
                            }
                            nightActions.set(action, 0); //removes their action
                        }
                    }

                    

                }

                //if it is a serial killer, die 
                if(players.get(action).role === "Serial Killer"){
                    players.get(playerId).attack(action, 1);
                }
            }
        }

        //escort blocking
        for(let playerId of selectTarget.allRole("Escort")){
            let action = nightActions.get(playerId);
            //check if they took an action
            if(action != 0){

                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                //if its not a serial killer or vet
                if(players.get(action).role !== "Serial Killer" && players.get(action).role !== "Veteran" && players.get(action).role !== "Consort"){

                    if(nightActions.has(action)){
                        if(typeof(nightActions.get(action)) === "object"){
                            if(nightActions.get(action)[0] != 0){
                                Dm.dmMessage(client, action, GameMessages.presets.escort.target);
                            }
                            nightActions.set(action, [0, 0]);
                        }
                        else{
                            if(nightActions.get(action) != 0){
                                Dm.dmMessage(client, action, GameMessages.presets.escort.target);
                            }
                            nightActions.set(action, 0); //removes their action
                        }
                    }        
                }
                //if it is a serial killer, die
                if(players.get(action).role === "Serial Killer"){
                    players.get(playerId).attack(action, 1);
                }
                //if it is a consort, tell them
                if(players.get(action).role === "Consort"){
                    Dm.dmMessage(client, action, "Someone tried to role-block you!");
                }
            }
        }


        //PROTECTIVES (Doctor, bodyguard) --> on second thought, bodyguard should go LAST, along with intel
        //Doctor
        for(let playerId of selectTarget.allRole("Doctor")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                players.get(action).defend(playerId, 2);
                players.get(playerId).data.prevId = action; //store the person they previously protected so they cant do it again next night
            }
            else{
                players.get(playerId).data.prevId = -1;
            }
        }

        //Arsonist
        for(let playerId of selectTarget.allRole("Arsonist")){
            let action = nightActions.get(playerId);
            
            
            if(action[0] == 1){
                //douse!
                //update visits
                visit.get(playerId).push(action[1]);
                visited.get(action[1]).push(playerId);

                players.get(action[1]).data.doused = true;
            }
            else if(action[0] == 2){
                //ignite! give unstoppable attack to all doused
                for(let dousedPlayerId of selectTarget.getTargets(p => {return p.data.doused == true})){
                    players.get(dousedPlayerId).attack(playerId, 3);
                }

            }
        }

        //ATTACKERS
        //Vigilante killing
        for(let playerId of selectTarget.allRole("Vigilante")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                players.get(action).attack(playerId, 1);
            }
        }

        //Serial Killer
        for(let playerId of selectTarget.allRole("Serial Killer")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                players.get(action).attack(playerId, 1);
            }
        }

        //Mafioso
        for(let playerId of selectTarget.allRole("Mafioso")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                players.get(action).attack(playerId, 1);
            }
        }

        //Godfather
        for(let playerId of selectTarget.allRole("Godfather")){
            let action = nightActions.get(playerId);
            
            if(action != 0 && noMafioso()){ //gotta be no mafioso for godfather to attack
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                players.get(action).attack(playerId, 1);
            }
        }


        let bodyguardId = "";
        let guarded = "";
        //Bodyguard
        for(let playerId of selectTarget.allRole("Bodyguard")){
            let action = nightActions.get(playerId);
            //action: [vest, target]

            //if vest, increase defense
            if(action[0] == 1){
                players.get(playerId).defend(playerId, 1);
            }

            //if defending someone, redirect all attacks
            if(action[1] != 0){
                //update visits
                visit.get(playerId).push(action[1]);
                visited.get(action[1]).push(playerId);


                //store ids for calculation later
                guarded = action[1];
                bodyguardId = playerId;
            }
            
        }

        //variable to help

        //INTEL: sherrif, consig, tracker, lookout
        //Sheriff
        for(let playerId of selectTarget.allRole("Sheriff")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                let targetPlayer = players.get(action);

                if(targetPlayer.data.alignment === "Town" || targetPlayer.role === "Godfather" || targetPlayer.role === "Arsonist" || targetPlayer.role === "Jester"){
                    Dm.dmMessage(client, playerId, "**Your target is NOT suspicious!**");
                }
                else{
                    Dm.dmMessage(client, playerId, "**Your target is SUSPICIOUS!**");
                }
                
            }
        }

        //Consigliere
        for(let playerId of selectTarget.allRole("Consigliere")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);

                Dm.dmMessage(client, playerId, "**Your target is a " + players.get(action).role + "!**");
                
            }
        }

        //add the trackers and lookouts to the visited maps first, but no action yet
         //Lookout
         for(let playerId of selectTarget.allRole("Lookout")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);
            }
        }

         //Tracker
        for(let playerId of selectTarget.allRole("Tracker")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                //update visits
                visit.get(playerId).push(action);
                visited.get(action).push(playerId);
            }
        }


        //now, actually returning intel
        //Lookout
        for(let playerId of selectTarget.allRole("Lookout")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                Dm.dmMessage(client, playerId, GameMessages.lookoutMsg(client, visited.get(action)));
                
            }
        }

         //Tracker
        for(let playerId of selectTarget.allRole("Tracker")){
            let action = nightActions.get(playerId);
            
            if(action != 0){
                Dm.dmMessage(client, playerId, GameMessages.trackerMsg(client, visit.get(action)));
                
            }
        }

        //Veteran
        for(let playerId of selectTarget.allRole("Veteran")){
            let action = nightActions.get(playerId);
            let vetAttacked = false;
            if(action == 1){
                //attack all who visited, and also increase defense
                players.get(playerId).defend("Veteran", 1);
                for(let p of visited.get(playerId)){
                    if(players.get(p).role === "Tracker") continue; //tracker immune to vet
                    players.get(p).attack(playerId, 2);
                    vetAttacked = true;
                }
                
            }

            //send the vet a message if they were visited on alert
            if(vetAttacked == true){
                Dm.dmMessage(client, playerId, GameMessages.presets.veteran.you);
            }
        }

        let transferredAttacks = [];
        //transfer attacks to bodyguard
        if(guarded !== ""){
            transferedAttacks = players.get(guarded).data.allAttacks;
            players.get(guarded).data.allAttacks = []; 
        }


        /////////////////////////////////////////////////////////////////////////////////////////////ALL TAGS ASSIGNED, START KILLING AND SEND MSGS
        let purge = []; //ids of all players who are dead

        for(let player of players.values()){
            //defense too high messages / you were attacked but defense saved you
            for(let attackAttempt of player.data.allAttacks){
                if(attackAttempt[1] <= player.getDefense()){
                    Dm.dmMessage(client, attackAttempt[0], GameMessages.presets.highDefense);
                }
                //if their default defense was already too high
                if(attackAttempt[1] <= player.data.def && player.data.def == player.getDefense()){
                    Dm.dmMessage(client, player.id, "Someone attacked you but your defense was too high!");
                }
            }

            //successful attack (highest attack power)
            if(player.data.tattack > player.getDefense()){
                Dm.dmMessage(client, player.id, "**You were killed by a(n) " + players.get(player.data.attacker).role + "!**" );
                purge.push(player.id);
            }
            
            //defense messages (doctor, bodyguard)
            //doctor
            
            if(player.data.defender !== "" && players.get(player.data.defender).role === "Doctor" && player.data.tattack <= 2 && player.data.tattack > player.data.def){
                Dm.dmMessage(client, player.id, GameMessages.presets.doctor.target);
                Dm.dmMessage(client, player.data.defender, GameMessages.presets.doctor.you);
            }
            

            //bodyguard
            if(transferredAttacks.length > 0){
                Dm.dmMessage(client, guarded, GameMessages.presets.bodyguard.target);
                Dm.dmMessage(client, bodyguardId, GameMessages.presets.bodyguard.you);
            }


        }

        for(let id of purge){
            Ld.killPlayer(client, id, players.get(id).role);
            players.delete(id);
        }

        //NIGHT LOGIC ENDS HERE

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
        else if(player.role === "Veteran" && player.data.alerts == 0){ //null report for vet
            nightActions.set(player.id, 0)
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
        else if(player.role === "Vigilante" && player.data.bullets == 0){ //null report for vig
            nightActions.set(player.id, 0);
        }
        else if(player.role === "Doctor"){
            Dm.askMove(client, player.id, 1, getPlayerIds().filter(item => item !== player.data.prevId), (target)=>{
                nightActions.set(player.id, target);
            });
        }
        else if(player.role === "Bodyguard"){
            Dm.askBodyGuard(client, player.id, getPlayerIds().filter(item => item!== player.id), player.data.vests, (response)=>{
                if(player.data.vests == 0){
                    nightActions.set(player.id, [0, response[1]])
                }
                else{
                    if(response[0] == 1){
                        player.data.vests -= 1;
                    }
                    nightActions.set(player.id, response);
                }
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
        return;
    }

    //if only town left
    let townWin = true;
    for(let player of players.values()){
        if(!(player.data.alignment === "Town")){
            townWin = false;
        }
    }
    if(townWin){
        endgame("town");
        return;
    }


    //if only one neutral left (not jester)   ////note: jester needs separate win code!
    if(players.size == 1 && players.values().next().value.data.alignment == "Neutral"){
        endgame(players.values().next().value.role);
        return;
    }

    //stalemate breaking
    if(players.size == 2){
        //frequency list of remaining roles
        //1        2            4         8       16        32
        //arsonist serialkiller godfather mafioso busdriver escort
        let remaining = 0;
        
        for(let player of players.values()){
            if(player.role === "Arsonist"){
                remaining += 1;
            }
            else if(player.role === "Serial Killer"){
                remaining += 2;
            }
            else if(player.role === "Godfather"){
                remaining += 4;
            }
            else if(player.role === "Mafioso"){
                remaining += 8;
            }
            else if(player.role === "Bus Driver"){
                remaining += 16;
            }
            else if(player.role === "Escort"){
                remaining += 32;
            }
        }

        //cases
        if(remaining % 2 == 1){
            endgame("Arsonist"); 
        }
        else if((remaining / 2) % 2 == 1){
            endgame("Serial Killer");
        }
        else if((remaining/4) % 2 == 1){
            endgame("mafia");
        }
        else if(remaining == 24){
            endgame("town")
        }
        else if(remaining == 40){
            endgame("mafia");
        }
        


    }

}



function endgame(winner){
    gameOver = true;
    Timer.stopTimer();
    players = new Map();
    playersCache = new Map();
    dayNum = 1;
    Ld.reset(client);

    //do perms for mafia and medium TODO

    if(winner === "mafia"){
        Announce.announceWin(client, "Mafia");
        //message all mafia that they won
        for(let [id, alignment] of playersCache.entries()){
            if(alignment === "Mafia"){
                Dm.dmMessage(client, id, GameMessages.presets.youWin);
            }
            else{
                Dm.dmMessage(client, id, GameMessages.presets.youLose);
            }
        }
    }
    else if(winner === "town"){
        Announce.announceWin(client, "Town");
        //message all town that they won
        for(let [id, alignment] of playersCache.entries()){
            if(alignment === "Town"){
                Dm.dmMessage(client, id, GameMessages.presets.youWin);
            }
            else{
                Dm.dmMessage(client, id, GameMessages.presets.youLose);
            }
        }
    }
    //if a neutral wins, pass winner = role name
    else{
        Announce.announceWin(client, winner);
        //message the remaining neutral
        for(let player of players.values()){
            if(player.role === winner){
                Dm.dmMessage(client, player.id, GameMessages.presets.youWin);
            }
            else{
                Dm.dmMessage(client, player.id, GameMessages.presets.youLose);
            }
        }
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
    let dousedd = players.get(id).data.doused;
    players.get(id).setRole("Mafioso");
    players.get(id).data.doused = dousedd; //maintain dousage
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
    let channel = client.channels.cache.get(mafiaChannel);
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

//id to username
function getUsername(id){
    return client.users.cache.get(id).username;
}




