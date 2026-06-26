package com.voyage.user_service.controller;

import com.voyage.user_service.dto.AuthRequest;
import com.voyage.user_service.dto.AuthResponse;
import com.voyage.user_service.model.User;
import com.voyage.user_service.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private AuthenticationService authenticationService;
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest){
        AuthResponse response = authenticationService.loginUser(authRequest);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/users/register")
    public ResponseEntity<User> register(@RequestBody User user){
        User registeredUser = authenticationService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }
}
