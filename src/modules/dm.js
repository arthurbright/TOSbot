const { Client } = require('discord.js');
function msg(client){
    message = client.users.cache.get('304651275423842314').send("this a dm");
    console.log(message);
}

module.exports = msg;



