const { Client } = require('discord.js');
const graveyard = '833756094449975376';
const guild = '758155951240642572';

msgs = [];

//function to get the alive role
function getAliveRole(client){
    var roleAlive = client.guilds.cache.get(guild).roles.cache.find((role) =>{
        return role.name === "alive";
    });
    return roleAlive;
}

//function to get the dead role
function getDeadRole(client){
    var roleDead = client.guilds.cache.get(guild).roles.cache.find((role) =>{
        return role.name === "dead";
    });
    return roleDead;
}


//kill a person
function kill(message){
    target = message.mentions.users.first();
    member = message.guild.members.cache.get(target.id);

    roleAlive = getAliveRole();
    roleDead = getDeadRole();
        
    member.roles.remove(roleAlive);
    member.roles.add(roleDead);
    
    //channel = client.channels.cache.get(graveyard);
    message.channel.send(target.username + " was killed!");
    message.delete();
}

//revive a person
function revive(message){
    target = message.mentions.users.first();
    member = message.guild.members.cache.get(target.id);

    roleAlive = getAliveRole();
    roleDead = getDeadRole();
        
    member.roles.add(roleAlive);
    member.roles.remove(roleDead);

    //channel = client.channels.cache.get(graveyard);
    message.channel.send(target.username + " has been revived!");
    message.delete();
}

//revive everyone
function reviveAll(message){
    roleAlive = getAliveRole();
    roleDead = getDeadRole();

    for(member of message.guild.members.cache.values()){
        member.roles.add(roleAlive);
        member.roles.remove(roleDead);
    } 

    //channel = client.channels.cache.get(graveyard);
    message.channel.send("*Shine once more, before the end.*  (~20s)");
    message.delete();
}

//kill a person (api) and send message in graveyard
async function killPlayer(client, targetId, roleName){
    roleAlive = getAliveRole(client);
    roleDead = getDeadRole(client);

    target = client.users.cache.get(targetId);
    member = client.guilds.cache.get(guild).members.cache.get(targetId);

    member.roles.remove(roleAlive);
    member.roles.add(roleDead);

    channel = client.channels.cache.get(graveyard);
    msgs.push(await channel.send("**" + target.username + " was killed. They were a " + roleName + ".**"));
}

//lynch a person (api) and send message in graveyard
async function lynch(client, targetId, roleName){
    roleAlive = getAliveRole(client);
    roleDead = getDeadRole(client);

    target = client.users.cache.get(targetId);
    member = client.guilds.cache.get(guild).members.cache.get(targetId);

    member.roles.remove(roleAlive);
    member.roles.add(roleDead);

    channel = client.channels.cache.get(graveyard);
    msgs.push(await channel.send("**" + target.username + " was lynched. They were a " + roleName + ".**"));
}

//revive all (api)
async function reset(client){
    roleAlive = getAliveRole(client);
    roleDead = getDeadRole(client);

    for(member of client.guilds.cache.get(guild).members.cache.values()){
        member.roles.add(roleAlive);
        member.roles.remove(roleDead);
    } 

    //channel = client.channels.cache.get(graveyard);
    channel = client.channels.cache.get(graveyard);
    //msgs.push(await channel.send("*Shine once more, before the end.*  (Reiving all, ~20s)"));
    //clearGraveyard(client);
}

//clear graveyard messages
function clearGraveyard(client){
    let channel = client.channels.cache.get(graveyard);
    channel.messages.fetch({limit: 100}).then(messages =>{
        channel.bulkDelete(messages);
    })
}



//exports
module.exports.kill = kill;
module.exports.revive = revive;
module.exports.reviveAll = reviveAll;
module.exports.killPlayer = killPlayer;
module.exports.reset = reset;
module.exports.clearGraveyard = clearGraveyard;
module.exports.lynch = lynch;