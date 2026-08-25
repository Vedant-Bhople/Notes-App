// ========================================
// VB Notes - Add Note
// ========================================

const BASE_URL = "http://localhost:8082";

function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        let user = localStorage.getItem("loggedInUser");
        if (user && user !== "undefined") {
            try {
                let parsed = JSON.parse(user);
                userId = parsed.id;
            } catch (e) {
                console.error("Parse user error:", e);
            }
        }
    }
    return userId;
}

$(document).ready(function () {
    let userId = getUserId();
    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    let storedUser = localStorage.getItem("loggedInUser");
    if (storedUser && storedUser !== "undefined") {
        try {
            let u = JSON.parse(storedUser);
            if (u.fullName) {
                $("#topbarUserName").text(u.fullName);
            }
        } catch (e) {}
    }
});

// ========================================
// SAVE NOTE
// ========================================

$("#noteForm").submit(function (e) {
    e.preventDefault();

    let userId = getUserId();
    if (!userId) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
    }

    let title = $("#title").val().trim();
    let content = $("#content").val().trim();

    if (!title || !content) {
        alert("Please enter both title and content.");
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
        url: BASE_URL + "/notes/save/" + userId,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(note),
        success: function (response) {
            console.log("Note saved:", response);
            alert("Note Added Successfully");
            window.location.href = "all-notes.html";
        },
        error: function (xhr) {
            console.log("Save Note Error:", xhr);
            let msg = xhr.responseText || "Unable to save note.";
            alert(msg);
        }
    });
});