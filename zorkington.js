let rooms = {
    "182 Main st.": {
        canChangeTo: ["182 Main St. - Foyer"],
        'description': "You are standing on Main Street between Church and South Winooski. There is a door here. A keypad sits on the handle. On the door is a handwritten sign.",
        'inventory': ['dog poop', 'quarter'],
        'interactible items': {   //I think it would be pretty easy to add interactable items to a room object and give them a description and a list of actions players can take with them (functions). Then we can build a 'look at item' function and it helps keep the room if else functions clean.
            door: {
                'description': 'The door is locked. There is a keypad on the handle.',
                'open': function() {
                    {
                        console.log('The door is locked. There is a keypad on the handle. What will you enter into the keypad?');
                        process.stdin.once('data', (code) => {
                            code = code.toString().trim()
                            console.log(code)
                            if (key == code.match('12345')) {
                                console.log('Success! The door opens. You enter the foyer and the door shuts behind you.');
                                changeRoom("182 Main St. - Foyer");
                            } else {
                                console.log('Bzzzzt! The door is still locked.'); //still needs some debugging :(
                            }
                        })
                    }
                }
            }
            
        }
    },
    '182 Main St. - Foyer': {
        canChangeTo: ["182 Main st."],
        'description': "You are in a foyer. Or maybe it\'s an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. But let\'s forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont, this is pronounced 'FO-ee-yurr'. A copy of Seven Days lies in a corner. A set of stairs leads up to another floor. A door leads outside.",
        'inventory': ['Seven Days']
    }
}

potentialCommands = {
    take: ['Pick up', 'pick up', 'take', 'pick', 'Pick', 'Take', 'Grab', 'grab', 'get', 'Get'],
    drop: ['drop', 'Drop', 'Put down', 'put down', 'throw away', 'Throw away'],
    lookAt: ['Look at', 'Look', 'look', 'look at', 'examine', 'Examine'],
    checkInventory: ['i', 'I', 'Inventory','inventory', 'take inventory', 'Take inventory']
}

let items = {
    'Seven Days': {
        'alternate names':['paper', 'seven days', 'Seven Days','Paper', 'newspaper', 'days', 'Days'],
        'description': "Vermont's Alt-Weekly",
        'onPickUp': 'You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.'
            },
    'dog poop': {
        'alternate names':['poop','shit', 'Poop', 'dog poop', 'turd'],
        'description': 'Brown. Smelly. Literal poop from a dog. I don\'t know what you were expecting.',
        'onPickUp': 'squish...',
    },
    'quarter':{
        'alternate names':['quarter','change','money'],
        'description': '25 cents. Minted 1978. How is this still around?',
        'onPickUp': 'SWEET! 25 CENTS!'
    }
}

let currentRoom = "182 Main st."
let interactables = rooms[currentRoom]['interactible items'];
let key = "12345"
let doorLocked = true
let playerInventory = []

console.log(currentRoom + "\n" + rooms[currentRoom]["description"])

process.stdin.on('data', (chunk) => {
    console.log('Current location: ' + currentRoom + '\n')
    let playerInput = chunk.toString().trim();
    let firstWordOfInput = playerInput.split(' ').shift().toString()
    console.log("\n")

    if (potentialCommands.checkInventory.includes(playerInput)) {
        inventory()
    } else if (playerInput == "look around") {
        lookAround();
    } else if (potentialCommands.drop.includes(firstWordOfInput)){
        drop(playerInput);
    } else if (potentialCommands.take.includes(firstWordOfInput)){
        take(playerInput)
    } else if (currentRoom == "182 Main st.") {

        mainStActions(playerInput);

    } else if (currentRoom = "182 Main St. - Foyer") {

        foyerActions(playerInput);
    }
});

function lookAround() {
    console.log(rooms[currentRoom]["description"])

    if (rooms[currentRoom]['inventory'].length > 0){
    console.log(" You see " + rooms[currentRoom]['inventory'] + ".");
    }
}

function changeRoom(newRoom) {
    let validTransitions = rooms[currentRoom].canChangeTo;
    if (validTransitions.includes(newRoom)) {
        currentRoom = newRoom;
        console.log('\nCurrent room: ' + currentRoom + "\n" + rooms[currentRoom]['description'] + "\n")
    } else {
        console.log("Invalid state transition attempted - from " + currentRoom + " to " + newRoom);
    }
}



function mainStActions(playerInput) {
     if (playerInput == "read sign") {
        console.log('The sign says "Welcome to Burlington Code Academy! Come on up to the second floor. If the door is locked, use the code 12345."');
    } else if (playerInput == "take sign") {
        console.log("That would be selfish. How will other students find their way?");
    } else if (playerInput == "open door") {    //Here's an example of calling that function on the door
            interactables.door['open']()
    } else if (playerInput.startsWith('key in') || playerInput.startsWith('enter code')) {
        if (key == playerInput.match('12345')) {
            console.log('Success! The door opens. You enter the foyer and the door shuts behind you.');
            changeRoom("182 Main St. - Foyer");
        } else {
            console.log('Bzzzzt! The door is still locked.');
        }
    } else if (playerInput === ''){
        console.log('Please provide a command.')
    } else {
        console.log("Sorry, I don't know how to " + playerInput + ".");
    }
}

function foyerActions(playerInput) {
     if (playerInput == "go back") {
        changeRoom("182 Main st.")
    } else {
        console.log("Sorry, I don't know how to " + playerInput + ".");
    }
}

function inventory() {
    if (playerInventory.length <= 0) {
        console.log("You are not carrying anything!")
    } else {
        console.log('You are carrying:')
        for (let item of playerInventory) {
            console.log(item + ", " + items[item]['description'])
        }
    }
}

function drop(playerInput) {
    let itemName = playerInput.match(/[a-z]+$/i).toString()
    for (item in items) {
        if (items[item]['alternate names'].includes(itemName)){
            itemName = item
        }
    }
    if (playerInventory.includes(itemName)) {
        let itemIndex = playerInventory.indexOf(itemName)
        let item = playerInventory.splice(itemIndex, 1).toString()
        rooms[currentRoom]["inventory"].push(item)
        console.log("You dropped " + item)
    } else {
        console.log("I can't drop that now.")
    }
}

function take(playerInput) {
    let itemName = playerInput.match(/[a-z]+$/i).toString()
    for (item in items) {
        if (items[item]['alternate names'].includes(itemName)){
            itemName = item
        }
    }    
    if (rooms[currentRoom]["inventory"].includes(itemName)) {
        let itemIndex = rooms[currentRoom]["inventory"].indexOf(itemName)
        let item = rooms[currentRoom]["inventory"].splice(itemIndex, 1).toString()
        playerInventory.push(item)
        console.log(items[item]['onPickUp'])
    } else {
        console.log("I can't take that now.")
    }
}