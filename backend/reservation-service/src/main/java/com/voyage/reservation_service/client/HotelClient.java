package com.voyage.reservation_service.client;

import com.voyage.reservation_service.dto.HotelDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "hotel-service")
public interface HotelClient {
    @GetMapping("/api/hotels/{id}")
    HotelDTO getHotelById(@PathVariable("id") Long id);
}
