package com.voyage.payment_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull
    private Long userId;

    @Positive
    private double amount;

    public PaymentRequest(Long userId, double amount) {
        this.userId = userId;
        this.amount = amount;
    }
}
