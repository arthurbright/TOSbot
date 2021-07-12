const roles = require("../modules/roles.js");

class Player {

    constructor(id, user) {
        this.id = id;
        this.user = user;
        this.isAlive = true;
        
        


        this.role = "None";
        this.data = {};

        
        this.choices = {};



        this.targets = {};
        this.visitedBy = {};


    }



    setRole(role) {
        this.role = role;
        this.data = roles.roleData.get(role);
    }


    

}

module.exports = Player;