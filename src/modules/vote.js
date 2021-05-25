const { Client } = require('discord.js');
currMessages = [];
ids = [];

// Emojis
const nooseThink = '839900389989679125';
const mayor = 'Ⓜ️';

// Channels
//const votingChannel = '833755912064729118';
const votingChannel = '758155951240642576';


// Convert ID to Username
function getUsername(client, id){
    return client.users.cache.get(id).username;
}


// Takes in list of player ids and sets up poll
async function sendVote(client, players, day){
    currMessages = [];
    ids = [];
    
    //opening line
    channel = client.channels.cache.get(votingChannel);
    str = "**Voting options for day " + day + ":**";
    await channel.send(str);

    numPlayers = players.length;

    //store the list of messages
    for(i = 0; i < numPlayers; i ++){
        str = getUsername(client, players[i]);
        m = await channel.send(str)
        //store both the id and the message at the same index
        currMessages.push(m);
        ids.push(players[i]);
        
    }
}

function countVotes() {
    if (currMessages.length == 0) {
        return 0;
    }
    //count reactions on each message in the array
    count = [];
    numPlayers = currMessages.length;
    max = -1;
    mostVoted = null;

    for (let i = 0; i < numPlayers; i++) {
        count.push(0);
        // Count normal votes
        if (currMessages[i].reactions.resolve(nooseThink) != null){
            count[i] += 2 * currMessages[i].reactions.resolve(nooseThink).users.reaction.count;
        }
        // Count mayor vote
        if (currMessages[i].reactions.resolve(mayor) != null){
            count[i] += 5;
        }

        if (count[i] > max){
            max = count[i];
            mostVoted = ids[i];
        }
        
    }

    if (max > numPlayers) {
        return mostVoted
    }
    else {
        return 0;
    }

}

module.exports.sendVote = sendVote;
module.exports.countVotes = countVotes;