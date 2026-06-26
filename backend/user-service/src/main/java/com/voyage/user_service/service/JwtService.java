package com.voyage.user_service.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.xml.bind.DatatypeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

@Service
public class JwtService {
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    @Value("${jwt.secret}")
    private String secret;
    @PostConstruct
    public void logInjectedSecret() {
        log.info(">>>> Injected jwt.secret value: [{}]", secret); // Log with brackets to see whitespace
    }
    public String generateToken(String username, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        // --- CHANGE 2: Add userId to the claims map ---
        claims.put("userId", userId);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30)) // 30 min expiration
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    public Key getSignKey() {
        log.debug("Decoding secret key hex...");
        byte[] keyBytes = HexFormat.of().parseHex(secret);
        log.debug("Secret key decoded successfully.");
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
