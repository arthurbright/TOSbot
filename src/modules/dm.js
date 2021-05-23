const { Client } = require('discord.js');

const filter = m => m.content.startsWith('tos');
function askMove(client/*, target, numChoices, players*/, callback){
    client.users.cache.get('304651275423842314').send("this a dm").then((message) => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 9000000,
            errors: ['time']
        })
        .then((message) =>{
            //console.log(message.values().next().value.content);
            callback(message.values().next().value.content);
        })
    });
    
}

module.exports = askMove;



