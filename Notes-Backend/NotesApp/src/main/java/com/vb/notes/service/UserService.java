package com.vb.notes.service;

import java.util.List;

import com.vb.notes.dto.UserDTO;
import com.vb.notes.model.User;

public interface UserService {

	User register(UserDTO userDTO);

	User login(String email,String password);

	List<User> getAllUsers();

}