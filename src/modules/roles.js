const player = require("../classes/player.js");

let roleData = new Map();


roleData.set("Bodyguard", {alignment: "Town", subfaction: "Protective", prio: 10, def: 0, atk: 2, vests: 2});
roleData.set("Doctor", {alignment: "Town", subfaction: "Protective", prio: 40, def: 0, atk: 0, prevId: -1});
roleData.set("Mayor", {alignment: "Town", subfaction: "Support", def: 0, atk: 0, revealed: false});
roleData.set("Medium", {alignment: "Town", subfaction: "Support", def: 0, atk: 0});
roleData.set("Escort", {alignment: "Town", subfaction: "Support", prio: 30, def: 0, atk: 0});
roleData.set("Bus Driver", {alignment: "Town", subfaction: "Support", def: 0, atk: 0});
roleData.set("Sheriff", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0});
roleData.set("Lookout", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0});
roleData.set("Tracker", {alignment: "Town", subfaction: "Investigative", def: 0, atk: 0});
roleData.set("Veteran", {alignment: "Town", subfaction: "Killing", prio: 5, def: 0, atk: 2, alerts: 2});
roleData.set("Vigilante", {alignment: "Town", subfaction: "Killing", def: 0, atk: 1, bullets: 2, suicidal: false});


roleData.set("Godfather", {alignment: "Mafia", subfaction: "Killing", def: 1, atk: 1});
roleData.set("Mafioso", {alignment: "Mafia", subfaction: "Killing", def: 0, atk: 1});  // hasGodfather and hasMafioso as instance vars
roleData.set("Consigliere", {alignment: "Mafia", subfaction: "Support", def: 0, atk: 0});
roleData.set("Consort", {alignment: "Mafia", subfaction: "Support", prio: 20, def: 0, atk: 0});

roleData.set("Jester", {alignment: "Neutral", subfaction: "Evil", def: 0, atk: 0});
roleData.set("Serial Killer", {alignment: "Neutral", subfaction: "Killing", def: 1, atk: 1});
roleData.set("Arsonist", {alignment: "Neutral", subfaction: "Killing", prio: 45, def: 1, atk: 0});


module.exports.roleData = roleData;