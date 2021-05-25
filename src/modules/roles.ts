const player = require("../classes/player.js");

let roleInfo = new Map<String, Object>();

roleInfo.set("Mayor", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, bullets: 2});
roleInfo.set("Vigilante", {alignment: "Town", subfaction: "Killing", def: 0, atk: 1, bullets: 2});


roleInfo.set("Godfather", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 1});
roleInfo.set("Mafioso", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 0});  // hasGodfather and hasMafioso as instance vars


function isGodfather(player): boolean {
    console.log(player);
    console.log(player.role);
    return (player.role === "Godfather");
}

module.exports.roleInfo = roleInfo;
module.exports.isGodfather = isGodfather;