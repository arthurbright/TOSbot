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
                time: 299000,
                errors: ['time']
            })
            .then((message) => {
                //console.log("UserId " + targetId + " responded with: " + message.values().next().value.content);
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
            .catch(message =>{
                callback(0);
            });
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
                time: 299000,
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
                            time: 299000,
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
            time: 299000,
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
        .catch(message =>{
            callback(0);
        });
    });
}

function askVest(client, targetId, vestsLeft, callback){
    str = "Would you like to vest tonight? You have " + vestsLeft + " vests left.\n**Respond 'yes' to vest, and 'no' otherwise.**";
    const filter = m => {
       return m.content === 'yes' || m.content === 'no';
    }
    client.users.cache.get(targetId).send(str).then((message) => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 299000,
            errors: ['time']
        })
        .then((message) => {
            if(message.values().next().value.content === 'yes'){
                client.users.cache.get(targetId).send("You put on the vest!");
                callback(1);
            }
            else{
                client.users.cache.get(targetId).send("The vest is not used.");
                callback(0);
            }
        })
        .catch(message =>{
            callback(0);
        });
    });
}

function askBusDriver(client, targetId, players, callback){
    //filter to make sure input is valid (two distinct integers)
    const filter = m => {
        let args = m.content.split(" ");
        return (0 <= parseInt(args[0]) && parseInt(args[0]) <= players.length 
        && 0 <= parseInt(args[1]) && parseInt(args[1]) <= players.length 
        && parseInt(args[0]) != parseInt(args[1]));

    }
    
    //create message
    str = "**Choose two players to swap (ex. '2 4'). Respond '0 1' to skip:**";
    for(i = 1; i <= players.length; i ++){
        str += "\n" + i + ". " + getUsername(client, players[i - 1]);
    }

    //send message and await response
    client.users.cache.get(targetId).send(str).then((message) => {
        
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 299000,
            errors: ['time']
        })
        .then((message) => {
            //if 0 response
            let args = message.values().next().value.content.split(" ");
            if(args[0] === "0"){
                client.users.cache.get(targetId).send("You have chosen to skip tonight.");
                callback([0, 1]);
            }
            else{
                let target1 = players[parseInt(args[0]) - 1];
                let target2 = players[parseInt(args[1]) - 1];
                client.users.cache.get(targetId).send(getUsername(client, target1) + " and " + getUsername(client, target2) + " will be swapped tonight!");
                callback([target1, target2]);
            }
        })
        .catch(message =>{
            callback([0, 1]);
            console.log("bad");
        });
    });
    

}

function askArsonist(client, targetId, players, callback){
    //filter to make sure input is valid (two distinct integers)
    const filter = m => {
        let args = m.content.split(" ");
        //if they pass or ignite,, no second parameter needed
        if(args[0] === "0" || args[0] === "2"){
            return true;
        }
        else if(args[0] === "1"){
            return (1 <= parseInt(args[1]) && parseInt(args[1]) <= players.length);
        }
        return false;
    }
    
    //create message
    str = "**Respond '0' to skip. Respond '1 x' to douse someone, where x is the desired target. Respond '2' to ignite.**";
    for(i = 1; i <= players.length; i ++){
        str += "\n" + i + ". " + getUsername(client, players[i - 1]);
    }

    //send message and await response
    client.users.cache.get(targetId).send(str).then((message) => {
        
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 299000,
            errors: ['time']
        })
        .then((message) => {
            //if 0 response
            let args = message.values().next().value.content.split(" ");
            if(args[0] === "0"){
                client.users.cache.get(targetId).send("You have chosen to skip tonight.");
                callback([0, 0]);
            }
            else if(args[0] === "2"){
                client.users.cache.get(targetId).send("**They shall burn.**");
                callback([2, 0]);
            }
            else{
                let target = players[parseInt(args[1]) - 1];
                client.users.cache.get(targetId).send("You will douse " + getUsername(client, target) + " tonight!");
                callback([1, target]);
            }
        })
        .catch(message =>{
            callback([0, 0]);
        });
    });
}

function askBodyGuard(client, targetId, players, vestsLeft, callback){
    //filter to make sure input is valid (0/1 + target)
    const filter = m => {
        let args = m.content.split(" ");
        return (0 <= parseInt(args[0]) && parseInt(args[0]) <= 1 
        && 0 <= parseInt(args[1]) && parseInt(args[1]) <= players.length);
        
    }
    
    //create message
    str = "**Respond 'X Y'. X = 1 if you vest and 0 otherwise. Y = your target. If you do not want to protect anyone, Y = 0.**\nYou have " + vestsLeft + " vests left.";
    for(i = 1; i <= players.length; i ++){
        str += "\n" + i + ". " + getUsername(client, players[i - 1]);
    }

    //send message and await response
    client.users.cache.get(targetId).send(str).then((message) => {
        
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 299000,
            errors: ['time']
        })
        .then((message) => {
            
            let args = message.values().next().value.content.split(" ");
            if(args[0] === "0"){
                client.users.cache.get(targetId).send("No vest tonight!");
                if(args[1] === "0"){
                    callback([0, 0]);
                }
                else{
                    callback([0, players[parseInt(args[1]) - 1]]);
                }
            }
            else if(args[0] === "1"){
                client.users.cache.get(targetId).send("A vest will be equipped (if you have one).");
                if(args[1] === "0"){
                    callback([1, 0]);
                }
                else{
                    callback([1, players[parseInt(args[1]) - 1]]);
                }
            }
        })
        .catch(message =>{
            callback([0, 0]);
        });
    });
}



function dmRole(client, targetId, roleName){
    client.users.cache.get(targetId).send("**Hello! Your role for this game is " + roleName);
}

function dmMessage(client, targetId, message){
    client.users.cache.get(targetId).send(message);
}

module.exports.askMove = askMove;
module.exports.askAlert = askAlert;
module.exports.askVest = askVest;
module.exports.dmRole = dmRole;
module.exports.dmMessage = dmMessage;
module.exports.askBusDriver = askBusDriver;
module.exports.askArsonist = askArsonist;
module.exports.askBodyGuard = askBodyGuard;