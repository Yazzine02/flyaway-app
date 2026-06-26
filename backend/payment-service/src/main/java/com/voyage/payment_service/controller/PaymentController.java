package com.voyage.payment_service.controller;

import com.voyage.payment_service.dto.PaymentRequest;
import com.voyage.payment_service.dto.PaymentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @PostMapping("/process")
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest paymentDetails) {
        boolean paymentSuccess = new Random().nextBoolean();

        if (paymentSuccess) {
            PaymentResponse paymentResponse = new PaymentResponse(
                    "SUCCESS",
                    "txn_" + System.currentTimeMillis(),
                    null
            );
            return ResponseEntity.ok(paymentResponse);
        } else {
            PaymentResponse paymentResponse = new PaymentResponse(
                    "FAILED",
                    null,
                    "Insufficient funds"
            );
            return ResponseEntity.ok(paymentResponse);
        }
    }
}
