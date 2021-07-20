const roles = require("../modules/roles.js");

class Player {

    constructor(id, user) {
        this.id = id;
        this.user = user;
        this.isAlive = true;
        this.data = {};


        this.role = "None";
    }



    setRole(role) {
        this.role = role;
        this.data = roles.roleInfo.get(role);
    }

    attack(attackerId, power){
        if(power > this.data.tattack){
            this.data.attacker = attackerId;
            this.data.tattack = power;
        }

        this.data.allAttacks.push([attackerId, power]);
    }

    defend(defenderId, power){
        if(power > this.data.tdefense){
            this.data.defender = defenderId;
            this.data.tdefense = power;
        }

        this.data.allDefenses.push([defenderId, power]);
    }

    getDefense(){
        return Math.max(this.data.def, this.data.tdefense);
    }

}

module.exports = Player;