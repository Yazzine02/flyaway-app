package com.voyage.reservation_service.dto;

import com.voyage.reservation_service.model.FlightClass;
import lombok.Data;

@Data
public class ReservationRequest {
    private Long userId;
    private Long flightId;
    private Long hotelId;

    private int flightPassengers = 1;
    private int hotelPassengers = 1;

    // --- NEW FIELD ---
    private int numberOfNights = 1;

    private FlightClass flightClass = FlightClass.BASIC;
}