const { Client } = require('discord.js');

//id to username
function getUsername(client, id){
    return client.users.cache.get(id).username;
}

//main function: provide list of id's to player in dms, return their choice of id
function askMove(client, targetId, numChoices, players, callback){
       //create message
    str = "Select your target for tonight by responding with their number:\n0. None";
    for(i = 1; i <= players.length; i ++){
        str += "\n" + i + ". " + getUsername(client, players[i - 1]);
    }

    //filter to make sure message is a valid number in the list
    const filter = m => {
        return 0 <= parseInt(m.content) && parseInt(m.content) <= players.length;
    }
    //second filter for bus driver, where they cannot choose 0
    const filter2 = m => {
        return 1 <= parseInt(m.content) && parseInt(m.content) <= players.length;
    }

    if(numChoices == 1){
        //send message and await response (for normal ppl)
        client.users.cache.get(targetId).send(str).then((message) => {
            console.log("Sent DM to userId " + targetId);
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 9000000,
                errors: ['time']
            })
            .then((message) => {
                console.log("UserId " + targetId + " responded with: " + message.values().next().value.content);
                if(message.values().next().value.content === '0'){
                    callback(0);
                }
                else{
                    callback(players[parseInt(message.values().next().value.content) - 1]);
                }
            })
        });
    }
    //for bus driver
    else if(numChoices == 2){
        //first choice
        client.users.cache.get(targetId).send(str).then((message) => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 9000000,
                errors: ['time']
            })
            .then((message) => {
                if(message.values().next().value.content === '0'){
                    callback([0, 0]);
                }
                else{
                    target1 = players[parseInt(message.values().next().value.content) - 1];
                    //remove the chosen target
                    players.splice(parseInt(message.values().next().value.content) - 1, 1);
                    //second choice
                    str2 = "Select your second target for tonight:";
                    for(i = 1; i <= players.length; i ++){
                        str2 += "\n" + i + ". " + getUsername(client, players[i - 1]);
                    }
                    
                    //ask for second response
                    client.users.cache.get(targetId).send(str2).then((message) => {
                        message.channel.awaitMessages(filter2, {
                            max: 1,
                            time: 9000000,
                            errors: ['time']
                        })
                        .then((message) => {
                            callback([target1, players[parseInt(message.values().next().value.content) - 1]]);
                            
                        })
                    })
                }
            })
        });
    }   
}

module.exports = askMove;



