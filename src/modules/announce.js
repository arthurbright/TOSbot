const { Client } = require('discord.js');
const Timer = require('./timer.js');


const town = '833755900098379837'



async function announceDay(client, num){
    channel = client.channels.cache.get(town);
    await channel.send("**It is now day " + num + ".**");
    Timer.setTimer(client, 300);
}

async function announceNight(client, num){
    channel = client.channels.cache.get(town);
   await channel.send("**It is now night " + num + ".**");
    Timer.setTimer(client, 300);
}

async function revealMayor(client, targetId){
    username = client.users.cache.get(targetId).username;
    channel = client.channels.cache.get(town);
    await channel.send("**" + client.users.cache.get(targetId).username + " **has officially revealed themselves as mayor!");
}

function clearTown(client){
    //stop timer, to prevent error
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