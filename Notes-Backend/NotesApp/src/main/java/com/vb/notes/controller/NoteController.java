package com.vb.notes.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vb.notes.dto.NoteDTO;
import com.vb.notes.model.Note;
import com.vb.notes.response.ApiResponse;
import com.vb.notes.service.NoteService;

@RestController
@RequestMapping("/notes")
@CrossOrigin("*")
public class NoteController {

    @Autowired
    private NoteService noteService;


    // ==========================
    // CREATE NOTE
    // ==========================

    @PostMapping("/save/{userId}")
    public ResponseEntity<?> saveNote(
            @Valid @RequestBody NoteDTO dto,
            @PathVariable int userId) {

        Note note = noteService.saveNote(dto, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(note);
    }


    // ==========================
    // GET ALL NOTES
    // ==========================

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllNotes() {

        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Notes fetched successfully",
                        noteService.getAllNotes()
                )
        );
    }


    // ==========================
    // GET NOTE BY ID
    // ==========================

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getNoteById(
            @PathVariable int id) {

        return ResponseEntity.ok(
                noteService.getNoteById(id)
        );
    }


    // ==========================
    // SEARCH NOTES
    // ==========================

    @GetMapping("/search")
    public ResponseEntity<List<Note>> searchNotes(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer userId) {

        if (userId != null && userId > 0) {
            return ResponseEntity.ok(
                    noteService.searchNotesByUser(userId, keyword)
            );
        }

        return ResponseEntity.ok(
                noteService.searchNotes(keyword)
        );
    }

    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<Note>> searchUserNotes(
            @PathVariable int userId,
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                noteService.searchNotesByUser(userId, keyword)
        );
    }


    // ==========================
    // UPDATE NOTE
    // ==========================

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateNote(
            @PathVariable int id,
            @Valid @RequestBody NoteDTO dto) {

        return ResponseEntity.ok(
                noteService.updateNote(id, dto)
        );
    }


    // ==========================
    // DELETE NOTE (Permanent)
    // ==========================

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteNote(
            @PathVariable int id) {

        noteService.deleteNote(id);

        return ResponseEntity.ok(
                "Note deleted successfully"
        );
    }


    // ==========================
    // USER WISE NOTES (Active)
    // ==========================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Note>> getNotesByUser(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                noteService.getNotesByUser(userId)
        );
    }


    // =================================================
    // PHASE 2 FEATURES
    // =================================================


    // ==========================
    // PIN / UNPIN
    // ==========================

    @PutMapping("/pin/{id}")
    public ResponseEntity<String> pinNote(
            @PathVariable int id) {

        noteService.pinNote(id);

        return ResponseEntity.ok(
                "Pin updated successfully"
        );
    }


    // ==========================
    // ARCHIVE / UNARCHIVE
    // ==========================

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archiveNote(
            @PathVariable int id) {

        noteService.archiveNote(id);

        return ResponseEntity.ok(
                "Archive updated successfully"
        );
    }


    // ==========================
    // FAVOURITE / UNFAVOURITE
    // ==========================

    @PutMapping("/favourite/{id}")
    public ResponseEntity<String> favouriteNote(
            @PathVariable int id) {

        noteService.favouriteNote(id);

        return ResponseEntity.ok(
                "Favourite updated successfully"
        );
    }


    // ==========================
    // MOVE TO TRASH
    // ==========================

    @PutMapping("/trash/{id}")
    public ResponseEntity<String> trashNote(
            @PathVariable int id) {

        noteService.trashNote(id);

        return ResponseEntity.ok(
                "Note moved to trash"
        );
    }


    // ==========================
    // RESTORE FROM TRASH
    // ==========================

    @PutMapping("/restore/{id}")
    public ResponseEntity<String> restoreNote(
            @PathVariable int id) {

        noteService.restoreNote(id);

        return ResponseEntity.ok(
                "Note restored successfully"
        );
    }


    // =================================================
    // USER WISE PHASE 2 & TRASH
    // =================================================


    // ==========================
    // GET PINNED
    // ==========================

    @GetMapping("/user/{userId}/pinned")
    public ResponseEntity<List<Note>> getPinnedNotes(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                noteService.getPinnedNotes(userId)
        );
    }


    // ==========================
    // GET ARCHIVED
    // ==========================

    @GetMapping("/user/{userId}/archived")
    public ResponseEntity<List<Note>> getArchivedNotes(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                noteService.getArchivedNotes(userId)
        );
    }


    // ==========================
    // GET FAVOURITE
    // ==========================

    @GetMapping("/user/{userId}/favourite")
    public ResponseEntity<List<Note>> getFavouriteNotes(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                noteService.getFavouriteNotes(userId)
        );
    }


    // ==========================
    // GET TRASH
    // ==========================

    @GetMapping("/user/{userId}/trash")
    public ResponseEntity<List<Note>> getTrashNotes(
            @PathVariable int userId) {

        return ResponseEntity.ok(
                noteService.getTrashNotes(userId)
        );
    }

}