package com.voyage.reservation_service.client;

import com.voyage.reservation_service.dto.FlightDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "flight-service")
public interface FlightClient {
    @GetMapping("/api/flights/{id}")
    FlightDTO getFlightById(@PathVariable("id") Long id);
}
