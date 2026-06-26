package com.voyage.flight_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Table(name = "flights")
@Entity
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightName;
    private String departure;
    private String destination;
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;
    private double price;
}
