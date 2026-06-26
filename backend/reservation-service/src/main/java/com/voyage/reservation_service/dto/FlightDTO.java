package com.voyage.reservation_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FlightDTO {
    private Long id;
    private String flightName;
    private String departure;
    private String destination;
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;
    private double price;
}
