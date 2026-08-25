// =========================================
// VB Notes - Core Notes Handler (notes.js)
// =========================================

const BASE_URL = "https://notes-app-b63a.onrender.com";

// =========================================
// GET LOGGED IN USER ID
// =========================================

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

// =========================================
// TIME FORMATTERS
// =========================================

function timeAgo(dateString) {
    if (!dateString) return "";
    const created = new Date(dateString);
    if (isNaN(created.getTime())) return "";
    const now = new Date();
    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return seconds + "s ago";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + (minutes === 1 ? "m ago" : "m ago");
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + (hours === 1 ? "h ago" : "h ago");
    const days = Math.floor(hours / 24);
    if (days < 30) return days + (days === 1 ? "d ago" : "d ago");
    const months = Math.floor(days / 30);
    if (months < 12) return months + (months === 1 ? "mo ago" : "mo ago");
    const years = Math.floor(months / 12);
    return years + (years === 1 ? "y ago" : "y ago");
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

// =========================================
// ESCAPE HTML TO PREVENT XSS
// =========================================

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========================================
// LOAD USER NOTES ACCORDING TO CURRENT PAGE
// =========================================

function getCurrentPageType() {
    let path = window.location.pathname.toLowerCase();
    if (path.includes("pinned.html")) return "pinned";
    if (path.includes("favourite.html")) return "favourite";
    if (path.includes("archived.html")) return "archived";
    if (path.includes("trash.html")) return "trash";
    return "all";
}

function loadCurrentPageNotes() {
    let userId = getUserId();
    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    let type = getCurrentPageType();
    let url = BASE_URL + "/notes/user/" + userId;

    if (type === "pinned") {
        url = BASE_URL + "/notes/user/" + userId + "/pinned";
    } else if (type === "favourite") {
        url = BASE_URL + "/notes/user/" + userId + "/favourite";
    } else if (type === "archived") {
        url = BASE_URL + "/notes/user/" + userId + "/archived";
    } else if (type === "trash") {
        url = BASE_URL + "/notes/user/" + userId + "/trash";
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (response) {
            displayNotes(response);
        },
        error: function (xhr) {
            console.log("Load Notes Error:", xhr);
            $("#notesContainer").html(`
                <div class="col-md-12">
                    <div class="empty text-center">
                        <i class="fa fa-exclamation-triangle fa-3x text-danger"></i>
                        <h3>Unable to load notes</h3>
                        <p>Please check your backend connection or try again.</p>
                    </div>
                </div>
            `);
        }
    });
}

// Alias for backwards compatibility
function loadNotes() {
    loadCurrentPageNotes();
}

function loadSpecialNotes(type) {
    loadCurrentPageNotes();
}

// =========================================
// DISPLAY NOTES
// =========================================

function displayNotes(notes) {
    if (!Array.isArray(notes)) {
        notes = [];
    }

    let pageType = getCurrentPageType();

    if (notes.length === 0) {
        let emptyMessage = "No Notes Found";
        let emptySub = "Click 'Add Note' to create your first note.";
        let icon = "fa-book-open";

        if (pageType === "pinned") {
            emptyMessage = "No Pinned Notes";
            emptySub = "Pin important notes to access them quickly here.";
            icon = "fa-thumb-tack";
        } else if (pageType === "favourite") {
            emptyMessage = "No Favourite Notes";
            emptySub = "Star your favorite notes to keep them organized.";
            icon = "fa-star";
        } else if (pageType === "archived") {
            emptyMessage = "No Archived Notes";
            emptySub = "Archived notes will be preserved here.";
            icon = "fa-archive";
        } else if (pageType === "trash") {
            emptyMessage = "Trash is Empty";
            emptySub = "Deleted notes will appear here before permanent deletion.";
            icon = "fa-trash";
        }

        let emptyHtml = `
            <div class="col-md-12">
                <div class="empty text-center">
                    <i class="fa ${icon}"></i>
                    <h3>${emptyMessage}</h3>
                    <p>${emptySub}</p>
                    ${pageType === "all" ? '<a href="add-note.html" class="btn btn-primary" style="margin-top: 15px;"><i class="fa fa-plus-circle"></i> Create Note</a>' : ''}
                </div>
            </div>
        `;
        $("#notesContainer").html(emptyHtml);
        return;
    }

    // Sort: Pinned first (unless on special page), then newest created
    if (pageType === "all") {
        notes.sort(function (a, b) {
            if (a.pinned !== b.pinned) {
                return b.pinned ? 1 : -1;
            }
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }

    let data = "";

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        let colorClass = (note.color || "blue").toLowerCase();
        let priorityClass = "priority-" + (note.priority || "medium").toLowerCase();
        let formattedTime = timeAgo(note.createdAt) || formatDate(note.createdAt);

        data += `
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 note-grid-item">
            <div class="panel panel-default note-card color-${colorClass} ${note.pinned ? "is-pinned" : ""}">
                
                <div class="panel-heading note-header">
                    <div class="note-title-wrap">
                        <i class="fa fa-sticky-note note-title-icon"></i>
                        <h4 class="note-title" title="${escapeHtml(note.title)}">${escapeHtml(note.title)}</h4>
                    </div>
                    ${formattedTime ? `<span class="note-time"><i class="fa-regular fa-clock"></i> ${formattedTime}</span>` : ""}
                </div>

                <div class="panel-body note-body">
                    <p class="note-content">${escapeHtml(note.content)}</p>
                    
                    <div class="note-tags">
                        <span class="note-badge category-badge">
                            <i class="fa fa-folder-open"></i> ${escapeHtml(note.category || "General")}
                        </span>
                        
                        <span class="note-badge ${priorityClass}">
                            <i class="fa fa-flag"></i> ${escapeHtml(note.priority || "MEDIUM")}
                        </span>

                        ${note.color ? `
                        <span class="note-badge color-badge">
                            <span class="color-dot color-dot-${colorClass}"></span> ${escapeHtml(note.color)}
                        </span>` : ""}
                    </div>

                    <div class="note-status-badges">
                        ${note.pinned ? `<span class="label label-warning"><i class="fa fa-thumb-tack"></i> Pinned</span>` : ""}
                        ${note.favourite ? `<span class="label label-success"><i class="fa fa-star"></i> Favourite</span>` : ""}
                        ${note.archived ? `<span class="label label-info"><i class="fa fa-archive"></i> Archived</span>` : ""}
                        ${note.deleted ? `<span class="label label-danger"><i class="fa fa-trash"></i> In Trash</span>` : ""}
                    </div>
                </div>

                <div class="panel-footer note-footer">
                    ${pageType === "trash" ? `
                        <!-- RESTORE -->
                        <button class="btn btn-success btn-sm btn-action" onclick="restoreNote(${note.id})" title="Restore Note">
                            <i class="fa fa-undo"></i> Restore
                        </button>

                        <!-- PERMANENT DELETE -->
                        <button class="btn btn-danger btn-sm btn-action" onclick="deletePermanently(${note.id})" title="Delete Permanently">
                            <i class="fa fa-trash"></i> Delete Forever
                        </button>
                    ` : `
                        <!-- EDIT -->
                        <button class="btn btn-primary btn-sm btn-icon" onclick="editNote(${note.id})" title="Edit Note">
                            <i class="fa fa-edit"></i>
                        </button>

                        <!-- PIN -->
                        <button class="btn ${note.pinned ? "btn-warning" : "btn-default"} btn-sm btn-icon" onclick="pinNote(${note.id})" title="${note.pinned ? "Unpin Note" : "Pin Note"}">
                            <i class="fa fa-thumb-tack"></i>
                        </button>

                        <!-- FAVOURITE -->
                        <button class="btn ${note.favourite ? "btn-success" : "btn-default"} btn-sm btn-icon" onclick="favNote(${note.id})" title="${note.favourite ? "Remove Favourite" : "Add to Favourite"}">
                            <i class="fa fa-star"></i>
                        </button>

                        <!-- ARCHIVE -->
                        <button class="btn ${note.archived ? "btn-info" : "btn-default"} btn-sm btn-icon" onclick="archiveNote(${note.id})" title="${note.archived ? "Unarchive Note" : "Archive Note"}">
                            <i class="fa fa-archive"></i>
                        </button>

                        <!-- MOVE TO TRASH -->
                        <button class="btn btn-danger btn-sm btn-icon" onclick="moveToTrash(${note.id})" title="Move to Trash">
                            <i class="fa fa-trash"></i>
                        </button>
                    `}
                </div>

            </div>
        </div>
        `;
    }

    $("#notesContainer").html(data);
}

// =========================================
// SEARCH NOTES (User-Scoped)
// =========================================

function searchNotes(keyword) {
    let userId = getUserId();
    if (!userId) return;

    if (!keyword || keyword.trim() === "") {
        loadCurrentPageNotes();
        return;
    }

    $.ajax({
        url: BASE_URL + "/notes/user/" + userId + "/search?keyword=" + encodeURIComponent(keyword.trim()),
        type: "GET",
        success: function (response) {
            displayNotes(response);
        },
        error: function (xhr) {
            console.log("Search Error:", xhr);
        }
    });
}

// =========================================
// NOTE ACTIONS
// =========================================

function editNote(id) {
    localStorage.setItem("editNoteId", id);
    window.location.href = "edit-note.html?id=" + id;
}

function moveToTrash(id) {
    if (!confirm("Move this note to Trash?")) return;

    $.ajax({
        url: BASE_URL + "/notes/trash/" + id,
        type: "PUT",
        success: function () {
            loadCurrentPageNotes();
        },
        error: function (xhr) {
            console.log("Trash Error:", xhr);
            alert("Unable to move note to trash.");
        }
    });
}

// Alias for backwards compatibility
function deleteNote(id) {
    let page = getCurrentPageType();
    if (page === "trash") {
        deletePermanently(id);
    } else {
        moveToTrash(id);
    }
}

function restoreNote(id) {
    $.ajax({
        url: BASE_URL + "/notes/restore/" + id,
        type: "PUT",
        success: function () {
            alert("Note restored successfully.");
            loadCurrentPageNotes();
        },
        error: function (xhr) {
            console.log("Restore Error:", xhr);
            alert("Unable to restore note.");
        }
    });
}

function deletePermanently(id) {
    if (!confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
        return;
    }

    $.ajax({
        url: BASE_URL + "/notes/delete/" + id,
        type: "DELETE",
        success: function () {
            alert("Note deleted permanently.");
            loadCurrentPageNotes();
        },
        error: function (xhr) {
            console.log("Permanent Delete Error:", xhr);
            alert("Unable to delete note.");
        }
    });
}

function pinNote(id) {
    $.ajax({
        url: BASE_URL + "/notes/pin/" + id,
        type: "PUT",
        success: function () {
            loadCurrentPageNotes();
        },
        error: function (xhr) {
            console.log("Pin Error:", xhr);
            alert("Unable to update pin status.");
        }
    });
}

function favNote(id) {
    $.ajax({
        url: BASE_URL + "/notes/favourite/" + id,
        type: "PUT",
        success: function () {
            loadCurrentPageNotes();
        },
        error: function (xhr) {
            console.log("Favourite Error:", xhr);
            alert("Unable to update favourite status.");
        }
    });
}

function archiveNote(id) {
    $.ajax({
        url: BASE_URL + "/notes/archive/" + id,
        type: "PUT",
        success: function () {
            loadCurrentPageNotes();
        },
        error: function (xhr) {
            console.log("Archive Error:", xhr);
            alert("Unable to update archive status.");
        }
    });
}

// =========================================
// LOGOUT
// =========================================

function logout() {
    if (confirm("Do you want to logout?")) {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userId");
        localStorage.removeItem("editNoteId");
        window.location.href = "login.html";
    }
}

// =========================================
// PAGE INITIALIZATION
// =========================================

$(document).ready(function () {
    // Check authentication
    let userId = getUserId();
    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // Set user name if element exists
    let storedUser = localStorage.getItem("loggedInUser");
    if (storedUser && storedUser !== "undefined") {
        try {
            let u = JSON.parse(storedUser);
            if (u.fullName) {
                $("#topbarUserName, #studentName").text(u.fullName);
            }
        } catch (e) {}
    }

    // Load notes
    loadCurrentPageNotes();

    // Search Box Listener
    let searchTimeout = null;
    $("#searchBox").on("input keyup", function () {
        clearTimeout(searchTimeout);
        let keyword = $(this).val();
        searchTimeout = setTimeout(function () {
            searchNotes(keyword);
        }, 200);
    });
});
