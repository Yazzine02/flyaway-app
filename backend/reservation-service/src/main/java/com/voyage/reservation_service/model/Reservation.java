package com.voyage.reservation_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long flightId;
    private Long hotelId;
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    private int flightPassengers;
    private int hotelPassengers;
    private double baseFlightPrice;
    private double baseHotelPrice;
    @Enumerated(EnumType.STRING)
    private FlightClass flightClass;
    private double flightClassCharge;
    private double totalPrice;

    private LocalDateTime date;
}
