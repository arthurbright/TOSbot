const { Client } = require('discord.js');
const Timer = require('./timer.js');
const dayLength = 20;

//town channel constant
const town = '833755900098379837'
// Emojis
const nooseThink = '839900389989679125';

function sendTown(client, message){
    channel = client.channels.cache.get(town);
    channel.send(message);
}

async function announceDay(client, num, cback){
    channel = client.channels.cache.get(town);
    await channel.send("**It is now day " + num + ".**");
    Timer.setTimer(client, dayLength, cback);
}

async function announceNight(client, num, cback){
    channel = client.channels.cache.get(town);
   await channel.send("**It is now night " + num + ".**");
    Timer.setTimer(client, dayLength, cback);
}

async function revealMayor(client, targetId){
    username = client.users.cache.get(targetId).username;
    channel = client.channels.cache.get(town);
    await channel.send("**" + client.users.cache.get(targetId).username + " **has officially revealed themselves as mayor!");
}



//game end/start announcements
function announceTownWin(client){
    channel = client.channels.cache.get(town);
    channel.send("Town has won!");
}

function announceMafiaWin(client){
    channel = client.channels.cache.get(town);
    channel.send("Mafia has won!");
}

function announceNeutralWin(client, rolename){
    channel = client.channels.cache.get(town);
    channel.send("The " + rolename + " has won!");
}


//start a poll to see whos playing
pollMessage = null;

async function pollPlayers(client){
    channel = client.channels.cache.get(town);
    pollMessage = await channel.send("NEW GAM STARTING! React to play (dont actually react this is a test)");
}

//get a list of users that have reacted to the message to start the game
function getPlayers(client){
    //if poll hasnt been created yet
    if(pollMessage == null){
        return [];
    }
    
    //if no reactions
    if(pollMessage.reactions.resolve(nooseThink) == null){
        return [];
    }

    users = [];
    for(let user of pollMessage.reactions.resolve(nooseThink).users.cache.keys()){
        users.push(user);
    }
    return users;
   
    

}

function clearTown(client){
    //stop timer, to prevent error
    pollMessage = null;
    Timer.stopTimer();
    channel = client.channels.cache.get(town);
    channel.messages.fetch({limit: 100}).then(messages =>{
        for(let msg of messages.values()){
            if(!(msg.id === '846949433291571221')){
                msg.delete();
            }
        }
    })
}

module.exports.announceDay = announceDay;
module.exports.announceNight = announceNight;
module.exports.revealMayor = revealMayor;
module.exports.clearTown = clearTown;
module.exports.announceTownWin = announceTownWin;
module.exports.announceMafiaWin = announceMafiaWin;
module.exports.announceNeutralWin = announceNeutralWin;
module.exports.pollPlayers = pollPlayers;
module.exports.getPlayers = getPlayers;
module.exports.sendTown = sendTown;