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
                        log.innerText += 'The door is locked. There is a keypad on the handle. What will you enter into the keypad?'
                    }
                }
            }

        }
    },
    '182 Main St. - Foyer': {
        canChangeTo: ["182 Main st."],
        'description': "You are in a foyer. Or maybe it\'s an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. But let\'s forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont, this is pronounced 'FO-ee-yurr'. A set of stairs leads up to another floor. A door leads outside.",
        'inventory': ['a copy of Seven Days']
    }
}

potentialCommands = {
    take: ['Pick up', 'pick up', 'take', 'pick', 'Pick', 'Take', 'Grab', 'grab', 'get', 'Get'],
    drop: ['drop', 'Drop', 'Put down', 'put down', 'throw away', 'Throw away'],
    lookAt: ['Look at', 'Look', 'look', 'look at', 'examine', 'Examine'],
    checkInventory: ['i', 'I', 'Inventory', 'inventory', 'take inventory', 'Take inventory']
}

let items = {
    'a copy of Seven Days': {
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
function startGame() {
    let playerInputField = document.getElementById('playerInput')
    let log = document.getElementById('log')
    currentRoom = "182 Main st."
    interactables = rooms[currentRoom]['interactible items'];
    key = "12345"
    doorLocked = true
    playerInventory = []
    rooms['182 Main st.'].inventory = ['dog poop', 'quarter']
    rooms['182 Main St. - Foyer'].inventory = ['a copy of Seven Days']
    log.innerText = currentRoom + "\n\n" + rooms[currentRoom]["description"]
    playerInputField.value = ''
}
function submit() {
    let playerInputField = document.getElementById('playerInput')
    let playerInput = playerInputField.value
    mainGame(playerInput)
    playerInputField.value = ''
}
function listenForEnter() {
    let playerInputField = document.getElementById('playerInput')
    playerInputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submit();
        }
    })
}
function mainGame(chunk) {
    log.innerText = 'Current location: ' + currentRoom + '\n\n'
    playerInput = chunk.toString().trim().toLowerCase();
    let firstWordOfInput = playerInput.split(' ').shift().toString()

    if (potentialCommands.checkInventory.includes(playerInput)) {
        inventory()
    } else if (playerInput === "look around") {
        lookAround();
    } else if (potentialCommands.drop.includes(firstWordOfInput)) {
        drop(playerInput);
    } else if (potentialCommands.take.includes(firstWordOfInput)) {
        take(playerInput)
    } else if (currentRoom == "182 Main st.") {

        mainStActions(playerInput);

    } else if (currentRoom = "182 Main St. - Foyer") {

        foyerActions(playerInput);
    }
}

function lookAround() {
    log.innerText += rooms[currentRoom]["description"] + '\n'

    if (rooms[currentRoom]['inventory'].length > 0) {
        log.innerText += 'You see ' + rooms[currentRoom]['inventory'] + '.\n'
    }
}

function changeRoom(newRoom) {
    let validTransitions = rooms[currentRoom].canChangeTo;
    if (validTransitions.includes(newRoom)) {
        currentRoom = newRoom;
        log.innerText += 'Current location: ' + currentRoom + '\n\n' + rooms[currentRoom]['description']
    } else {
        log.innerText += 'Invalid state transition attempted - from ' + currentRoom + " to " + newRoom
    }
}


function mainStActions(action) {
    if (action == "drop paper" || action == "drop seven days") {
        drop("Seven Days")
    } else if (action == "take seven days" || action == 'take paper') {
        take('Seven Days')
        

        


        
    } else if (action == "read sign") {
        console.log('The sign says "Welcome to Burlington Code Academy! Come on up to the second floor. If the door is locked, use the code 12345."');
    } else if (action == "take sign") {
        console.log("That would be selfish. How will other students find their way?");
    } else if (action == "open door") {
        if (doorLocked) {
            console.log('The door is locked. There is a keypad on the handle.');
        }
    } else if (action.startsWith('key in') || action.startsWith('enter code')) {
        if (key == action.match('12345')) {
            console.log('Success! The door opens. You enter the foyer and the door shuts behind you.');
            doorLocked = false;

function mainStActions(playerInput) {
    if (playerInput == "read sign") {
        log.innerText += 'The sign says "Welcome to Burlington Code Academy! Come on up to the second floor. If the door is locked, use the code 12345."'
    } else if (playerInput == "take sign") {
        log.innerText += 'That would be selfish. How will other students find their way?'
    } else if (playerInput == "open door") {    // Here's an example of calling that function on the door
        interactables.door['open']()
    } else if (playerInput.startsWith('key in') || playerInput.startsWith('enter code')) {
        if (key == playerInput.match('12345')) {
            log.innerText = 'Success! The door opens. You enter the foyer and the door shuts behind you.\n\n'
            changeRoom("182 Main St. - Foyer");
        } else {
            log.innerText += 'Bzzzzt! The door is still locked.'
        }
    } else if (playerInput === '') {
        log.innerText += 'Please provide a command.'
    } else {
        log.innerText += "Sorry, I don't know how to " + playerInput + "."
    }
}

function foyerActions(playerInput) {
    if (playerInput == "go back") {
        log.innerText = 'You walk back down the stairs and walk out the door.\n\n'
        changeRoom("182 Main st.")
    } else {
        log.innerText += "Sorry, I don't know how to " + playerInput + "."
    }
}

function inventory() {
    if (playerInventory.length <= 0) {
        log.innerText += '"You are not carrying anything!'
    } else {
        log.innerText += 'You are carrying: '
        for (let item of playerInventory) {
            log.innerText += ' ' + item + ", " + items[item]['description']
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
        log.innerText += 'You dropped ' + item
    } else {
        log.innerText += "I can't drop that now."
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
        log.innerText += items[item]['onPickUp']
    } else {
        log.innerText += "I can't take that now."
    }
}