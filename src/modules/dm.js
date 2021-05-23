const { Client } = require('discord.js');


function askMove(client, targetId, numChoices, players, callback){
       //create message
    str = "Select your target(s) for tonight by responding with their number:";
    for(i = 1; i <= players.length; i ++){
        str += "\n" + i + ". " + players[i];
    }

    //filter to make sure message is a valid number in the list
    const filter = m => {
        return 1 <= parseInt(m.content) && parseInt(m.content) <= players.length;
    }

    //send message and await response
   client.users.cache.get(targetId).send(str).then((message) => {
        console.log("Sent DM to userId " + targetId);
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 9000000,
            errors: ['time']
        })
        .then((message) => {
            console.log("UserId " + targetId + " responded with: " + message.values().next().value.content);
            callback(message.values().next().value.content); //TODO
        })
   });
    
}

module.exports = askMove;



