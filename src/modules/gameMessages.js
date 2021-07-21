const presets = {
    /////////////////////////////////////TOWNSPEOPLE
    highDefense: "Your target's defence was too high!",
    youWin: "**Congrats! You won!**",
    youLose: "**You lost this game oof**",

    bodyguard : {
        you : "You were attacked while defending someone!",
        target : "Someone tried to attack you, but someone fought off your attacker!"
    },
    doctor : {
        you : "Someone tried to attack your target, but you saved them!",
        target : "Someone tried to attack you, but you were protected!"
    },
    mayor : {
        
    },
    medium : {
     
    },
    escort : {
        you : "You visited a serial killer! / Someone tried to role-block you!",
        target : "You were role-blocked!"
    },
    busDriver : {
        target : "You were transported!"
    },
    sheriff : {
        you : {
            sus : "Your target is suspicious!",
            notsus : "Your target is not suspicious!"
        }
    },
    lookout : {
        you : "",
    },
    tracker : {
        you : "",
    },
    veteran : {
        you : "At least one person visited you while you were on alert!",
        target : "You were shot visiting a veteran on alert!"
    },
    vigilante : {
        you : {
            suicide : "You committed suicide!",
            defence : "Your target's defence was too high!"
        },
        target : "You were shot by a vigilante."
    },


    ///////////////////////////////////////////////////MAFIA
    godfather : {
        you : "Your target's defence was too high!",
        target : "You were killed by the godfather."
    },
    mafioso : {
        you : "Your target's defence was too high!",
        target : "You were killed by the godfather."
    },
    consigliere : {
        you : ""
    },
    consort : {
        you : "You visited a serial killer!",
        target : "You were role-blocked!"
    },


    ///////////////////////////////////////////////////////NEUTRALS                                                                  
    jester : {

    },
    serialKiller : {
        you : "Your target's defence was too high!",
        target : "You were stabbed to death by a serial killer!"
    },
    arsonist : {
        target : "You were ignited by an arsonist!"
    }
}

function consigMsg(roleName){
    return "Your target's role is: " + roleName + "!";
}

function trackerMsg(client, targetIds){
    str = "Your target visited: "
    for(i = 0; i < targetIds.length; i ++){
        str += client.users.cache.get(targetIds[i]).username
        if(i < targetIds.length - 1){
            str += ", ";
        }
    }
    return str;
}

function lookoutMsg(client, targetIds){
    str = "Your target was visited by: "
    for(i = 0; i < targetIds.length; i ++){
        str += client.users.cache.get(targetIds[i]).username
        if(i < targetIds.length - 1){
            str += ", ";
        }
    }
    return str;
}

module.exports.presets = presets;
module.exports.consigMsg = consigMsg;
module.exports.trackerMsg = trackerMsg;
module.exports.lookoutMsg = lookoutMsg;