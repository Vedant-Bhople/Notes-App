// ========================================
// VB Notes - Edit Note
// ========================================

const BASE_URL = "https://notes-app-b63a.onrender.com";

function getEditNoteId() {
    let urlParams = new URLSearchParams(window.location.search);
    let idFromUrl = urlParams.get("id");
    if (idFromUrl) {
        return idFromUrl;
    }
    return localStorage.getItem("editNoteId");
}

let noteId = getEditNoteId();

$(document).ready(function () {
    let user = localStorage.getItem("loggedInUser");
    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    if (!noteId) {
        alert("No note selected.");
        window.location.href = "all-notes.html";
        return;
    }

    loadNote();
});

// ========================================
// LOAD NOTE
// ========================================

function loadNote() {
    $.ajax({
        url: BASE_URL + "/notes/" + noteId,
        type: "GET",
        success: function (note) {
            if (!note) {
                alert("Note not found.");
                window.location.href = "all-notes.html";
                return;
            }

            $("#title").val(note.title || "");
            $("#content").val(note.content || "");
            $("#category").val(note.category || "");

            if (note.color) {
                $("#color").val(note.color);
            }

            if (note.priority) {
                $("#priority").val(note.priority.toUpperCase());
            }
        },
        error: function (xhr) {
            console.log("Load Note Error:", xhr);
            alert("Unable to load note.");
            window.location.href = "all-notes.html";
        }
    });
}

// ========================================
// UPDATE NOTE
// ========================================

$("#editForm").submit(function (e) {
    e.preventDefault();

    let title = $("#title").val().trim();
    let content = $("#content").val().trim();

    if (!title || !content) {
        alert("Please enter title and content.");
        return;
    }

    let note = {
        title: title,
        content: content,
        category: $("#category").val().trim() || "General",
        color: $("#color").val() || "Blue",
        priority: $("#priority").val() || "MEDIUM"
    };

    $.ajax({
        url: BASE_URL + "/notes/update/" + noteId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(note),
        success: function () {
            alert("Note Updated Successfully");
            localStorage.removeItem("editNoteId");
            window.location.href = "all-notes.html";
        },
        error: function (xhr) {
            console.log("Update Error:", xhr);
            alert("Unable to update note.");
        }
    });
});
