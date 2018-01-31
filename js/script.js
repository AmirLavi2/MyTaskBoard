/*
Written by Amir Lavi,
with the help of couple of friends,
in 8.5.2017
*/

document.getElementById("myform").addEventListener("submit", saveData); //on submit
let notes = []; // this array will contain the notes object
let errorFlag = true; // if we found an error
let error = document.createElement('p'); // error tag

loadNotes();


// load the tasks after page refrash
function loadNotes() {
    //console.log("loadNotes func");
    let notesJSON = localStorage.getItem('notes');
    if (!notesJSON) {
        return;
    } // if the local storage is empty, get out from the func

    let savedNotes = JSON.parse(notesJSON);

    for (note in savedNotes) {
        addNote(savedNotes[note]);
    }

}


function saveData() {
    //console.log("saveData func");
    event.preventDefault();

    if (validateForm()) {
    
        let noteObject = {
            'task': document.getElementById('task').value,
            'date': document.getElementById('date').value
        };

        addNote(noteObject);

        // Save all notes
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

//check the user input
function validateForm() {
    //console.log("validateForm func");

    if (document.getElementById('task').value == "") {
        //alert("Please enter a task.");
        if (errorFlag) onEmptyTask();
        return false;
    }
    else {
        error.remove();
    }

    let dateRegex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);
    let dateValue = document.getElementById('date').value;

    if (!dateRegex.test(dateValue)) {
        alert("Please enter a valid date format (dd.mm.yyyy)");
        return false;
    }

    return true;
}

// add the note image
function addNote(noteObject) {
    //console.log("addNotes func");
    let newSpan = document.createElement('span');
    newSpan.className = 'notes col-md-2 col-xs-3';
    document.getElementById('noteSection').appendChild(newSpan);

    void newSpan.offsetWidth; // reading the property requires a recalc
    newSpan.classList.add("shown");

    addValue(newSpan, noteObject.task);
    addGlyphicon(newSpan);
    addDate(newSpan, noteObject.date);

    // Add to notes array
    notes.push(noteObject);

    // Set note id
    newSpan.id = "note-" + notes.indexOf(noteObject);
}

// add the task value
function addValue(newSpan, input) {
    //console.log("addValue func");
    let innerP = document.createElement('p');
    innerP.className = 'noteText col-md-12 col-xs-12';
    innerP.textContent = input;
    newSpan.appendChild(innerP);
}

// add 'X' on the note
function addGlyphicon(newSpan) {
    //console.log("addGlyphicon func");
    let x = document.createElement('span');
    x.className = 'glyphicon glyphicon-remove';
    newSpan.appendChild(x);
    x.addEventListener("click", removeNote);
}

// add the date on the note
function addDate(newSpan, inputDate) {
    //console.log("newSpan func");
    let innerSpan = document.createElement('span');
    innerSpan.className = 'noteDate col-md-12';
    innerSpan.textContent = inputDate;
    newSpan.appendChild(innerSpan);
}

// remove the task
function removeNote() {
    //console.log("removeNote func");
    let newSpan = event.target.parentElement;
    newSpan.classList.remove("shown");

    // Get note id
    let noteId = newSpan.id.replace("note-", "");

    // Remove note from notes array
    notes.splice(noteId, 1);

    // Save notes to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    setTimeout(function () {
        newSpan.remove();
    }, 500);
}

// add red error
function onEmptyTask() {
    //console.log("onEmptyTask func");
    error.className = 'col-md-12';
    error.style.color = 'red';
    document.getElementById('myform').appendChild(error);
    error.textContent = "Please enter a task.";
    errorFlag = false;
}
