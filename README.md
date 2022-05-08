# TOSBOT
A discord bot that runs Town of Salem! Built using Node.js and Discord.js
## Features
- Automatic role addition/removal
- Automatic muting at night
- Private DM for player moves
- Realtime timer displayed in chat


# Docs  (todo: format)
### Commands
tlive [@mention]
tkill [@mention]
liveall
## Modules
### dm
askMove(client, targetId, numChoices, validPlayers, callback(id) )
Target: which player to ask
numChoices: number of selections to make (1 normally, 2 for bus)
validPlayers: the list of players to choose from
Returns: id of chosen player
If 0, then the player decided to skip
If bus driver, pass parameter numbChoices = 2. 
Will return [player id 1, player id 2], or [0] if skip.
askAlert(client, targetId, alertsLeft, callback)
Asks if a veteran wants to alert
Calls callback(0) if no, callback(1) if yes
alertsLeft needed for UI purposes
askVest(client, targetId, vestsLeft, callback)
Asks if a bodyguard wants to vest
Calls callback(0) if no, callback(1) if yes
vestsLeft needed for UI purposes
askBusDriver(client, targetId, players, callback([id1, id2])
askArsonist(client, targetId, players, callback([move, target])
Pass → move = 0
Douse → move = 1
Ignite → move = 2
askBodyGuard(client, raagetId, players, vestsLeft, callback([move, target])
Vest → move = 1
No vest → move = 0
dmRole(client, targetId, rolename)
Dms a person their role
dmMessage(client, targetId, message)


### vote
sendVote(client, players, day)
Players: list of valid players
Day: which day it is
Sends out a poll in the voting channel
countVotes()
Counts the votes and returns the id of the person voted out according to game rules
If no one is voted out, returns 0
SYNCHRONOUS FUNCTION! (instant)
clearVote()
Clears the previous poll.
lifedeath
killPlayer(client, targetId, roleName)
Kills player and sends death message in graveyard.
reset(client)
Revives everyone AND clears the #graveyard channel
lynch(client, targetId, roleName)
Lynches someone and sends death message in graveyard.
clearGraveyard(client)
Clears all messages in graveyard channel

### announce
sendTown(client, message)
Sends a message to town
announceDay(client, num)
Announces day number (num) in town. 
Starts visual timer
announceNight(client, num)
Similar to announceDay
revealMayor(client, id)
Reveals mayor with id
clearTown(client)
Clears ALL messages BUT frank’s initial message in #town
announceTownWin(client)
Announces that town has won
announceMafiaWin(client)
Does as it sounds
announceNeutralWin(client, rolename)
Announces that the specified neutral has won.
pollPlayers(client)
Sends a poll to #town asking players to react if they wanna play
getPlayers(client)
Returns an array of all players who are playing.
If no reactions/no valid poll, will return an empty array.
### vc
muteAll(client)
Mutes all users in town voice channel
unmuteAll(client)
Unmutes all users in town voice channel
gameMessages
consigMsg(rolename)
Returns a string with a message for consig
trackerMsg(client, targetIds)
Returns a string with message for tracker, with usernames of each target
lookoutMsg(client, targetIds)
Returns a string with message for lookout, with usernames of each target
presets
A large directory containing all other private messages for players
For example: 
Gm.presets.doctor.you = “Someone tried to attack ur target but u saved them!”
Gm.presets.doctor.target = “Someone tried to attack you, but you were protected!”
### timer
startTimer()
MUST call when bot turns on, in order to actually start the timer
setTimer(client, numSeconds, callback() )
Sets a timer for numSeconds seconds in #town.
Updates every 2 seconds (to prevent delaying)
When time is up, callback() will be called. (no parameters)
stopTimer()
Stops the timer from ticking and from calling its callback
getTimer()
Gets the time remaining, in seconds (integer)

