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
    pickUp: ['Pick up', 'pick up', 'take', 'Take', 'Grab', 'grab', 'get', 'Get'],
    drop: ['drop', 'Drop', 'Put down', 'put down', 'throw away', 'Throw away'],
    lookAt: ['Look at', 'Look', 'look', 'look at', 'examine', 'Examine'],
    checkInventory: ['i', 'I', 'Inventory','inventory', 'take inventory', 'Take inventory']
}

let items = {
    'Seven Days': {
        'description': "Vermont's Alt-Weekly",
        'onPickUp': 'You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.'
            },
    'dog poop': {
        'description': 'Brown. Smelly. Literal poop from a dog. I don\'t know what you were expecting.',
        'onPickUp': 'squish...',
    },
    'quarter':{
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
    let action = chunk.toString().trim();
    console.log("\n")

    if (action === "i" || action === 'inventory'|| action === 'take inventory') {
        inventory()
    } else if (action == "look around") {
        console.log('' + rooms[currentRoom]['inventory'] + "\n" + rooms[currentRoom]["description"])
    } else if (currentRoom == "182 Main st.") {

        mainStActions(action);

    } else if (currentRoom = "182 Main St. - Foyer") {

        foyerActions(action);
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
            changeRoom("182 Main St. - Foyer");
        } else {
            console.log('Bzzzzt! The door is still locked.');
        }
    } else {
        console.log("Sorry, I don't know how to " + action + ".");
    }
}

function foyerActions(action) {
    if (action == "drop paper" || action == "drop seven days") {
        drop("Seven Days")
    } else if (action == "take seven days" || action == 'take paper') {
        take('Seven Days')
    } else if (action == "go back") {
        changeRoom("182 Main st.")
    } else {
        console.log("Sorry, I don't know how to " + action + ".");
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

function drop(itemFromAction) {
    if (playerInventory.includes(itemFromAction)) {
        let itemIndex = playerInventory.indexOf(itemFromAction)
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