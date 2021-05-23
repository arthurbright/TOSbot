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


    

}

module.exports = Player;