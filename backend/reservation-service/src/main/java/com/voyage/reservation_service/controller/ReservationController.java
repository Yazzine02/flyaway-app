package com.voyage.reservation_service.controller;

import com.voyage.reservation_service.dto.ReservationRequest;
import com.voyage.reservation_service.model.Reservation;
import com.voyage.reservation_service.model.ReservationStatus;
import com.voyage.reservation_service.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // --- ADD THIS LOGGER ---
    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequest reservationRequest) {
        try{
            Reservation reservation = reservationService.createReservation(reservationRequest);

            if(reservation.getStatus() == ReservationStatus.FAILED){
                // --- (See Bug Fix #1 below) ---
                // This should return the reservation object, not null
                return new ResponseEntity<>(reservation, HttpStatus.PAYMENT_REQUIRED);
            }
            return new ResponseEntity<>(reservation, HttpStatus.CREATED);

        } catch (Exception e){
            // --- THIS IS THE FIX ---
            // Log the full error stack trace to your console
            log.error("Error creating reservation: {}", e.getMessage(), e);
            // --- END OF FIX ---

            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}