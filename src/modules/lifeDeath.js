const { Client } = require('discord.js');

function kill(client, message){
    target = message.mentions.users.first();
    member = message.guild.members.cache.get(target.id);

    var roleDead = message.guild.roles.cache.find((role) =>{
        return role.name === "dead";
    });

    var roleAlive = message.guild.roles.cache.find((role) =>{
        return role.name === "alive";
    });
        
    member.roles.remove(roleAlive);
    member.roles.add(roleDead);
    
    message.channel.send(target.username + " was killed!");
    message.delete();
}

function revive(client, message){
    target = message.mentions.users.first();
    member = message.guild.members.cache.get(target.id);

    var roleDead = message.guild.roles.cache.find((role) =>{
        return role.name === "dead";
    });

    var roleAlive = message.guild.roles.cache.find((role) =>{
        return role.name === "alive";
    });
        
    member.roles.add(roleAlive);
    member.roles.remove(roleDead);
    message.delete();
}

function reviveAll(client, message){
    var roleDead = message.guild.roles.cache.find((role) =>{
        return role.name === "dead";
    });

    var roleAlive = message.guild.roles.cache.find((role) =>{
        return role.name === "alive";
    }); 

    for(member of message.guild.members.cache.values()){
        member.roles.add(roleAlive);
        member.roles.remove(roleDead);
    } 

    message.delete();
}




module.exports.kill = kill;
module.exports.revive = revive;
module.exports.reviveAll = reviveAll;