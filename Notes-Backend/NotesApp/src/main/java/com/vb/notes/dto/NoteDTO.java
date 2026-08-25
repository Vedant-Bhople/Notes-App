package com.vb.notes.dto;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class NoteDTO {


	private int id;


	@NotBlank(message = "Title is required")
	@Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
	private String title;


	@NotBlank(message = "Content is required")
	private String content;


	private String category;


	private String color;


	@Pattern(
			regexp = "HIGH|MEDIUM|LOW",
			message = "Priority must be HIGH, MEDIUM or LOW"
			)
			private String priority;



	// Phase 2 Features

	private boolean pinned;


	private boolean archived;


	private boolean favourite;


	private boolean deleted;




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




	// ======================
	// Phase 2 Getters Setters
	// ======================


	public boolean isPinned() {
		return pinned;
	}


	public void setPinned(boolean pinned) {
		this.pinned = pinned;
	}




	public boolean isArchived() {
		return archived;
	}


	public void setArchived(boolean archived) {
		this.archived = archived;
	}




	public boolean isFavourite() {
		return favourite;
	}


	public void setFavourite(boolean favourite) {
		this.favourite = favourite;
	}




	public boolean isDeleted() {
		return deleted;
	}


	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

}