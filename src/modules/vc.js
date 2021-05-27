const {Client} = require('discord.js');
const town = '833756317654843443';

//mute all users in town
function muteAll(client){
    let channel = client.channels.cache.get(town);
    for (let member of channel.members) {
        //console.log(member);
        member[1].voice.setMute(true)
    }
}

//unmute all users in town
function unmuteAll(client){
    let channel = client.channels.cache.get(town);
    for (let member of channel.members) {
        member[1].voice.setMute(false)
    }
}

module.exports.muteAll = muteAll;
module.exports.unmuteAll= unmuteAll;