package com.voyage.reservation_service.dto;

import com.voyage.reservation_service.model.FlightClass;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationRequest {
    @NotNull
    private Long userId;

    // flightId or hotelId (at least one required; enforced in the service)
    private Long flightId;

    private Long hotelId;

    @Min(1)
    private int flightPassengers = 1;

    @Min(1)
    private int hotelPassengers = 1;

    @Min(1)
    private int numberOfNights = 1;

    private FlightClass flightClass = FlightClass.BASIC;
}
