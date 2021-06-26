const { Client } = require('discord.js');
offset = 0;
msg = null;
town = '833755900098379837';
callback = null;

function updateTime(){
    time = Math.floor(offset - (Date.now()/1000));
    if(time < 0) time = 0;
    
    if(msg == null || msg.deleted){
        return;
        
    }
    
    //set nickname method
    //member.setNickname("TOSbot || Time remaining: " + time);
    if(time > 0){
        msg.edit("**TIME REMAINING: " + time + " SECONDS**");
    }
    else{
        msg.edit("**TIME IS UP!**");
        callback();
        msg = null;
    }
    
}

//start the looping updates
function startTimer(){
    setInterval(updateTime, 2000);
}

//set the timer to a certain time
function setTimer(client, t, cback){
    offset = Date.now()/1000 + t;
    //member = message.guild.members.cache.get('844065886541185074');
    client.channels.cache.get(town).send("**TIME REMAINING: " + t + " SECONDS**").then((m) =>{
        msg = m;
    });
    callback = cback;
    
}

//get the current time
function getTime(){
    return Math.floor(offset - (Date.now()/1000));
}

function stopTimer(){
    msg = null;
}



module.exports.startTimer = startTimer;
module.exports.setTimer = setTimer;
module.exports.getTime = getTime;
module.exports.stopTimer = stopTimer;

