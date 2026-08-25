// ========================================
// VB Notes - Dashboard
// ========================================

const BASE_URL = "https://notes-app-b63a.onrender.com";

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

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ========================================
// PAGE LOAD
// ========================================

$(document).ready(function () {
    let userId = getUserId();
    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    loadUser();
    loadDashboard();
});

// ========================================
// LOAD USER
// ========================================

function loadUser() {
    let storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser || storedUser === "undefined") {
        return;
    }

    try {
        let user = JSON.parse(storedUser);
        let name = user.fullName || "User";
        $("#studentName, #userName").text(name);
        $("#welcomeName").text("Welcome, " + name + " 👋");
    } catch (error) {
        console.log("User data error:", error);
    }
}

// ========================================
// LOAD DASHBOARD
// ========================================

function loadDashboard() {
    let userId = getUserId();
    if (!userId) return;

    // 1. Fetch Active Notes
    $.ajax({
        url: BASE_URL + "/notes/user/" + userId,
        type: "GET",
        success: function (notes) {
            if (!Array.isArray(notes)) notes = [];

            let total = notes.length;
            let pinned = 0;
            let favourite = 0;

            let data = "";

            // Sort newest first
            notes.sort(function (a, b) {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });

            // Take top 8 recent notes
            let recentNotes = notes.slice(0, 8);

            for (let i = 0; i < recentNotes.length; i++) {
                let note = recentNotes[i];

                if (note.pinned === true) pinned++;
                if (note.favourite === true) favourite++;

                // Status Badge
                let statusBadge = "<span class='label label-success'>Active</span>";
                if (note.pinned === true) {
                    statusBadge = "<span class='label label-warning'><i class='fa fa-thumb-tack'></i> Pinned</span>";
                } else if (note.favourite === true) {
                    statusBadge = "<span class='label label-success'><i class='fa fa-star'></i> Favourite</span>";
                } else if (note.archived === true) {
                    statusBadge = "<span class='label label-info'><i class='fa fa-archive'></i> Archived</span>";
                }

                // Priority Badge
                let priority = (note.priority || "MEDIUM").toUpperCase();
                let priorityClass = "label-default";
                if (priority === "HIGH") priorityClass = "label-danger";
                else if (priority === "MEDIUM") priorityClass = "label-warning";
                else if (priority === "LOW") priorityClass = "label-success";

                data += "<tr>";
                data += "<td><strong>" + escapeHtml(note.title || "Untitled") + "</strong></td>";
                data += "<td><span class='badge'>" + escapeHtml(note.category || "General") + "</span></td>";
                data += "<td><span class='label " + priorityClass + "'>" + escapeHtml(priority) + "</span></td>";
                data += "<td>" + statusBadge + "</td>";
                data += "<td>";
                data += "<a href='edit-note.html?id=" + note.id + "' class='btn btn-xs btn-primary' title='Edit'><i class='fa fa-edit'></i></a> ";
                data += "<button class='btn btn-xs btn-danger' onclick='deleteNote(" + note.id + ")' title='Move to Trash'><i class='fa fa-trash'></i></button>";
                data += "</td>";
                data += "</tr>";
            }

            // Count pinned and favourite across all active notes
            let allPinned = notes.filter(n => n.pinned === true).length;
            let allFav = notes.filter(n => n.favourite === true).length;

            $("#totalNotes").text(total);
            $("#pinnedNotes").text(allPinned);
            $("#favNotes").text(allFav);

            if (recentNotes.length > 0) {
                $("#recentNotes").html(data);
            } else {
                $("#recentNotes").html("<tr><td colspan='5' class='text-center text-muted' style='padding: 30px;'>No Notes Found. Click <a href='add-note.html'>Add Note</a> to get started.</td></tr>");
            }
        },
        error: function (xhr) {
            console.log("Dashboard API Error:", xhr);
            $("#totalNotes").text("0");
            $("#pinnedNotes").text("0");
            $("#favNotes").text("0");
            $("#recentNotes").html("<tr><td colspan='5' class='text-center text-danger'>Unable to load notes. Please check backend connection.</td></tr>");
        }
    });

    // 2. Fetch Trash Notes Count
    $.ajax({
        url: BASE_URL + "/notes/user/" + userId + "/trash",
        type: "GET",
        success: function (trashNotes) {
            let trashCount = Array.isArray(trashNotes) ? trashNotes.length : 0;
            $("#trashNotes").text(trashCount);
        },
        error: function () {
            $("#trashNotes").text("0");
        }
    });
}

// ========================================
// DELETE NOTE (MOVE TO TRASH)
// ========================================

function deleteNote(id) {
    if (!confirm("Move this note to Trash?")) {
        return;
    }

    $.ajax({
        url: BASE_URL + "/notes/trash/" + id,
        type: "PUT",
        success: function () {
            alert("Note moved to Trash.");
            loadDashboard();
        },
        error: function (xhr) {
            console.log("Delete Error:", xhr);
            alert("Unable to move note to trash.");
        }
    });
}

// ========================================
// LOGOUT
// ========================================

function logout() {
    if (confirm("Do you want to logout?")) {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userId");
        localStorage.removeItem("editNoteId");
        window.location.href = "login.html";
    }
}
