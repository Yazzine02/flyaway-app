package com.voyage.reservation_service.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long userId;
    private double amount;

    public PaymentRequest(Long userId, double amount) {
        this.userId = userId;
        this.amount = amount;
    }
}
