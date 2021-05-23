const bot = require("../bot.ts");
const roles = require("./roles.js");


// Shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Returns a list of targets that matches a certain criteria
function getTargets(matcher) {

    let targets = [];

    for (let [id, player] of bot.players.entries()) {

        if (matcher(player)) {
            targets.push(id);
        }
    }

    console.log(targets);


}

module.exports.getTargets = getTargets;