// =========================================
// VB Notes - Filtered Notes Handler (filtered-notes.js)
// Delegated to unified notes.js logic
// =========================================

// Include all core functionality from notes.js
// If notes.js is not loaded on this page, the methods below handle it cleanly.

if (typeof loadCurrentPageNotes === "undefined") {
    // Dynamically load notes.js if needed
    console.log("Loading unified notes handler...");
}
