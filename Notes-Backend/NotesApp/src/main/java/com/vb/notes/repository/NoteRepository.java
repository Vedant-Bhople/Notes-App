package com.vb.notes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vb.notes.model.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Integer> {

    // Global Search
    List<Note> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String title,
            String content
    );

    // User-scoped Search (Active notes only)
    @Query("SELECT n FROM Note n WHERE n.user.id = :userId AND n.isDeleted = false AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Note> searchNotesByUser(@Param("userId") int userId, @Param("keyword") String keyword);

    // User wise all notes
    List<Note> findByUserId(int userId);

    // User wise active (non-deleted) notes
    List<Note> findByUserIdAndIsDeletedFalse(int userId);

    // User wise pinned active notes
    List<Note> findByUserIdAndIsPinnedTrueAndIsDeletedFalse(int userId);

    // User wise archived active notes
    List<Note> findByUserIdAndIsArchivedTrueAndIsDeletedFalse(int userId);

    // User wise favourite active notes
    List<Note> findByUserIdAndIsFavouriteTrueAndIsDeletedFalse(int userId);

    // User wise trash (deleted) notes
    List<Note> findByUserIdAndIsDeletedTrue(int userId);

    // Legacy / Phase 2 fallback
    List<Note> findByUserIdAndIsPinnedTrue(int userId);

    List<Note> findByUserIdAndIsArchivedTrue(int userId);

    List<Note> findByUserIdAndIsFavouriteTrue(int userId);

}