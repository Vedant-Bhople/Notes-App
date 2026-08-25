package com.vb.notes.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vb.notes.dto.UserDTO;
import com.vb.notes.model.User;
import com.vb.notes.response.ApiResponse;
import com.vb.notes.service.UserService;

import com.vb.notes.dto.LoginDTO;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {


	@Autowired
	private UserService userService;



	// ==========================
	// REGISTER USER
	// ==========================

	@PostMapping("/register")
	public ResponseEntity<?> register(
			@RequestBody UserDTO userDTO) {


		User user = userService.register(userDTO);


		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(user);

	}




//
//	// ==========================
//	// LOGIN USER
//	// ==========================
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {

	    User user = userService.login(
	            loginDTO.getEmail(),
	            loginDTO.getPassword()
	    );

	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Invalid email or password");
	    }

	    return ResponseEntity.ok(user);
	}


	// ==========================
	// GET ALL USERS
	// ==========================

	@GetMapping("/all")
	public ResponseEntity<List<User>> getAllUsers() {


		return ResponseEntity.ok(
				userService.getAllUsers()
		);

	}

}