package com.voyage.reservation_service.model;

public enum FlightClass {
    BASIC(0.0),
    FLEX(200.0),
    SUPER_FLEX(600.0);

    private final double price;

    FlightClass(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }
}
