const { Client } = require('discord.js');

//function to get the alive role
function getAliveRole(message){
    var roleAlive = message.guild.roles.cache.find((role) =>{
        return role.name === "alive";
    });
    return roleAlive;
}

//function to get the dead role
function getDeadRole(message){
    var roleDead = message.guild.roles.cache.find((role) =>{
        return role.name === "dead";
    });
    return roleDead;
}


//kill a person
function kill(message){
    target = message.mentions.users.first();
    member = message.guild.members.cache.get(target.id);

    roleAlive = getAliveRole(message);
    roleDead = getDeadRole(message);
        
    member.roles.remove(roleAlive);
    member.roles.add(roleDead);
    
    message.channel.send(target.username + " was killed!");
    message.delete();
}

//revive a person
function revive(message){
    target = message.mentions.users.first();
    member = message.guild.members.cache.get(target.id);

    roleAlive = getAliveRole(message);
    roleDead = getDeadRole(message);
        
    member.roles.add(roleAlive);
    member.roles.remove(roleDead);

    message.channel.send(target.username + " has been revived!");
    message.delete();
}

//revive everyone
function reviveAll(message){
    roleAlive = getAliveRole(message);
    roleDead = getDeadRole(message);

    for(member of message.guild.members.cache.values()){
        member.roles.add(roleAlive);
        member.roles.remove(roleDead);
    } 
    message.channel.send("*Shine once more, before the end.*  (~20s)");
    message.delete();
}



//exports
module.exports.kill = kill;
module.exports.revive = revive;
module.exports.reviveAll = reviveAll;