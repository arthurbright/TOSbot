const { Client } = require('discord.js');

//id to username
function getUsername(client, id){
    return client.users.cache.get(id).username;
}

//main function: provide list of id's to player in dms, return their choice of id
function askMove(client, targetId, numChoices, players, callback){

    //filter to make sure message is a valid number in the list
    const filter = m => {
        return 0 <= parseInt(m.content) && parseInt(m.content) <= players.length;
    }
    //second filter for bus driver, where they cannot choose 0
    const filter2 = m => {
        return 1 <= parseInt(m.content) && parseInt(m.content) <= players.length;
    }

    if(numChoices == 1){
        //create message
        str = "**Select your target for tonight by responding with their number:**\n0. None (skip)";
        for(i = 1; i <= players.length; i ++){
            str += "\n" + i + ". " + getUsername(client, players[i - 1]);
        }

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
                //if 0 response
                if(message.values().next().value.content === '0'){
                    client.users.cache.get(targetId).send("You have chosen to skip tonight.");
                    callback(0);
                }
                else{
                    target1 = players[parseInt(message.values().next().value.content) - 1];
                    client.users.cache.get(targetId).send("You have chosen **" + getUsername(client, target1) + "**!");
                    callback(target1);
                }
            })
        });
    }
    //for bus driver
    else if(numChoices == 2){
        //create message
        str = "**Select your first target for tonight:**\n0. None (skip)";
        for(i = 1; i <= players.length; i ++){
            str += "\n" + i + ". " + getUsername(client, players[i - 1]);
        }
        
        //first choice
        client.users.cache.get(targetId).send(str).then((message) => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 9000000,
                errors: ['time']
            })
            .then((message) => {
                //if zero response
                if(message.values().next().value.content === '0'){
                    client.users.cache.get(targetId).send("You have chosen to skip tonight.");
                    callback([0, 0]);
                }
                else{
                    target1 = players[parseInt(message.values().next().value.content) - 1];
                    //remove the chosen target
                    players.splice(parseInt(message.values().next().value.content) - 1, 1);
                    //second choice
                    str2 = "**Select your second target for tonight:**";
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
                            
                            target2 = players[parseInt(message.values().next().value.content) - 1];
                            client.users.cache.get(targetId).send("You have chosen to swap **" + getUsername(client, target1) + "** and **" + getUsername(client, target2) + "**!");
                            callback([target1, target2]);
                            
                        })
                    })
                }
            })
        });
    }   
}

function askAlert(client, targetId, alertsLeft, callback){
    str = "Would you like to alert tonight? You have " + alertsLeft + " alerts left.\n**Respond 'yes' to alert, and 'no' otherwise.**";
    const filter = m => {
       return m.content === 'yes' || m.content === 'no';
    }
    client.users.cache.get(targetId).send(str).then((message) => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 9000000,
            errors: ['time']
        })
        .then((message) => {
            if(message.values().next().value.content === 'yes'){
                client.users.cache.get(targetId).send("You are on alert!");
                callback(1);
            }
            else{
                client.users.cache.get(targetId).send("You are not on alert for tonight.");
                callback(0);
            }
        })
    });
}

module.exports.askMove = askMove;
module.exports.askAlert = askAlert;