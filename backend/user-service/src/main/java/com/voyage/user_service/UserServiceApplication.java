package com.voyage.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

//    public static void main(String[] args) {
//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//        String rawPassword = "pass123";
//        String encodedPassword = encoder.encode(rawPassword);
//        System.out.println("Hashed password for 'pass123' is: " + encodedPassword);
//
//        // Run this for your other passwords
//        System.out.println("Hashed for 'alicepass': " + encoder.encode("alicepass"));
//
//        SpringApplication.run(UserServiceApplication.class, args);
//    }
}