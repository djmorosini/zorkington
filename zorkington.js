let rooms = {
    "182 Main st.": {
        canChangeTo: ["182 Main St. - Foyer"],
        'description': "You are standing on Main Street between Church and South Winooski. There is a door here. A keypad sits on the handle. On the door is a handwritten sign.",
        'inventory': ['dog poop', 'quarter'],
    },
    '182 Main St. - Foyer': {
        canChangeTo: ["182 Main st."],
        'description': "You are in a foyer. Or maybe it\'s an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. But let\'s forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont, this is pronounced 'FO-ee-yurr'. A copy of Seven Days lies in a corner. A set of stairs leads up to another floor. A door leads outside.",
        'inventory': ['Seven Days']
    }
}

potentialCommands = {
    pickUpPaper: ['Pick up paper', 'pick up paper', 'take paper', 'Take paper', 'Grab paper', 'grab paper', 'get paper', 'Get paper', 'Pick up seven days', 'pick up seven days', 'take seven days', 'Take seven days', 'Grab seven days', 'grab seven days', 'get seven days', 'Get seven days'],
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
let key = "12345"
let doorLocked = true
let playerInventory = []

console.log(currentRoom + "\n" + rooms[currentRoom]["description"])

process.stdin.on('data', (chunk) => {
    let playerInput = chunk.toString().trim();
    let firstWordOfInput = playerInput.split(' ').shift().toString()
    console.log("\n")

    if (potentialCommands.checkInventory.includes(playerInput)) {
        inventory()
    } else if (playerInput == "look around") {
        console.log(rooms[currentRoom]["description"] + " You see " + rooms[currentRoom]['inventory'] + ".")
    } else if (potentialCommands.drop.includes(firstWordOfInput)){
        drop(playerInput);

    } else if (currentRoom == "182 Main st.") {

        mainStActions(playerInput);

    } else if (currentRoom = "182 Main St. - Foyer") {

        foyerActions(playerInput);
    }
    console.log(currentRoom)
});

function changeRoom(newRoom) {
    let validTransitions = rooms[currentRoom].canChangeTo;
    if (validTransitions.includes(newRoom)) {
        currentRoom = newRoom;
        console.log('\nCurrent room: ' + currentRoom + "\n" + rooms[currentRoom]['description'] + "\n")
    } else {
        console.log("Invalid state transition attempted - from " + currentRoom + " to " + newRoom);
    }
}

function take(itemFromAction) {
    if (rooms[currentRoom]["inventory"].includes(itemFromAction)) {
        let itemIndex = rooms[currentRoom]["inventory"].indexOf(itemFromAction)
        let item = rooms[currentRoom]["inventory"].splice(itemIndex, 1).toString()
        playerInventory.push(item)
        console.log(items[item]['onPickUp'])
    } else {
        console.log("I can't take that now.")
    }
}

function mainStActions(playerInput) {
     if (potentialCommands.pickUpPaper.includes(playerInput)) {
        take('Seven Days')
        
    } else if (playerInput == "read sign") {
        console.log('The sign says "Welcome to Burlington Code Academy! Come on up to the second floor. If the door is locked, use the code 12345."');
    } else if (playerInput == "take sign") {
        console.log("That would be selfish. How will other students find their way?");
    } else if (playerInput == "open door") {
        if (doorLocked) {
            console.log('The door is locked. There is a keypad on the handle.');
        }
    } else if (playerInput.startsWith('key in') || playerInput.startsWith('enter code')) {
        if (key == playerInput.match('12345')) {
            console.log('Success! The door opens. You enter the foyer and the door shuts behind you.');
            doorLocked = false;
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
      if (potentialCommands.pickUpPaper.includes(playerInput)) {
        take('Seven Days')
    } else if (playerInput == "go back") {
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

// function take(desiredItem) {
//     const roomInventory = rooms[currentRoom]['inventory'];

//     if (roomInventory.includes(desiredItem)) {

//         const itemFromRoom = roomInventory.splice(roomInventory.indexOf(desiredItem), 1).toString();
//     playerInventory.push(itemFromRoom)
//     console.log('' + desiredItem + ' was added to your inventory.')
//     } else {
//         console.log('There is no ' + desiredItem + ' here.')
//     }
    // while (rooms[currentRoom]['inventory'].length > rooms[currentRoom]['inventory'].indexOf(itemFromAction)){
    //     tempInventoryArray.push(rooms[currentRoom]['inventory'].pop())
    //     console.log(tempInventoryArray)
    // }
    // playerInventory.push(tempInventoryArray.pop())
    // while (tempInventoryArray.length > 0) {
    //     rooms[currentRoom]['inventory'].push(tempInventoryArray.pop())
    //     console.log()
    // }
// }