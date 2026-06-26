package com.voyage.reservation_service.client;

import com.voyage.reservation_service.dto.PaymentRequest;
import com.voyage.reservation_service.dto.PaymentResponse;
import org.springframework.stereotype.Component;

@Component
public class PaymentClientFallback implements PaymentClient{
    @Override
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        return new PaymentResponse("FAILED", null, "Payment service is temporarily down.");
    }
}
