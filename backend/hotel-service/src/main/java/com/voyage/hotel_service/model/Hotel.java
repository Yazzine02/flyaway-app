package com.voyage.hotel_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table(name = "hotels")
@Entity
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private String city;
}