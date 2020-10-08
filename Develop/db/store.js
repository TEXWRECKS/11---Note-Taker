const util = require("util");
const fs = require("fs");
// generates a unique id number
const uuidv1 = require("uuid/v1");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    // creating method called read within the "Store" class
    read() {
        // retruning db.json file
        return readFileAsync("./db.json", "utf8")
    }
    // creating a method called write that takes in a parameter/object called note
    write(note) {
        // converting the object (note) to a string (text), and then writing it to db.json
        return writeFileAsync("./db.json", JSON.stringify(note))
    }
    // creating a method called getNotes
    getNotes() {
        // Reading the file, and taking in a response
        return this.read().then(response => {
            // creating a variable (placeholder) called parsedNotes
            let parsedNotes;
            // If there is there is data, then convert the data back to original form
            try { parsedNotes = [].concat(JSON.parse(response)) }
            // If there isn't data or something goes wrong, then we set parsedNotes equal to the appropriate type of variable
            catch (err) { parsedNotes = [] }
            // returning an array (with or without information)
            return parsedNotes
        })
    }
    addNote(notes){
        // Creating a variable called title and a variable called text, setting it equal to whatever the title and text is of the notes (object)
        const{title, text} = notes;
        // Creating a variable called newNote which is set equal to an object
        const newNote = {title, text, id: uuidv1()};
        // Calling the Store.getNotes method
        return this.getNotes()
        // taking the parsedNotes array, and setting it equal to that array and adding newNote
        .then(data => [...data, newNote])
        // updatedNotes is the array of parsedNotes plus newNote, then callign a write method (Store.write)...
        // ... writes to db.json, and passes in the updatedNotes
        .then(updatedNotes => this.write(updatedNotes))
        // returning "newNote"
        .then(() => newNote)
    }
    removeNote(id) {
        return this.getNotes()
          .then((notes) => notes.filter((note) => note.id !== id))
          .then((filteredNotes) => this.write(filteredNotes));
      }
}

module.exports = new Store()