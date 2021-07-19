const player = require("../classes/player.js");

let roleInfo = new Map();


roleInfo.set("Bodyguard", {alignment: "Town", subfaction: "Protective", def: 0, atk: 2, vests: 2, doused: false});
roleInfo.set("Doctor", {alignment: "Town", subfaction: "Protective", def: 0, atk: 0, prevId: -1, doused: false});
roleInfo.set("Mayor", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, revealed: false, doused: false});
roleInfo.set("Medium", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, doused: false});
roleInfo.set("Escort", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, doused: false});
roleInfo.set("Bus Driver", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, doused: false});
roleInfo.set("Sheriff", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0, doused: false});
roleInfo.set("Lookout", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0, doused: false});
roleInfo.set("Tracker", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0, doused: false});
roleInfo.set("Veteran", {alignment: "Town", subfaction: "Killing", def: 0, atk: 2, alerts: 2, doused: false});
roleInfo.set("Vigilante", {alignment: "Town", subfaction: "Killing", def: 0, atk: 1, bullets: 2, suicidal: false, doused: false});


roleInfo.set("Godfather", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 1, doused: false});
roleInfo.set("Mafioso", {alignment: "Mafia", subfaction: "Killing", def: 0, atk: 1, doused: false});  
roleInfo.set("Consigliere", {alignment: "Mafia", subfaction: "Support", def: 0, atk: 0, doused: false});
roleInfo.set("Consort", {alignment: "Mafia", subfaction: "Support", def: 0, atk: 0, doused: false});

roleInfo.set("Jester", {alignment: "Neutral", subfaction: "Evil", def: 0, atk: 0, doused: false});
roleInfo.set("Serial Killer", {alignment: "Neutral", subfaction: "Killing", def: 1, atk: 1, doused: false});
roleInfo.set("Arsonist", {alignment: "Neutral", subfaction: "Killing", def: 1, atk: 0, doused: false});


module.exports.roleInfo = roleInfo;