const { Client } = require('discord.js');
const timer = require('./timer.js');

const town = '833755900098379837'

msgs = [];

async function announceDay(client, num){
    channel = client.channels.cache.get(town);
    msgs.push(await channel.send("**It is now day " + num + ".**"));
    timer.setTimer(client, 300);
}

async function announceNight(client, num){
    channel = client.channels.cache.get(town);
    msgs.push(await channel.send("**It is now night " + num + ".**"));
    timer.setTimer(client, 300);
}

module.exports.announceDay = announceDay;
module.exports.announceNight = announceNight;