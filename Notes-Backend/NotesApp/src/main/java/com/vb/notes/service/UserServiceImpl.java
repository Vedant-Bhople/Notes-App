package com.vb.notes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.vb.notes.dto.UserDTO;
import com.vb.notes.model.User;
import com.vb.notes.repository.UserRepository;


@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Override
	public User register(UserDTO userDTO) {

	    User existingUser = userRepository.findByEmail(userDTO.getEmail());

	    if (existingUser != null) {
	        throw new RuntimeException("Email already exists.");
	    }

	    User user = new User();

	    user.setFullName(userDTO.getFullName());
	    user.setEmail(userDTO.getEmail());
	    user.setPassword(
	            passwordEncoder.encode(
	                    userDTO.getPassword()
	            )
	    );
	    user.setMobile(userDTO.getMobile());
	    user.setStatus("ACTIVE");

	    return userRepository.save(user);
	}

	@Override
	public User login(String email, String password) {


		User user = userRepository.findByEmail(email);


		if(user != null && 
				passwordEncoder.matches(
						password,
						user.getPassword()
				)) {


			return user;

		}


		return null;

	}

	@Override
	public List<User> getAllUsers() {

		return userRepository.findAll();
	}

}