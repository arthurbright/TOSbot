const { Client } = require('discord.js');
offset = 0;
member = null;
msg = null;

function updateTime(){
    time = Math.floor(offset - (Date.now()/1000));
    if(time < 0) time = 0;
    
    if(member == null || msg == null){
        return;
    }
    
    //set nickname method
    //member.setNickname("TOSbot || Time remaining: " + time);
    if(time > 0){
        msg.edit("**TIME REMAINING: " + time + " SECONDS**");
    }
    else{
        msg.edit("**TIME IS UP!**");
    }
    
}

function startTimer(client){
    setInterval(updateTime, 1100);
}

function setTimer(t, message){
    offset = Date.now()/1000 + t;
    member = message.guild.members.cache.get('844065886541185074');
    message.channel.send("**TIME REMAINING: " + t + " SECONDS**").then((m) =>{
        msg = m;
    })
    
}


module.exports.startTimer = startTimer;
module.exports.setTimer = setTimer;

