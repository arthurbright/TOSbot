const player = require("../classes/player.js");

let roleInfo = new Map();


roleInfo.set("Bodyguard", {alignment: "Town", subfaction: "Protective", def: 0, atk: 0, vests: 2});
roleInfo.set("Doctor", {alignment: "Town", subfaction: "Protective", def: 0, atk: 0, prevId: -1});
roleInfo.set("Mayor", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, revealed: false});
roleInfo.set("Medium", {alignment: "Town", subfaction: "Support", def: 0, atk: 0});
roleInfo.set("Escort", {alignment: "Town", subfaction: "Support", def: 0, atk: 0});
roleInfo.set("Bus Driver", {alignment: "Town", subfaction: "Support", def: 0, atk: 0});
roleInfo.set("Sheriff", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0});
roleInfo.set("Lookout", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0});
roleInfo.set("Tracker", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0});
roleInfo.set("Veteran", {alignment: "Town", subfaction: "Killing", def: 0, atk: 0, alerts: 2});
roleInfo.set("Vigilante", {alignment: "Town", subfaction: "Killing", def: 0, atk: 1, bullets: 2, suicidal: false});


roleInfo.set("Godfather", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 1});
roleInfo.set("Mafioso", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 0});  // hasGodfather and hasMafioso as instance vars
roleInfo.set("Consigliere", {alignment: "Mafia", subfaction: "Support", def: 0, atk: 0});
roleInfo.set("Consort", {alignment: "Mafia", subfaction: "Support", def: 0, atk: 0});

roleInfo.set("Jester", {alignment: "Neutral", subfaction: "Evil", def: 0, atk: 0});
roleInfo.set("Serial Killer", {alignment: "Neutral", subfaction: "Killing", def: 0, atk: 0});
roleInfo.set("Arsonist", {alignment: "Neutral", subfaction: "Killing", def: 0, atk: 0});


module.exports.roleInfo = roleInfo;