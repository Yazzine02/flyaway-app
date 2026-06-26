package com.voyage.reservation_service.client;

import com.voyage.reservation_service.dto.HotelDTO;
import org.springframework.stereotype.Component;

@Component
public class HotelClientFallback implements HotelClient {

    @Override
    public HotelDTO getHotelById(Long id) {
        throw new RuntimeException("Hotel Service is currently unavailable...");
    }
}
