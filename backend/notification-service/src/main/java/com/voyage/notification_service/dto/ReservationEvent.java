package com.voyage.notification_service.dto;

import lombok.Data;

@Data
public class ReservationEvent {
    private Long reservationId;
    private Long userId;
    private String status;
    private String email;
}
