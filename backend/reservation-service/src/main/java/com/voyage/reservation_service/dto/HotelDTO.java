package com.voyage.reservation_service.dto;

import lombok.Data;

@Data
public class HotelDTO {
    private Long id;
    private String name;
    private String city;
    private double price;
}
