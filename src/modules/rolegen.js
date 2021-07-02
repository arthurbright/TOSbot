// Generates roles
//return an array of all roles (doesnt have to be randomized)



function generateRoles(num){
    const townRoles = ["Bodyguard", "Doctor", "Doctor", "Mayor", "Medium", "Medium", "Escort", "Bus Driver", "Sheriff", "Sheriff", "Lookout", "Lookout",
                    "Tracker", "Tracker", "Veteran", "Vigilante", "Vigilante"];
    const neutralRoles = ["Jester", "Serial Killer", "Arsonist"];
    const mafiaRoles = ["Godfather", "Mafioso", "Consigliere", "Consort"];

    let town = Math.floor(num/2) + 1;
    let mafia = Math.ceil((num - town)/2)
    let neutral = num - town - mafia;

    let roles = [];

    //ensure 1 minimum town protective (TP)
    let tp = rand(3);
    roles.push(townRoles[tp]);
    townRoles.splice(tp, 1);

    //choose town
    for(let i = 0; i < town - 1; i ++){
        let t = rand(townRoles.length);
        roles.push(townRoles[t]);
        townRoles.splice(t, 1);
    }   

    //ensure a mafioso/godfather
    let killer = rand(2);
    roles.push(mafiaRoles[killer]);
    mafiaRoles.splice(killer, 1);

    //choose rest of mafia
    for(let i = 0; i < mafia - 1; i ++){
        let m = rand(mafiaRoles.length);
        roles.push(mafiaRoles[m]);
        mafiaRoles.splice(m, 1);
    }

    //choose neutrals
    for(let i = 0; i < neutral; i ++){
        let n = rand(neutralRoles.length);
        roles.push(neutralRoles[n]);
        neutralRoles.splice(n, 1);
    }

    return roles;
}

function rand(n){
    return Math.floor(n * Math.random());
}

module.exports.generateRoles = generateRoles;


