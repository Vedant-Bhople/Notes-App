package com.vb.notes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vb.notes.exception.NoteNotFoundException;
import com.vb.notes.exception.UserNotFoundException;

import com.vb.notes.dto.NoteDTO;
import com.vb.notes.model.Note;
import com.vb.notes.model.User;
import com.vb.notes.repository.NoteRepository;
import com.vb.notes.repository.UserRepository;

@Service
public class NoteServiceImpl implements NoteService {

	@Autowired
	private NoteRepository noteRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public Note saveNote(NoteDTO dto, int userId) {

		User user = userRepository.findById(userId)
		        .orElseThrow(
		        () -> new UserNotFoundException(
		        "User not found with id : " + userId));

		Note note = new Note();

		note.setTitle(dto.getTitle());
		note.setContent(dto.getContent());
		note.setCategory(dto.getCategory());
		note.setColor(dto.getColor());

		if (dto.getPriority() == null || dto.getPriority().trim().isEmpty()) {
			note.setPriority("MEDIUM");
		} else {
			note.setPriority(dto.getPriority().toUpperCase());
		}

		// Phase 2 Default Values
		note.setPinned(false);
		note.setArchived(false);
		note.setFavourite(false);
		note.setDeleted(false);
		note.setUser(user);

		return noteRepository.save(note);
	}

	@Override
	public List<Note> getAllNotes() {
		return noteRepository.findAll();
	}

	@Override
	public Note getNoteById(int id) {
		return noteRepository.findById(id)
		        .orElseThrow(
		        () -> new NoteNotFoundException(
		        "Note not found with id : " + id));
	}

	@Override
	public Note updateNote(int id, NoteDTO dto) {

		Note note = noteRepository.findById(id)
		        .orElseThrow(
		        () -> new NoteNotFoundException(
		        "Note not found with id : " + id));

		note.setTitle(dto.getTitle());
		note.setContent(dto.getContent());
		note.setCategory(dto.getCategory());
		note.setColor(dto.getColor());

		if (dto.getPriority() == null || dto.getPriority().trim().isEmpty()) {
			note.setPriority("MEDIUM");
		} else {
			note.setPriority(dto.getPriority().toUpperCase());
		}

		return noteRepository.save(note);
	}

	@Override
	public List<Note> searchNotes(String keyword) {
		return noteRepository
				.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword);
	}

	@Override
	public List<Note> searchNotesByUser(int userId, String keyword) {
		return noteRepository.searchNotesByUser(userId, keyword);
	}

	@Override
	public List<Note> getNotesByUser(int userId) {
		return noteRepository.findByUserIdAndIsDeletedFalse(userId);
	}

	@Override
	public void deleteNote(int id) {
		if (!noteRepository.existsById(id)) {
			throw new NoteNotFoundException("Note not found with id : " + id);
		}
		noteRepository.deleteById(id);
	}

	// =====================================
	// Phase 2 Implementation
	// =====================================

	@Override
	public void pinNote(int id) {
		Note note = noteRepository.findById(id)
		        .orElseThrow(() -> new NoteNotFoundException("Note not found with id : " + id));
		note.setPinned(!note.isPinned());
		noteRepository.save(note);
	}

	@Override
	public void archiveNote(int id) {
		Note note = noteRepository.findById(id)
		        .orElseThrow(() -> new NoteNotFoundException("Note not found with id : " + id));
		note.setArchived(!note.isArchived());
		noteRepository.save(note);
	}

	@Override
	public void favouriteNote(int id) {
		Note note = noteRepository.findById(id)
		        .orElseThrow(() -> new NoteNotFoundException("Note not found with id : " + id));
		note.setFavourite(!note.isFavourite());
		noteRepository.save(note);
	}

	@Override
	public void trashNote(int id) {
		Note note = noteRepository.findById(id)
		        .orElseThrow(() -> new NoteNotFoundException("Note not found with id : " + id));
		note.setDeleted(true);
		noteRepository.save(note);
	}

	@Override
	public void restoreNote(int id) {
		Note note = noteRepository.findById(id)
		        .orElseThrow(() -> new NoteNotFoundException("Note not found with id : " + id));
		note.setDeleted(false);
		noteRepository.save(note);
	}

	// =====================================
	// USER WISE PHASE 2
	// =====================================

	@Override
	public List<Note> getPinnedNotes(int userId) {
	    return noteRepository.findByUserIdAndIsPinnedTrueAndIsDeletedFalse(userId);
	}

	@Override
	public List<Note> getArchivedNotes(int userId) {
	    return noteRepository.findByUserIdAndIsArchivedTrueAndIsDeletedFalse(userId);
	}

	@Override
	public List<Note> getFavouriteNotes(int userId) {
	    return noteRepository.findByUserIdAndIsFavouriteTrueAndIsDeletedFalse(userId);
	}

	@Override
	public List<Note> getTrashNotes(int userId) {
	    return noteRepository.findByUserIdAndIsDeletedTrue(userId);
	}

}