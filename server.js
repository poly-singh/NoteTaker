const express=require("express");
const fs=require("fs");
const path=require("path");
const database=require("./db/db");
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})
app.route("/api/notes")
    // get the notes list 
    .get(function (req, res) {
        res.json(database);
    })
    .post(function (req, res) {
        let jsonFile_Path = path.join(__dirname, "/db/db.json");
        let new_Note = req.body;
        let highestId = 99;
        for (let i = 0; i < database.length; i++) {
            let eachNote = database[i];
            if (eachNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = eachNote.id;
            }
        }
        new_Note.id = highestId + 1;
        // Adding it to db.json.
        database.push(new_Note)
        fs.writeFile(jsonFile_Path, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("note saved");
        });
        // Gives back the new note as response. 
        res.json(new_Note);
    });
    app.delete("/api/notes/:id", function (req, res) {
        let jsonFile_Path = path.join(__dirname, "/db/db.json");
        // request to delete note by id.
        for (let i = 0; i < database.length; i++) {
            if (database[i].id == req.params.id) {
                // Splice takes i position, and deletes 1 note.
                database.splice(i, 1);
                break;
            }
        }
        
        fs.writeFileSync(jsonFile_Path, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            } else {
                console.log("Your note was deleted!");
            }
        });
        res.json(database);
    });
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
    



