let roles = new Map();

roles.set("Mayor", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, bullets: 2});
roles.set("Vigilante", {alignment: "Town", subfaction: "Killing", def: 0, atk: 1, bullets: 2});


roles.set("Godfather", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 1});
roles.set("Mafioso", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 0});  // hasGodfather and hasMafioso as instance vars

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
        this.data = roles.get(role);
    }


    

}

module.exports = Player;