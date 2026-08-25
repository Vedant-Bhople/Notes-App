package com.vb.notes.dto;

public class UserDTO {

	private String fullName;
	private String email;
	private String password;
	private String mobile;

	public UserDTO() {
	}

	public UserDTO(String fullName, String email, String password, String mobile) {
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.mobile = mobile;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
}