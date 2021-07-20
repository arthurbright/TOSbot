const { Client } = require('discord.js');
const Discord = require('discord.js');
const Timer = require('./timer.js');
const dayLength = 30;

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
    let m = new Discord.MessageEmbed();
    m.setTitle("**It is now day " + num + ".**");
    m.setColor('#00f7ff');
    m.setThumbnail('https://lh3.googleusercontent.com/proxy/xAz41zxuJ1zHiqgZIHX8fd2tQkAzNHQWIFWcNA4LfZCan6O04SGaBLxrhjJvQT7Pi8WVITQYqmwJ2S3zvVftsvvvsg_Me7U');
        
    await channel.send(m);
    Timer.setTimer(client, dayLength, cback);
}

async function announceNight(client, num, cback){
    channel = client.channels.cache.get(town);
    let m = new Discord.MessageEmbed();
    m.setTitle("**It is now night " + num + ".**");
    m.setColor('#000fb3');
    m.setImage('https://i.pinimg.com/originals/66/dc/a4/66dca49beb2de489397541e5fd414e40.png');
    
    await channel.send(m);
    Timer.setTimer(client, dayLength, cback);
}

async function revealMayor(client, targetId){
    username = client.users.cache.get(targetId).username;
    channel = client.channels.cache.get(town);
    await channel.send("**" + client.users.cache.get(targetId).username + " **has officially revealed themselves as mayor!");
}



//game end/start announcements
function announceWin(client, rolename){
    channel = client.channels.cache.get(town);
    let m = new Discord.MessageEmbed();
    m.setTitle("**The " + rolename + " has won!**");
    m.setColor('#00c724');
    channel.send(m);
}


//start a poll to see whos playing
pollMessage = null;

async function pollPlayers(client){
    channel = client.channels.cache.get(town);
    let m = new Discord.MessageEmbed();
    m.setTitle("**NEW GAME STARTING!**");
    m.setDescription("React with :noosethink: to join.")
    m.setColor('#00c724');
    m.setThumbnail('https://linustechtips.com/uploads/monthly_2016_06/Fedora.png.09a1171bb34f97ac359174c208823451.png');
    pollMessage = await channel.send(m);
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

async function clearTown(client){
    //stop timer, to prevent error
    pollMessage = null;
    Timer.stopTimer();
    let channel = client.channels.cache.get(town);

    let fetched;
    do {
        fetched = await channel.messages.fetch({limit: 100});
        channel.bulkDelete(fetched);
    }
    while(fetched.size >= 2);
    

    channel.send("Link to all QZ TOS stuff can be found on this spreadsheet: https://docs.google.com/spreadsheets/d/1zwt9nlO-yL4k66AEmCt1nEkj2_CFdKm4aiPvjqEjNog/edit?usp=drive_web&ouid=109648472470184497419");
}

module.exports.announceDay = announceDay;
module.exports.announceNight = announceNight;
module.exports.revealMayor = revealMayor;
module.exports.clearTown = clearTown;
module.exports.announceWin = announceWin;
module.exports.pollPlayers = pollPlayers;
module.exports.getPlayers = getPlayers;
module.exports.sendTown = sendTown;