package com.vb.notes.service;

import java.util.List;

import com.vb.notes.dto.NoteDTO;
import com.vb.notes.model.Note;

public interface NoteService {

    // =========================
    // BASIC NOTES
    // =========================

    Note saveNote(NoteDTO dto, int userId);

    List<Note> getAllNotes();

    Note getNoteById(int id);

    Note updateNote(int id, NoteDTO dto);

    List<Note> searchNotes(String keyword);

    List<Note> searchNotesByUser(int userId, String keyword);

    List<Note> getNotesByUser(int userId);

    void deleteNote(int id);


    // =========================
    // PHASE 2
    // =========================

    void pinNote(int id);

    void archiveNote(int id);

    void favouriteNote(int id);

    void trashNote(int id);

    void restoreNote(int id);


    // =========================
    // USER WISE PHASE 2
    // =========================

    List<Note> getPinnedNotes(int userId);

    List<Note> getArchivedNotes(int userId);

    List<Note> getFavouriteNotes(int userId);

    List<Note> getTrashNotes(int userId);

}