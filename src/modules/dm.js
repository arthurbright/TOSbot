const { Client } = require('discord.js');

const filter = m => m.content.startsWith('tos');
function msg(client){
    client.users.cache.get('304651275423842314').send("this a dm").then((message) => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
        })
        .then((message) =>{
            console.log(message.content);
        })
    });
    
}

module.exports = msg;



