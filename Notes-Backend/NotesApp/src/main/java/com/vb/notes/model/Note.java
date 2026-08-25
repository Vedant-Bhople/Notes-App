package com.vb.notes.model;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "notes")
public class Note {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;


	@Column(nullable = false)
	private String title;


	@Column(columnDefinition = "LONGTEXT", nullable = false)
	private String content;


	private String category;


	private String color;


	@Column(nullable = false)
	private String priority;


	@Column(name = "is_pinned")
	private boolean isPinned;


	@Column(name = "is_archived")
	private boolean isArchived;


	// Phase 2

	@Column(name = "is_favourite")
	private boolean isFavourite;

	@Column(name = "is_deleted")
	private boolean isDeleted;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;


	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;



	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonBackReference
	private User user;



	public Note() {

	}



	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getContent() {
		return content;
	}


	public void setContent(String content) {
		this.content = content;
	}


	public String getCategory() {
		return category;
	}


	public void setCategory(String category) {
		this.category = category;
	}


	public String getColor() {
		return color;
	}


	public void setColor(String color) {
		this.color = color;
	}


	public String getPriority() {
		return priority;
	}


	public void setPriority(String priority) {
		this.priority = priority;
	}


	public boolean isPinned() {
		return isPinned;
	}


	public void setPinned(boolean pinned) {
		isPinned = pinned;
	}


	public boolean isArchived() {
		return isArchived;
	}


	public void setArchived(boolean archived) {
		isArchived = archived;
	}



	// Favourite

	public boolean isFavourite() {
		return isFavourite;
	}


	public void setFavourite(boolean favourite) {
		isFavourite = favourite;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}


	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}


	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}


	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}


	public User getUser() {
		return user;
	}


	public void setUser(User user) {
		this.user = user;
	}

}