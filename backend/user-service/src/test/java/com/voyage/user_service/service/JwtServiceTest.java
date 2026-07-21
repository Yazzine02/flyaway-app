package com.voyage.user_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET =
            "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final JwtService jwtService = new JwtService();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtService, "secret", SECRET);
    }

    @Test
    void generatesSignedTokenWithSubjectUserIdAndFutureExpiry() throws Exception {
        String token = jwtService.generateToken("alice", 42L);

        String[] parts = token.split("\\.");
        assertThat(parts).hasSize(3);

        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        Map<String, Object> claims = MAPPER.readValue(payloadJson, new TypeReference<>() {});

        assertThat(claims.get("sub")).isEqualTo("alice");
        assertThat(((Number) claims.get("userId")).longValue()).isEqualTo(42L);
        assertThat(((Number) claims.get("exp")).longValue() * 1000L)
                .isGreaterThan(System.currentTimeMillis());
    }
}
