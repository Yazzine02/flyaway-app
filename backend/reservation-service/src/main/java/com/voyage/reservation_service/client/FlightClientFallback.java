package com.voyage.reservation_service.client;

import com.voyage.reservation_service.dto.FlightDTO;
import org.springframework.stereotype.Component;

@Component
public class FlightClientFallback implements FlightClient {
    @Override
    public FlightDTO getFlightById(Long id) {
        throw new RuntimeException("Flight Service is currently unavailable. Please try again later.");
    }
}
