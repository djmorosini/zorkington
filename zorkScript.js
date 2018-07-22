let rooms = {
    "182 Main st.": {
        canChangeTo: ["182 Main St. - Foyer"],
        'description': "You are standing on Main Street between Church and South Winooski. There is a door here. A keypad sits on the handle. On the door is a handwritten sign.",
        'inventory': ['dog poop', 'quarter'],
        'interactible items': {   //I think it would be pretty easy to add interactable items to a room object and give them a description and a list of actions players can take with them (functions). Then we can build a 'look at item' function and it helps keep the room if else functions clean.
            door: {
                'description': 'The door is locked. There is a keypad on the handle.',
                'open': function () {
                    {
                        say('The door is locked. There is a keypad on the handle. What will you enter into the keypad?');
                        openDoor();
                    }
                }
            }

        }
    },
    '182 Main St. - Foyer': {
        canChangeTo: ["182 Main st."],
        'description': "You are in a foyer. Or maybe it\'s an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. But let\'s forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont, this is pronounced 'FO-ee-yurr'. A set of stairs leads up to another floor. A door leads outside.",
        'inventory': ['Seven Days']
    }
}

potentialCommands = {
    take: ['Pick up', 'pick up', 'take', 'pick', 'Pick', 'Take', 'Grab', 'grab', 'get', 'Get'],
    drop: ['drop', 'Drop', 'Put down', 'put down', 'throw away', 'Throw away'],
    lookAt: ['Look at', 'Look', 'look', 'look at', 'examine', 'Examine'],
    checkInventory: ['i', 'I', 'Inventory', 'inventory', 'take inventory', 'Take inventory']
}

let items = {
    'Seven Days': {
        'alternate names': ['paper', 'seven days', 'Seven Days', 'Paper', 'newspaper', 'days', 'Days'],
        'description': "Vermont's Alt-Weekly",
        'onPickUp': 'You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.'
    },
    'dog poop': {
        'alternate names': ['poop', 'shit', 'Poop', 'dog poop', 'turd'],
        'description': 'Brown. Smelly. Literal poop from a dog. I don\'t know what you were expecting.',
        'onPickUp': 'squish...',
    },
    'quarter': {
        'alternate names': ['quarter', 'change', 'money'],
        'description': '25 cents. Minted 1978. How is this still around?',
        'onPickUp': 'SWEET! 25 CENTS!'
    }
}

function newGame() {
    log = document.getElementById('log')
    log.innerHTML = ''
    startGame();
    let playerInputField = document.getElementById('playerInput')
    playerInputField.value = ''
    say(currentRoom + "\n" + rooms[currentRoom]["description"])
}
function submit() {
    let playerInputField = document.getElementById('playerInput')
    let playerInput = playerInputField.value
    mainGame(playerInput)
    playerInputField.value = ''
}
function say(message) {
    log = document.getElementById('log')
    log.innerText += '' + message + '\n'
}
function clearInput() {
    let playerInputField = document.getElementById('playerInput')
    let playerInput = playerInputField.value
    playerInputField.value = ''
}
function listenForEnter() {
    let playerInputField = document.getElementById('playerInput')
    playerInputField.addEventListener('keypress', function (event) {
        let key = event.keyCode || event.which;
        if (key === 13) {
            submit();
        }
    })
}
function startGame() {
    currentRoom = "182 Main st."
    interactables = rooms[currentRoom]['interactible items'];
    key = "12345"
    doorLocked = true
    playerInventory = []
}
function mainGame(chunk) {
    log = document.getElementById('log')
    log.innerHTML = ''
    say('Current location: ' + currentRoom + '\n')
    let playerInput = chunk.toString().trim().toLowerCase();
    let firstWordOfInput = playerInput.split(' ').shift().toString()

    if (potentialCommands.checkInventory.includes(playerInput)) {
        inventory()
    } else if (playerInput === "look around") {
        lookAround();
    } else if (potentialCommands.drop.includes(firstWordOfInput)) {
        drop(playerInput);
    } else if (potentialCommands.take.includes(firstWordOfInput)) {
        take(playerInput)
    } else if (playerInput.includes(potentialCommands.lookAt)) {
        take(playerInput)
    } else if (currentRoom == "182 Main st.") {

        mainStActions(playerInput);

    } else if (currentRoom = "182 Main St. - Foyer") {

        foyerActions(playerInput);
    }
}

function lookAround() {
    say(rooms[currentRoom]["description"])

    if (rooms[currentRoom]['inventory'].length > 0) {
        say(" You see " + rooms[currentRoom]['inventory'] + ".");
    }
}

function changeRoom(newRoom) {
    let validTransitions = rooms[currentRoom].canChangeTo;
    if (validTransitions.includes(newRoom)) {
        currentRoom = newRoom;
        say('Current room: ' + currentRoom + "\n\n" + rooms[currentRoom]['description'] + "\n")
    } else {
        say("Invalid state transition attempted - from " + currentRoom + " to " + newRoom);
    }
}



function mainStActions(playerInput) {
    if (playerInput == "read sign") {
        say('The sign says "Welcome to Burlington Code Academy! Come on up to the second floor. If the door is locked, use the code 12345."');
    } else if (playerInput == "take sign") {
        say("That would be selfish. How will other students find their way?");
    } else if (playerInput == "open door") {    //Here's an example of calling that function on the door
        interactables.door['open']()
    } else if (playerInput.startsWith('key in') || playerInput.startsWith('enter code')) {
        if (key == playerInput.match('12345')) {
            say('Success! The door opens. You enter the foyer and the door shuts behind you.\n');
            changeRoom("182 Main St. - Foyer");
        } else {
            say('Bzzzzt! The door is still locked.');
        }
    } else if (playerInput === '') {
        say('Please provide a command.')
    } else {
        say("Sorry, I don't know how to " + playerInput + ".");
    }
}

function foyerActions(playerInput) {
    if (playerInput == "go back") {
        changeRoom("182 Main st.")
    } else {
        say("Sorry, I don't know how to " + playerInput + ".");
    }
}

function inventory() {
    if (playerInventory.length <= 0) {
        say("You are not carrying anything!")
    } else {
        say('You are carrying:')
        for (let item of playerInventory) {
            say(item + ", " + items[item]['description'])
        }
    }
}

function drop(playerInput) {
    let itemName = playerInput.match(/[a-z]+$/i).toString()
    for (item in items) {
        if (items[item]['alternate names'].includes(itemName)) {
            itemName = item
        }
    }
    if (playerInventory.includes(itemName)) {
        let itemIndex = playerInventory.indexOf(itemName)
        let item = playerInventory.splice(itemIndex, 1).toString()
        rooms[currentRoom]["inventory"].push(item)
        say("You dropped " + item)
    } else {
        say("I can't drop that now.")
    }
}

function take(playerInput) {
    let itemName = playerInput.match(/[a-z]+$/i).toString()
    for (item in items) {
        if (items[item]['alternate names'].includes(itemName)) {
            itemName = item
        }
    }
    if (rooms[currentRoom]["inventory"].includes(itemName)) {
        let itemIndex = rooms[currentRoom]["inventory"].indexOf(itemName)
        let item = rooms[currentRoom]["inventory"].splice(itemIndex, 1).toString()
        playerInventory.push(item)
        say(items[item]['onPickUp'])
    } else {
        say("I can't take that now.")
    }
}