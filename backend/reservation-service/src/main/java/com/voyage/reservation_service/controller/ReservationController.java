package com.voyage.reservation_service.controller;

import com.voyage.reservation_service.dto.ReservationRequest;
import com.voyage.reservation_service.model.Reservation;
import com.voyage.reservation_service.model.ReservationStatus;
import com.voyage.reservation_service.repository.ReservationRepository;
import com.voyage.reservation_service.service.ReservationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody ReservationRequest reservationRequest) {
        try {
            Reservation reservation = reservationService.createReservation(reservationRequest);

            // FAILED payments return 402 with the reservation for client display.
            if (reservation.getStatus() == ReservationStatus.FAILED) {
                return new ResponseEntity<>(reservation, HttpStatus.PAYMENT_REQUIRED);
            }
            return new ResponseEntity<>(reservation, HttpStatus.CREATED);

        } catch (Exception e) {
            log.error("Error creating reservation: {}", e.getMessage(), e);
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Current user's booking history; identity comes from the JWT claim.
    @GetMapping("/mine")
    public ResponseEntity<List<Reservation>> getMyReservations(@AuthenticationPrincipal Jwt jwt) {
        Number userId = jwt.getClaim("userId");
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(reservationRepository.findByUserIdOrderByDateDesc(userId.longValue()));
    }
}
