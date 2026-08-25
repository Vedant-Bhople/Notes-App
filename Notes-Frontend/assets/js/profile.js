// ================================
// VB Notes - Profile
// ================================

$(document).ready(function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user || user === "undefined") {
        alert("Please Login First");
        window.location.href = "login.html";
        return;
    }

    try {
        user = JSON.parse(user);
        let name = user.fullName || "User";
        let email = user.email || "-";
        let mobile = user.mobile || "-";
        let status = user.status || "ACTIVE";

        $("#profileName").text(name);
        $("#profileEmail").text(email);
        $("#fullName").text(name);
        $("#email").text(email);
        $("#mobile").text(mobile);
        $("#status").text(status);
    } catch (e) {
        console.error("Profile parse error:", e);
    }
});

// ================================
// Logout
// ================================

function logout() {
    if (confirm("Do you want to logout?")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
}
